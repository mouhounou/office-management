const Media = require("../models/Media");
const RequestDocument = require("../models/RequestDocument");
const BusinessRequest = require("../models/BusinessRequest");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { uploadFile, destroyFile } = require("../config/cloudinary");
const { crudController } = require("./crud.factory");

const crud = crudController({
  model: Media,
  searchFields: ["name", "alt", "folder"],
  filterFields: ["folder", "mimeType"],
  sortFields: ["createdAt", "name", "sizeBytes"],
});

/** Téléversement multiple vers la médiathèque. */
const upload = asyncHandler(async (req, res) => {
  const files = req.files?.length ? req.files : req.file ? [req.file] : [];
  if (!files.length) throw ApiError.badRequest("Aucun fichier reçu");

  const folder = req.body.folder || "general";
  const uploaded = await Promise.all(files.map((file) => uploadFile(file, folder)));

  const items = await Media.insertMany(
    uploaded.map((result, index) => ({
      name: files[index].originalname,
      url: result.url,
      storageKey: result.storageKey,
      resourceType: result.resourceType,
      mimeType: result.mimeType,
      sizeBytes: result.sizeBytes,
      width: result.width,
      height: result.height,
      folder,
      uploadedBy: req.user?._id ?? null,
    })),
  );

  res.status(201).json({ items });
});

// Supprime aussi le fichier chez Cloudinary : sinon la bibliothèque se remplit
// de fichiers orphelins facturés au stockage.
const remove = asyncHandler(async (req, res) => {
  const doc = await Media.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound();
  await destroyFile(doc.storageKey, doc.resourceType);
  res.status(204).end();
});

/** Pièce jointe rattachée à une demande business. */
const uploadRequestDocument = asyncHandler(async (req, res) => {
  const request = await BusinessRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound("Demande introuvable");
  if (!req.file) throw ApiError.badRequest("Aucun fichier reçu");

  const result = await uploadFile(req.file, `demandes/${request._id}`);

  const doc = await RequestDocument.create({
    request: request._id,
    uploadedBy: req.user?._id ?? null,
    type: req.body.type || "autre",
    name: req.file.originalname,
    url: result.url,
    storageKey: result.storageKey,
    resourceType: result.resourceType,
    sizeBytes: result.sizeBytes,
    mimeType: result.mimeType,
  });

  res.status(201).json({ item: doc });
});

const removeRequestDocument = asyncHandler(async (req, res) => {
  const doc = await RequestDocument.findOneAndDelete({ _id: req.params.docId, request: req.params.id });
  if (!doc) throw ApiError.notFound();
  await destroyFile(doc.storageKey, doc.resourceType);
  res.status(204).end();
});

module.exports = { ...crud, upload, remove, uploadRequestDocument, removeRequestDocument };
