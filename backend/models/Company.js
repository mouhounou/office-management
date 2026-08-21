const mongoose = require("mongoose");
const { toJSONPlugin } = require("./plugins");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 180, index: true },
    rccm: { type: String, trim: true, maxlength: 80 },
    niu: { type: String, trim: true, maxlength: 80 },
    sector: { type: String, trim: true, maxlength: 120 },
    size: { type: String, trim: true, maxlength: 60 },
    contactName: { type: String, trim: true, maxlength: 120 },
    contactEmail: { type: String, trim: true, lowercase: true, maxlength: 180 },
    contactPhone: { type: String, trim: true, maxlength: 40 },
    address: { type: String, trim: true, maxlength: 240 },
    city: { type: String, trim: true, maxlength: 120 },
    country: { type: String, trim: true, maxlength: 120, default: "Congo" },
    notes: { type: String, maxlength: 4000 },
  },
  { timestamps: true },
);

companySchema.plugin(toJSONPlugin);

module.exports = mongoose.model("Company", companySchema);
