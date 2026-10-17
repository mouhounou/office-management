const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");
const { POLES, SIMPLE_STATUSES } = require("./constants");

// Formulaire /devis du site public.
const quoteRequestSchema = new mongoose.Schema(
  {
    // Compte du site public à l'origine du dépôt (null pour un visiteur anonyme).
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: null, index: true },
    pole: { type: String, enum: POLES, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, trim: true, maxlength: 180, default: null },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 255 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    budget: { type: String, trim: true, maxlength: 60, default: null },
    deadline: { type: String, trim: true, maxlength: 60, default: null },
    message: { type: String, required: true, maxlength: 4000 },
    status: { type: String, enum: SIMPLE_STATUSES, default: "new", index: true },
    adminNotes: { type: String, maxlength: 4000 },
  },
  { timestamps: true },
);

quoteRequestSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("QuoteRequest", quoteRequestSchema);
