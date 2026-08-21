/**
 * Jeu de DONNÉES DE DÉMONSTRATION (fictives) pour tester le back-office tant
 * que le site public n'envoie rien à l'API.
 *
 *   node scripts/seed-demo.js          ajoute les enregistrements de démo
 *   node scripts/seed-demo.js --reset  les supprime d'abord
 *
 * Tous les enregistrements portent la marque `demo` (champ source, adminNotes
 * ou email en @exemple.cg) : rien ne se mélange avec de vraies données.
 */
require("../config/env");
const mongoose = require("mongoose");

const { connectDB } = require("../config/db");
const BusinessRequest = require("../models/BusinessRequest");
const RequestEvent = require("../models/RequestEvent");
const QuoteRequest = require("../models/QuoteRequest");
const PreRegistration = require("../models/PreRegistration");
const Offer = require("../models/Offer");
const Application = require("../models/Application");
const Subscriber = require("../models/Subscriber");
const Company = require("../models/Company");

const DEMO_DOMAIN = "@exemple.cg";
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const inDays = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const COMPANIES = [
  { name: "Congo Marine Services", sector: "Maritime", city: "Pointe-Noire", contactName: "Alain Mabiala", contactEmail: `contact${DEMO_DOMAIN}`, contactPhone: "+242 06 111 22 33" },
  { name: "Sud Logistique SARL", sector: "Logistique", city: "Pointe-Noire", contactName: "Gisèle Ndinga", contactEmail: `gisele${DEMO_DOMAIN}`, contactPhone: "+242 06 444 55 66" },
  { name: "Bâtir Congo", sector: "BTP", city: "Brazzaville", contactName: "Serge Ondzé", contactEmail: `serge${DEMO_DOMAIN}`, contactPhone: "+242 05 777 88 99" },
];

const BUSINESS_REQUESTS = [
  { companyName: "Congo Marine Services", contactName: "Alain Mabiala", contactEmail: `contact${DEMO_DOMAIN}`, contactPhone: "+242 06 111 22 33", type: "recrutement", title: "Recrutement de 4 techniciens de maintenance", description: "Nous cherchons quatre techniciens de maintenance industrielle pour notre base de Pointe-Noire, disponibles sous deux mois. Expérience en milieu portuaire souhaitée.", status: "in_review", priority: "high", budget: "8 000 000 FCFA", deadline: inDays(45), createdAt: daysAgo(3) },
  { companyName: "Sud Logistique SARL", contactName: "Gisèle Ndinga", contactEmail: `gisele${DEMO_DOMAIN}`, contactPhone: "+242 06 444 55 66", type: "formation", title: "Formation Excel avancé pour 12 collaborateurs", description: "Formation Excel avancé (tableaux croisés dynamiques, macros simples) pour douze collaborateurs du service exploitation, sur site, en deux groupes.", status: "in_progress", priority: "normal", budget: "3 500 000 FCFA", deadline: inDays(20), createdAt: daysAgo(9) },
  { companyName: "Bâtir Congo", contactName: "Serge Ondzé", contactEmail: `serge${DEMO_DOMAIN}`, contactPhone: "+242 05 777 88 99", type: "audit_rh", title: "Audit RH et mise en conformité des contrats", description: "Audit complet de la fonction RH : contrats de travail, registre du personnel, procédures disciplinaires et conformité au code du travail congolais.", status: "new", priority: "urgent", budget: "À définir", createdAt: daysAgo(1) },
  { companyName: "Congo Marine Services", contactName: "Alain Mabiala", contactEmail: `contact${DEMO_DOMAIN}`, contactPhone: "+242 06 111 22 33", type: "autre", title: "Mise à disposition de 2 assistantes administratives", description: "Mise à disposition de deux assistantes administratives pour une durée de six mois, avec possibilité de recrutement définitif à l'issue de la mission.", status: "completed", priority: "normal", budget: "6 000 000 FCFA", createdAt: daysAgo(40) },
];

