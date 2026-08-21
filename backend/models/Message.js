const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");
const { SIMPLE_STATUSES } = require("./constants");

const MESSAGE_KINDS = ["contact", "rendez-vous"];
const TIME_SLOTS = ["matin", "apres-midi"];

/**
 * Messages du site public : formulaire de contact et demandes de rendez-vous.
 * Les deux partagent nom/email/téléphone/message ; le rendez-vous ajoute le
 * motif et le créneau souhaité.
 */
const messageSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: MESSAGE_KINDS, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 255 },
    phone: { type: String, trim: true, maxlength: 40 },
    subject: { type: String, trim: true, maxlength: 180 },
    message: { type: String, maxlength: 4000 },

    // Spécifique aux demandes de rendez-vous.
    reason: { type: String, trim: true, maxlength: 180 },
    preferredDate: { type: Date, default: null },
    timeSlot: { type: String, enum: [...TIME_SLOTS, null], default: null },

    status: { type: String, enum: SIMPLE_STATUSES, default: "new", index: true },
    adminNotes: { type: String, maxlength: 4000 },
  },
  { timestamps: true },
);

messageSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("Message", messageSchema);
module.exports.MESSAGE_KINDS = MESSAGE_KINDS;
module.exports.TIME_SLOTS = TIME_SLOTS;
