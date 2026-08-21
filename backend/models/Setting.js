const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");

/**
 * Paramètres du site, stockés en clé/valeur : une ligne par groupe de réglages
 * (`contact`, `branding`, `ceo`…), la valeur étant un objet libre. Évite une
 * migration à chaque nouveau champ éditable.
 */
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    value: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

settingSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("Setting", settingSchema);
