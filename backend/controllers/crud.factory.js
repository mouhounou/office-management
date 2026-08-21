const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, parseSort, buildSearch } = require("../utils/pagination");

/**
 * Fabrique de contrôleurs CRUD. Chaque ressource déclare ses champs de
 * recherche, ses filtres autorisés et ses schémas Zod ; la mécanique
 * (pagination, tri, populate, 404) est mutualisée ici.
 *
 * @param {object} config
 * @param {import("mongoose").Model} config.model
 * @param {string[]} [config.searchFields]  champs balayés par ?q=
 * @param {string[]} [config.filterFields]  champs filtrables par égalité (?status=new)
 * @param {string[]} [config.sortFields]    champs autorisés dans ?sort=
 * @param {string|object} [config.populate]
 * @param {Function} [config.beforeCreate]  (body, req) => body
 * @param {Function} [config.afterUpdate]   (doc, previous, req) => void
 */
function crudController(config) {
  const {
    model,
    searchFields = [],
    filterFields = [],
    sortFields = ["createdAt", "updatedAt"],
    populate,
    beforeCreate,
    afterUpdate,
  } = config;

  const buildFilter = (query) => {
    const filter = {};
    for (const field of filterFields) {
      const value = query[field];
      if (value === undefined || value === "" || value === "all") continue;
      if (value === "true" || value === "false") filter[field] = value === "true";
      else if (String(value).includes(",")) filter[field] = { $in: String(value).split(",") };
      else filter[field] = value;
    }
    const search = buildSearch(query, searchFields);
    return search ? { ...filter, ...search } : filter;
  };

  const list = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const sort = parseSort(req.query, sortFields);
    const filter = buildFilter(req.query);

    let q = model.find(filter).sort(sort).skip(skip).limit(limit);
    if (populate) q = q.populate(populate);

    const [items, total] = await Promise.all([q, model.countDocuments(filter)]);

    res.json({
      items,
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  });

  const getOne = asyncHandler(async (req, res) => {
    let q = model.findById(req.params.id);
    if (populate) q = q.populate(populate);
    const doc = await q;
    if (!doc) throw ApiError.notFound();
    res.json({ item: doc });
  });

  const create = asyncHandler(async (req, res) => {
    const payload = beforeCreate ? await beforeCreate(req.body, req) : req.body;
    const doc = await model.create(payload);
    res.status(201).json({ item: doc });
  });

  const update = asyncHandler(async (req, res) => {
    const doc = await model.findById(req.params.id);
    if (!doc) throw ApiError.notFound();

    const previous = doc.toObject();
    Object.assign(doc, req.body);
    await doc.save();
    if (afterUpdate) await afterUpdate(doc, previous, req);

    res.json({ item: doc });
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc) throw ApiError.notFound();
    res.status(204).end();
  });

  return { list, getOne, create, update, remove };
}

module.exports = { crudController };
