const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");
const { DOCUMENT_TYPES } = require("./constants");

const requestDocumentSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessRequest",
      required: true,
      index: true,
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    type: { type: String, enum: DOCUMENT_TYPES, default: "autre" },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    url: { type: String, required: true },
    storageKey: { type: String, default: null },
    resourceType: { type: String, default: "raw" },
    sizeBytes: { type: Number, default: null },
    mimeType: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

requestDocumentSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("RequestDocument", requestDocumentSchema);
