const BusinessRequest = require("../models/BusinessRequest");
const RequestEvent = require("../models/RequestEvent");
const RequestDocument = require("../models/RequestDocument");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { crudController } = require("./crud.factory");
const { notifyStatusChange } = require("../services/mail.service");

// Libellés envoyés au client dans l'email de suivi.
const STATUS_LABELS = {
  new: "Reçue",
  in_review: "En cours d'analyse",
  in_progress: "En cours de traitement",
  completed: "Terminée",
  cancelled: "Annulée",
};

/** Journalise l'action d'un membre du back-office sur une demande. */
async function logEvent(request, req, payload) {
  await RequestEvent.create({
    request: request._id,
    actor: req.user?._id ?? null,
    actorName: req.user?.fullName ?? null,
    ...payload,
  });
}

const crud = crudController({
  model: BusinessRequest,
  searchFields: ["title", "companyName", "contactName", "contactEmail", "description"],
  filterFields: ["status", "type", "priority", "assignedTo"],
  sortFields: ["createdAt", "updatedAt", "deadline", "priority", "status"],
  populate: [
    { path: "assignedTo", select: "fullName email" },
    { path: "company", select: "name city" },
  ],
  async afterUpdate(doc, previous, req) {
    if (previous.status !== doc.status) {
      await logEvent(doc, req, {
        eventType: "status_change",
        fromStatus: previous.status,
        toStatus: doc.status,
      });
      // Le contact est prévenu de l'avancement, sauf remise à l'état initial.
      if (doc.status !== "new") {
        notifyStatusChange(doc, doc.status, STATUS_LABELS[doc.status] ?? doc.status);
      }
    }
    if (String(previous.assignedTo ?? "") !== String(doc.assignedTo ?? "")) {
      await logEvent(doc, req, {
        eventType: "assignment",
        comment: doc.assignedTo ? "Demande assignée" : "Assignation retirée",
      });
    }
  },
});

const create = asyncHandler(async (req, res) => {
  const doc = await BusinessRequest.create(req.body);
  await logEvent(doc, req, { eventType: "created", toStatus: doc.status });
  res.status(201).json({ item: doc });
});

const listEvents = asyncHandler(async (req, res) => {
  const items = await RequestEvent.find({ request: req.params.id }).sort({ createdAt: 1 });
  res.json({ items });
});

const addEvent = asyncHandler(async (req, res) => {
  const request = await BusinessRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound("Demande introuvable");

  await logEvent(request, req, {
    eventType: req.body.eventType || "comment",
    comment: req.body.comment,
  });

  const items = await RequestEvent.find({ request: request._id }).sort({ createdAt: 1 });
  res.status(201).json({ items });
});

const listDocuments = asyncHandler(async (req, res) => {
  const items = await RequestDocument.find({ request: req.params.id }).sort({ createdAt: -1 });
  res.json({ items });
});

module.exports = { ...crud, create, listEvents, addEvent, listDocuments };
