const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");
const { NOTIFICATION_TYPES } = require("./constants");

// Notifications internes du back-office. `user: null` = message diffusé à toute
// l'équipe ; `readBy` mémorise qui l'a lu.
const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    type: { type: String, enum: NOTIFICATION_TYPES, default: "info" },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, maxlength: 2000 },
    link: { type: String, maxlength: 500 },
    readBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

notificationSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("Notification", notificationSchema);
