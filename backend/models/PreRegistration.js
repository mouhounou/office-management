const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");
const { TRAININGS, FINANCING_TYPES, ID_DOCUMENT_TYPES, SIMPLE_STATUSES } = require("./constants");

// Formulaire /pre-inscription du site public (dossier de candidature formation).
const preRegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 255 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    dateOfBirth: { type: Date, required: true },
    placeOfBirth: { type: String, required: true, trim: true, maxlength: 120 },
    neighborhood: { type: String, required: true, trim: true, maxlength: 120 },
    profession: { type: String, required: true, trim: true, maxlength: 120 },
    financingType: { type: String, enum: FINANCING_TYPES, required: true },
    idDocumentType: { type: String, enum: ID_DOCUMENT_TYPES, required: true },
    idDocumentNumber: { type: String, required: true, trim: true, maxlength: 60 },
    training: { type: String, enum: TRAININGS, required: true, index: true },
    duration: { type: String, required: true, trim: true, maxlength: 60 },
    startDate: { type: Date, required: true },
    status: { type: String, enum: SIMPLE_STATUSES, default: "new", index: true },
    adminNotes: { type: String, maxlength: 4000 },
  },
  { timestamps: true },
);

preRegistrationSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("PreRegistration", preRegistrationSchema);
