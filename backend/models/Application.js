const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");
const { APPLICATION_STATUSES } = require("./constants");

const applicationSchema = new mongoose.Schema(
  {
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", default: null, index: true },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 255 },
    phone: { type: String, trim: true, maxlength: 40 },
    coverLetter: { type: String, maxlength: 8000 },
    cvUrl: { type: String, default: null },
    status: { type: String, enum: APPLICATION_STATUSES, default: "submitted", index: true },
    adminNotes: { type: String, maxlength: 4000 },
  },
  { timestamps: true },
);

applicationSchema.plugin(toJSONPlugin);

module.exports = mongoose.model("Application", applicationSchema);
