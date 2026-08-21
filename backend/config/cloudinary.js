const { v2: cloudinary } = require("cloudinary");

const { cloudinary: config } = require("./env");
const ApiError = require("../utils/ApiError");

/**
 * Stockage des fichiers sur Cloudinary. Multer garde le fichier en mémoire,
 * puis on le pousse en flux vers Cloudinary : rien n'est écrit sur le disque
 * du serveur, ce qui reste valable sur un hébergement éphémère.
 */

const isConfigured = Boolean(config.cloudName && config.apiKey && config.apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });
}

const ROOT_FOLDER = "office-management";

/** `raw` pour les PDF/documents, `image` pour le reste. */
function resourceTypeFor(mimeType) {
  return mimeType.startsWith("image/") ? "image" : "raw";
}

function uploadBuffer(file, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${ROOT_FOLDER}/${folder || "general"}`,
        resource_type: resourceTypeFor(file.mimetype),
        // Conserve un nom lisible dans la bibliothèque Cloudinary.
        public_id: `${Date.now()}-${file.originalname.replace(/\.[^.]+$/, "").slice(0, 60)}`,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    stream.end(file.buffer);
  });
}

/** Téléverse un fichier multer et renvoie les métadonnées à stocker en base. */
async function uploadFile(file, folder) {
  if (!isConfigured) {
    throw new ApiError(
      503,
      "Cloudinary n'est pas configuré : renseignez CLOUDINARY_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans .env",
    );
  }

  const result = await uploadBuffer(file, folder);

  return {
    url: result.secure_url,
    storageKey: result.public_id,
    resourceType: result.resource_type,
    width: result.width ?? null,
    height: result.height ?? null,
    sizeBytes: result.bytes ?? file.size,
    mimeType: file.mimetype,
  };
}

/** Suppression définitive côté Cloudinary (appelée quand on supprime en base). */
async function destroyFile(storageKey, resourceType = "image") {
  if (!isConfigured || !storageKey) return;
  try {
    await cloudinary.uploader.destroy(storageKey, { resource_type: resourceType });
  } catch (error) {
    // Un fichier déjà absent ne doit pas faire échouer la suppression en base.
    console.error("Cloudinary destroy:", error.message);
  }
}

module.exports = { uploadFile, destroyFile, isConfigured, cloudinary };
