const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");
const { BLOG_CATEGORIES } = require("./constants");

// Article de blog. `content` est du texte long ; les sauts de ligne doubles
// séparent les paragraphes, une ligne commençant par "## " est un sous-titre
// et une ligne commençant par "- " un élément de liste (rendu côté site).
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200, index: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 220 },
    category: { type: String, enum: BLOG_CATEGORIES, required: true, index: true },
    excerpt: { type: String, required: true, maxlength: 600 },
    content: { type: String, required: true, maxlength: 40000 },
    imageUrl: { type: String, default: null },
    readTime: { type: String, trim: true, maxlength: 20 },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: null },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

// La date de publication suit l'état publié/brouillon.
postSchema.pre("save", function syncPublishedAt() {
  if (this.isModified("published")) {
    this.publishedAt = this.published ? this.publishedAt || new Date() : null;
  }
});

postSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("Post", postSchema);