const QUOTES = [
  { pole: "Formation professionnelle", name: "Prisca Loubaki", company: "Ateliers du Kouilou", email: `prisca${DEMO_DOMAIN}`, phone: "+242 06 200 30 40", budget: "2 000 000 FCFA", deadline: "Septembre", message: "Nous souhaitons former six agents à la comptabilité sur Sage 100 i7. Merci de nous adresser une proposition détaillée.", status: "new", createdAt: daysAgo(2) },
  { pole: "Conseil RH", name: "Junior Bakala", company: "Transit Océan", email: `junior${DEMO_DOMAIN}`, phone: "+242 05 300 40 50", budget: "5 000 000 FCFA", deadline: "Trimestre en cours", message: "Accompagnement pour la refonte de notre grille salariale et de nos fiches de poste, environ 40 salariés concernés.", status: "in_review", createdAt: daysAgo(6) },
  { pole: "Excel & SAGE 100 i7", name: "Naomi Tchibinda", company: "Pharmacie Centrale", email: `naomi${DEMO_DOMAIN}`, phone: "+242 06 500 60 70", message: "Installation et formation Sage Gescom pour la gestion de nos stocks sur deux points de vente.", status: "completed", createdAt: daysAgo(25) },
];

const PRE_REGISTRATIONS = [
  { fullName: "Merveille Bouanga", email: `merveille${DEMO_DOMAIN}`, phone: "+242 06 123 45 67", dateOfBirth: new Date("2002-04-18"), placeOfBirth: "Pointe-Noire", neighborhood: "Songolo", profession: "Étudiante", financingType: "Personnel", idDocumentType: "CNI", idDocumentNumber: "PNR-2002-4418", training: "Assistant Comptable", duration: "6 mois", startDate: inDays(15), status: "new", createdAt: daysAgo(1) },
  { fullName: "Christian Moukoko", email: `christian${DEMO_DOMAIN}`, phone: "+242 05 987 65 43", dateOfBirth: new Date("1996-11-02"), placeOfBirth: "Dolisie", neighborhood: "Mpaka", profession: "Magasinier", financingType: "Employeur", idDocumentType: "Passeport", idDocumentNumber: "CG9876543", training: "Logistique", duration: "4 mois", startDate: inDays(30), status: "in_review", createdAt: daysAgo(5) },
  { fullName: "Grâce Nkodia", email: `grace${DEMO_DOMAIN}`, phone: "+242 06 741 85 20", dateOfBirth: new Date("1999-07-25"), placeOfBirth: "Brazzaville", neighborhood: "Tié-Tié", profession: "Secrétaire", financingType: "Organisme / Bourse", idDocumentType: "CNI", idDocumentNumber: "BZV-1999-0725", training: "Secrétariat Bureautique", duration: "3 mois", startDate: inDays(7), status: "completed", createdAt: daysAgo(60) },
];

const OFFERS = [
  { title: "Stage — Assistant(e) Ressources Humaines", description: "Stage de six mois au sein du pôle RH : appui au recrutement, suivi administratif du personnel et participation aux sessions de formation.", location: "Pointe-Noire", contractType: "stage", sector: "Ressources Humaines", duration: "6 mois", requirements: "Bac+2/3 en RH ou gestion, maîtrise d'Excel, bonne expression écrite.", published: true, expiresAt: inDays(30), createdAt: daysAgo(10) },
  { title: "Technicien de maintenance industrielle (H/F)", description: "Pour le compte d'un client du secteur maritime : maintenance préventive et corrective des équipements de manutention portuaire.", location: "Pointe-Noire", contractType: "cdd", sector: "Industrie", duration: "12 mois", requirements: "BTS maintenance, 3 ans d'expérience, habilitations à jour.", published: true, expiresAt: inDays(20), createdAt: daysAgo(4) },
  { title: "Formateur(trice) bureautique — vacataire", description: "Animation de modules Excel et bureautique complète auprès de groupes de 10 à 15 apprenants.", location: "Pointe-Noire", contractType: "consultance", sector: "Formation", requirements: "Expérience confirmée en animation de formation, maîtrise avancée d'Excel.", published: false, createdAt: daysAgo(2) },
];

