const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");

// Fichier de la médiathèque, hébergé sur Cloudinary (voir config/cloudinary.js).
const mediaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200, index: true },
    url: { type: String, required: true },
    // Identifiant Cloudinary (public_id), nécessaire pour supprimer le fichier.
    storageKey: { type: String, required: true },
    // "image" ou "raw" : Cloudinary exige ce type pour la suppression.
    resourceType: { type: String, default: "image" },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    folder: { type: String, trim: true, maxlength: 80, default: "general", index: true },
    alt: { type: String, trim: true, maxlength: 240 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

mediaSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("Media", mediaSchema);
