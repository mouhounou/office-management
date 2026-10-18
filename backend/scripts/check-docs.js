/**
 * Test de contrat entre la documentation et l'API réelle.
 *
 *   node scripts/check-docs.js            (l'API doit tourner)
 *   node scripts/check-docs.js --url http://localhost:5000/api
 *
 * Pour chaque opération décrite dans le document OpenAPI, on vérifie que :
 *   1. la route existe vraiment (pas de « Route introuvable ») ;
 *   2. elle est protégée si la documentation l'annonce comme telle.
 *
 * Les requêtes sont inoffensives : les identifiants utilisés n'existent pas, et
 * les corps envoyés sont vides (rejetés par la validation avant tout écriture).
 * Sort en code 1 au moindre écart : utilisable en intégration continue.
 */
require("../config/env");

const { buildOpenApiDocument } = require("../docs/openapi");

const args = process.argv.slice(2);
const baseUrl =
  args[args.indexOf("--url") + 1] && args.includes("--url")
    ? args[args.indexOf("--url") + 1]
    : `http://localhost:${require("../config/env").port}/api`;

// Compte administrateur utilisé pour appeler les routes protégées.
const ADMIN = {
  email: process.env.DOCS_CHECK_EMAIL || "admin@office.cg",
  password: process.env.DOCS_CHECK_PASSWORD || "admin1234",
};

// Identifiants volontairement inexistants : la route répond 404 « ressource
// introuvable », ce qui prouve qu'elle existe sans rien modifier.
const PLACEHOLDERS = {
  id: "000000000000000000000000",
  docId: "000000000000000000000000",
  key: "contact",
};

function resolvePath(path) {
  return path.replace(/\{(\w+)\}/g, (_, name) => PLACEHOLDERS[name] ?? "placeholder");
}

/** L'API distingue « route inconnue » (404 du routeur) de « ressource absente ». */
async function isMissingRoute(response) {
  if (response.status !== 404) return false;
  const payload = await response.clone().json().catch(() => null);
  return String(payload?.error?.message ?? "").startsWith("Route introuvable");
}

async function call(method, path, token) {
  return fetch(`${baseUrl}${resolvePath(path)}`, {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // Corps vide : suffisant pour atteindre le routeur, rejeté par la validation.
    ...(["post", "patch", "put"].includes(method) ? { body: "{}" } : {}),
  });
}

async function run() {
  const document = buildOpenApiDocument();

  const login = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ADMIN),
  }).catch(() => null);

  if (!login || !login.ok) {
    console.error(
      `Impossible de se connecter sur ${baseUrl} avec ${ADMIN.email}. Démarrez l'API (pnpm dev) ` +
        "et vérifiez le compte administrateur.",
    );
    process.exit(1);
  }
  const { token } = await login.json();

  const missing = [];
  const unprotected = [];
  let checked = 0;

  for (const [path, operations] of Object.entries(document.paths)) {
    for (const [method, operation] of Object.entries(operations)) {
      checked += 1;

      const authed = await call(method, path, token);
      if (await isMissingRoute(authed)) {
        missing.push(`${method.toUpperCase()} ${path} → route absente de l'API`);
        continue;
      }

      // `security: []` marque explicitement les routes publiques.
      const isPublic = Array.isArray(operation.security) && operation.security.length === 0;
      if (isPublic) continue;

      const anonymous = await call(method, path, null);
      if (![401, 403].includes(anonymous.status)) {
        unprotected.push(
          `${method.toUpperCase()} ${path} → documentée comme protégée mais répond ${anonymous.status} sans jeton`,
        );
      }
    }
  }

  console.log(`${checked} opérations vérifiées sur ${baseUrl}`);

  for (const line of [...missing, ...unprotected]) console.log("  ✗", line);

  if (missing.length || unprotected.length) {
    console.log(`\n${missing.length} route(s) manquante(s), ${unprotected.length} mal protégée(s).`);
    process.exit(1);
  }

  console.log("Toutes les opérations documentées existent et respectent leur niveau d'accès.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
