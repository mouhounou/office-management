const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");
const { CONTRACT_TYPES } = require("./constants");

// Offres d'emploi et de stage publiées sur le site (ex-internship_offers).
const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180, index: true },
    description: { type: String, required: true, maxlength: 8000 },
    location: { type: String, trim: true, maxlength: 120 },
    contractType: { type: String, enum: CONTRACT_TYPES, default: "stage", index: true },
    sector: { type: String, trim: true, maxlength: 120 },
    duration: { type: String, trim: true, maxlength: 60 },
    requirements: { type: String, maxlength: 4000 },
    published: { type: Boolean, default: false, index: true },
    expiresAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

offerSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("Offer", offerSchema);
