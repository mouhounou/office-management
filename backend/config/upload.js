const multer = require("multer");

const ApiError = require("../utils/ApiError");

/**
 * Multer en mémoire : les fichiers ne touchent jamais le disque, ils sont
 * poussés vers Cloudinary par config/cloudinary.js.
 */

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];

const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
];

function makeUploader(allowed, maxBytes) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxBytes, files: 10 },
    fileFilter(_req, file, cb) {
      if (!allowed.includes(file.mimetype)) {
        return cb(ApiError.badRequest(`Type de fichier non autorisé : ${file.mimetype}`));
      }
      cb(null, true);
    },
  });
}

const uploadImage = makeUploader(IMAGE_TYPES, 8 * 1024 * 1024);
const uploadDocument = makeUploader([...IMAGE_TYPES, ...DOCUMENT_TYPES], 15 * 1024 * 1024);

module.exports = { uploadImage, uploadDocument, IMAGE_TYPES, DOCUMENT_TYPES };
