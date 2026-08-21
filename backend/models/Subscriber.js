const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    source: { type: String, trim: true, maxlength: 80, default: "site" },
    active: { type: Boolean, default: true, index: true },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

subscriberSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("Subscriber", subscriberSchema);
