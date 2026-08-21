const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");
const { FORMATION_CATEGORIES } = require("./constants");

// Catalogue de formations affiché sur /formations.
const formationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180, index: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 200 },
    category: { type: String, enum: FORMATION_CATEGORIES, required: true, index: true },
    description: { type: String, maxlength: 8000 },
    // Modules / contenus du programme, une ligne par élément.
    program: { type: [String], default: [] },
    duration: { type: String, trim: true, maxlength: 60 },
    level: { type: String, trim: true, maxlength: 60 },
    price: { type: String, trim: true, maxlength: 60 },
    certifying: { type: Boolean, default: false },
    imageUrl: { type: String, default: null },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

formationSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("Formation", formationSchema);
