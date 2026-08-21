const { z } = require("zod");

const { trimmed, email, phone, optionalText, dateString } = require("./common");
const C = require("../models/constants");
const { MESSAGE_KINDS, TIME_SLOTS } = require("../models/Message");
const schemas = require("./index");

/**
 * Schémas des soumissions publiques.
 *
 * Ils dérivent des schémas du back-office mais **retirent les champs de
 * traitement** (`status`, `adminNotes`, assignation…) : un visiteur ne doit pas
 * pouvoir créer une demande déjà marquée « terminée » ni écrire dans les notes
 * internes.
 */

const quotePublic = schemas.quoteCreate.omit({ status: true, adminNotes: true });

const preRegistrationPublic = schemas.preRegistrationCreate.omit({
  status: true,
  adminNotes: true,
});

const businessRequestPublic = schemas.businessRequestCreate.omit({
  status: true,
  adminNotes: true,
  assignedTo: true,
  company: true,
});

const applicationPublic = schemas.applicationCreate.omit({
  status: true,
  adminNotes: true,
});

const subscriberPublic = z.object({
  email,
  source: optionalText(80),
});

const contactMessagePublic = z.object({
  name: trimmed(120).min(2, "Nom requis"),
  email,
  phone: optionalText(40),
  subject: trimmed(180).min(2, "Sujet requis"),
  message: trimmed(4000).min(10, "Message trop court"),
});

const appointmentPublic = z.object({
  name: trimmed(120).min(2, "Nom requis"),
  email,
  phone,
  reason: trimmed(180).min(2, "Motif requis"),
  preferredDate: dateString,
  timeSlot: z.enum(TIME_SLOTS, { message: "Créneau invalide" }),
  message: optionalText(4000),
});

module.exports = {
  quotePublic,
  preRegistrationPublic,
  businessRequestPublic,
  applicationPublic,
  subscriberPublic,
  contactMessagePublic,
  appointmentPublic,
  MESSAGE_KINDS,
  POLES: C.POLES,
};
