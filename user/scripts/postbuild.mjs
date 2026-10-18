// Après `vite build` : dist/ est le site statique à mettre en ligne.
// 404.html reprend la coquille de l'application : les hébergeurs qui servent
// 404.html pour les adresses inconnues (Netlify, GitHub Pages, Vercel…)
// affichent ainsi les pages non pré-générées au lieu d'une erreur.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const shell = "dist/_shell.html";
if (!existsSync(shell)) {
  console.error("postbuild : dist/_shell.html introuvable, le build a-t-il échoué ?");
  process.exit(1);
}

// Marqueur lu par src/routes/__root.tsx : la page démarre depuis la coquille.
const marker = "<script>window.__OM_SHELL__=true</script>";
let html = readFileSync(shell, "utf8");
if (!html.includes(marker)) html = html.replace("<head>", `<head>${marker}`);
if (!html.includes(marker)) {
  console.error("postbuild : balise <head> introuvable dans _shell.html");
  process.exit(1);
}
writeFileSync(shell, html);
writeFileSync("dist/404.html", html);

// Anciennes pages regroupées dans des sections : redirections 301 vers leur
// nouvelle adresse, placées avant la règle de repli vers la coquille.
const legacy = JSON.parse(readFileSync("src/lib/legacy-redirects.json", "utf8"));
const entries = Object.entries(legacy);

const netlify = entries.map(([from, to]) => `${from}  ${to}  301`).join("\n");
const redirects = readFileSync("dist/_redirects", "utf8");
writeFileSync("dist/_redirects", redirects.replace("/*  /_shell.html  200", `${netlify}\n/*  /_shell.html  200`));

const escape = (path) => path.slice(1).replace(/[.]/g, "\\.");
const apache = entries.map(([from, to]) => `RewriteRule ^${escape(from)}/?$ ${to} [R=301,NE,L]`).join("\n");
const htaccess = readFileSync("dist/.htaccess", "utf8");
writeFileSync("dist/.htaccess", htaccess.replace("RewriteEngine On", `RewriteEngine On\n${apache}`));

console.log(`postbuild : dist/ prêt (404.html = coquille de l'application, ${entries.length} redirections)`);