const APPLICATIONS = [
  { offerTitle: "Stage — Assistant(e) Ressources Humaines", fullName: "Divine Makaya", email: `divine${DEMO_DOMAIN}`, phone: "+242 06 852 74 10", coverLetter: "Titulaire d'une licence en gestion des ressources humaines, je souhaite mettre en pratique mes acquis au sein de votre cabinet.", status: "shortlisted", createdAt: daysAgo(6) },
  { offerTitle: "Stage — Assistant(e) Ressources Humaines", fullName: "Rodrigue Tati", email: `rodrigue${DEMO_DOMAIN}`, phone: "+242 05 963 25 87", coverLetter: "Étudiant en master RH, je recherche un stage de fin d'études à partir du mois prochain.", status: "submitted", createdAt: daysAgo(2) },
  { offerTitle: "Technicien de maintenance industrielle (H/F)", fullName: "Patrick Ibara", email: `patrick${DEMO_DOMAIN}`, phone: "+242 06 147 25 89", coverLetter: "Sept ans d'expérience en maintenance d'équipements portuaires, habilitations électriques à jour.", status: "accepted", adminNotes: "Profil validé par le client, démarrage prévu le mois prochain.", createdAt: daysAgo(8) },
];

const SUBSCRIBERS = [
  "abonne1", "abonne2", "abonne3", "abonne4", "abonne5", "abonne6",
].map((name, i) => ({
  email: `${name}${DEMO_DOMAIN}`,
  source: i % 2 === 0 ? "site" : "événement",
  createdAt: daysAgo(i * 4),
}));

async function reset() {
  const demoFilter = { email: new RegExp(`${DEMO_DOMAIN}$`, "i") };
  const contactFilter = { contactEmail: new RegExp(`${DEMO_DOMAIN}$`, "i") };

  const removed = await Promise.all([
    BusinessRequest.deleteMany(contactFilter),
    QuoteRequest.deleteMany(demoFilter),
    PreRegistration.deleteMany(demoFilter),
    Application.deleteMany(demoFilter),
    Subscriber.deleteMany(demoFilter),
    Company.deleteMany(contactFilter),
    Offer.deleteMany({ title: { $in: OFFERS.map((o) => o.title) } }),
  ]);
  await RequestEvent.deleteMany({ request: { $nin: await BusinessRequest.distinct("_id") } });

  console.log(`Démo supprimée : ${removed.reduce((sum, r) => sum + r.deletedCount, 0)} enregistrements.`);
}

async function run() {
  await connectDB();
  if (process.argv.includes("--reset")) await reset();

  await Company.insertMany(COMPANIES);

  const requests = await BusinessRequest.insertMany(BUSINESS_REQUESTS);
  // Un journal minimal pour que l'écran de détail ait de quoi afficher.
  await RequestEvent.insertMany(
    requests.map((r) => ({
      request: r._id,
      eventType: "created",
      toStatus: "new",
      actorName: "Site public",
      createdAt: r.createdAt,
    })),
  );

  await QuoteRequest.insertMany(QUOTES);
  await PreRegistration.insertMany(PRE_REGISTRATIONS);

  const offers = await Offer.insertMany(OFFERS);
  const offerByTitle = new Map(offers.map((o) => [o.title, o._id]));
  await Application.insertMany(
    APPLICATIONS.map(({ offerTitle, ...rest }) => ({ ...rest, offer: offerByTitle.get(offerTitle) })),
  );

  await Subscriber.insertMany(SUBSCRIBERS);

  console.log(
    `Démo créée : ${COMPANIES.length} entreprises, ${requests.length} demandes, ${QUOTES.length} devis, ` +
      `${PRE_REGISTRATIONS.length} pré-inscriptions, ${offers.length} offres, ${APPLICATIONS.length} candidatures, ` +
      `${SUBSCRIBERS.length} abonnés.`,
  );
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
