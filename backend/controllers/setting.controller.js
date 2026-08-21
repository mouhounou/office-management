const Setting = require("../models/Setting");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Réglages par défaut : servent de gabarit à l'écran Paramètres et garantissent
 * que le site public trouve toujours les clés attendues.
 */
const DEFAULTS = {
  contact: {
    email: "hassanakiana@gmail.com",
    phone: "06 948 09 05",
    whatsapp: "+242069480905",
    address: "Songolo, BP 97116, Pointe-Noire, Congo",
    hours: "Lun – Ven : 8h – 17h",
  },
  legal: {
    rccm: "CG-PNR 01-25-A11-00062",
    niu: "P24000000506144",
    approval: "Nº 123 MJSECFQE/CAB/DGFQE/DDFQE-PN/SD",
  },
  social: {
    facebook: "https://www.facebook.com/share/1NiHHG8bHe/",
    instagram: "https://www.instagram.com/officemanagement2278",
    tiktok: "https://www.tiktok.com/@officemanagement93",
    linkedin: "",
  },
  ceo: {
    displayName: "",
    displayTitle: "",
    signatureUrl: "",
  },
};

const list = asyncHandler(async (_req, res) => {
  const rows = await Setting.find();
  const stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  // Les valeurs enregistrées écrasent les défauts, clé par clé.
  const settings = Object.fromEntries(
    Object.entries(DEFAULTS).map(([key, value]) => [key, { ...value, ...(stored[key] ?? {}) }]),
  );
  for (const [key, value] of Object.entries(stored)) {
    if (!settings[key]) settings[key] = value;
  }

  res.json({ settings });
});

const upsert = asyncHandler(async (req, res) => {
  const item = await Setting.findOneAndUpdate(
    { key: req.params.key },
    { value: req.body.value, updatedBy: req.user._id },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
  res.json({ item });
});

module.exports = { list, upsert, DEFAULTS };
