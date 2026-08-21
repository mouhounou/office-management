const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");

// Journal d'une demande : changements de statut et commentaires internes.
const requestEventSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessRequest",
      required: true,
      index: true,
    },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    actorName: { type: String, trim: true, maxlength: 120 },
    eventType: { type: String, required: true, trim: true, maxlength: 60 },
    fromStatus: { type: String, default: null },
    toStatus: { type: String, default: null },
    comment: { type: String, maxlength: 4000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

requestEventSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("RequestEvent", requestEventSchema);
