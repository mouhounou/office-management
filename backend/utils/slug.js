/** "Gestion des Ressources Humaines" -> "gestion-des-ressources-humaines" */
function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

/**
 * Renvoie un slug libre pour ce modèle : "mon-titre", puis "mon-titre-2"…
 * `excludeId` permet de garder son propre slug lors d'une mise à jour.
 */
async function uniqueSlug(model, source, excludeId = null) {
  const base = slugify(source) || "element";
  let candidate = base;
  let n = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await model.exists(query);
    if (!exists) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

module.exports = { slugify, uniqueSlug };
