const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number.parseInt(query.limit, 10) || DEFAULT_LIMIT));
  return { page, limit, skip: (page - 1) * limit };
}

/** `?sort=-createdAt` → { createdAt: -1 }. Restreint aux champs autorisés. */
function parseSort(query, allowed, fallback = "-createdAt") {
  const raw = typeof query.sort === "string" && query.sort ? query.sort : fallback;
  const desc = raw.startsWith("-");
  const field = desc ? raw.slice(1) : raw;
  if (!allowed.includes(field)) return { createdAt: -1 };
  return { [field]: desc ? -1 : 1 };
}

/** Échappe une saisie utilisateur avant de la passer à une RegExp Mongo. */
function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearch(query, fields) {
  const q = typeof query.q === "string" ? query.q.trim() : "";
  if (!q || !fields.length) return null;
  const rx = new RegExp(escapeRegex(q), "i");
  return { $or: fields.map((f) => ({ [f]: rx })) };
}

module.exports = { parsePagination, parseSort, buildSearch, escapeRegex, DEFAULT_LIMIT, MAX_LIMIT };
