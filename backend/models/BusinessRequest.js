const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");
const { REQUEST_TYPES, REQUEST_STATUSES, PRIORITIES } = require("./constants");

// Demande déposée par une entreprise depuis le Business Center du site public.
const businessRequestSchema = new mongoose.Schema(
  {
    // Compte du site public à l'origine du dépôt (null pour un visiteur anonyme).
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: null, index: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null, index: true },
    // Coordonnées saisies dans le formulaire, conservées même sans fiche entreprise.
    companyName: { type: String, required: true, trim: true, maxlength: 180 },
    contactName: { type: String, required: true, trim: true, maxlength: 120 },
    contactEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    contactPhone: { type: String, required: true, trim: true, maxlength: 40 },

    type: { type: String, enum: REQUEST_TYPES, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, required: true, maxlength: 8000 },
    status: { type: String, enum: REQUEST_STATUSES, default: "new", index: true },
    priority: { type: String, enum: PRIORITIES, default: "normal", index: true },
    budget: { type: String, trim: true, maxlength: 80 },
    deadline: { type: Date, default: null },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    adminNotes: { type: String, maxlength: 4000 },
  },
  { timestamps: true },
);

businessRequestSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("BusinessRequest", businessRequestSchema);
