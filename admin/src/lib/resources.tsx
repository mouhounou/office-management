import {
  Briefcase,
  Building2,
  CalendarCheck,
  GraduationCap,
  Handshake,
  Mail,
  Newspaper,
  Receipt,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/ui/data";
import type { AnyRecord } from "@/lib/api";
import {
  APPLICATION_STATUSES,
  BLOG_CATEGORIES,
  CONTRACT_TYPES,
  FINANCING_TYPES,
  FORMATION_CATEGORIES,
  MESSAGE_KINDS,
  POLES,
  PRIORITIES,
  REQUEST_TYPES,
  SIMPLE_STATUSES,
  TIME_SLOTS,
  TRAININGS,
  optionsOf,
  type StatusDef,
} from "@/lib/constants";
import { formatDate, timeAgo } from "@/lib/utils";

/**
 * Description des ressources gérées par les écrans génériques (liste, fiche,
 * formulaire). Pendant de backend/routes/resource-definitions.js.
 *
 * - `inbox`   : dépôts du site (devis, candidatures…) — fiche en lecture,
 *               seuls le statut et les notes internes se modifient.
 * - `content` : contenus administrés (offres, formations…) — formulaire complet.
 */

export type Option = { value: string; label: string };

export type FieldType = "text" | "email" | "textarea" | "select" | "boolean" | "date" | "number" | "lines" | "image";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: Option[];
  required?: boolean;
  hint?: string;
  /** Occupe toute la largeur de la grille du formulaire. */
  full?: boolean;
  rows?: number;
  /** Non envoyé quand vide (ex. slug : l'API le génère). */
  omitIfEmpty?: boolean;
  defaultValue?: unknown;
};

export type ColumnDef = {
  key: string;
  label: string;
  render?: (item: AnyRecord) => React.ReactNode;
  className?: string;
};

export type FilterDef = { name: string; label: string; options: Option[] };

export type ResourceDef = {
  key: string;
  title: string;
  singular: string;
  description: string;
  icon: LucideIcon;
  mode: "inbox" | "content";
  columns: ColumnDef[];
  filters?: FilterDef[];
  searchPlaceholder?: string;
  /** Titre de la fiche. */
  primary: (item: AnyRecord) => string;
  /** inbox : lignes de la fiche en lecture. */
  details?: (item: AnyRecord) => [string, React.ReactNode][];
  statusMap?: Record<string, StatusDef>;
  /** content : champs du formulaire. */
  fields?: FieldDef[];
  deleteLevel: "edit" | "admin";
  csvExport?: string;
};

const opt = optionsOf;
const published = (item: AnyRecord) =>
  item.published ? <Badge tone="success">Publié</Badge> : <Badge>Brouillon</Badge>;
const mailto = (email?: string) => (email ? <a className="text-primary hover:underline" href={`mailto:${email}`}>{email}</a> : "—");
const link = (url?: string | null) =>
  url ? (
    <a className="text-primary hover:underline break-all" href={url} target="_blank" rel="noreferrer">
      {url}
    </a>
  ) : (
    "—"
  );

const createdColumn: ColumnDef = {
  key: "createdAt",
  label: "Reçu",
  render: (item) => <span className="text-muted-foreground" title={formatDate(item.createdAt, true)}>{timeAgo(item.createdAt)}</span>,
  className: "whitespace-nowrap",
};

const statusFilter = (map: Record<string, StatusDef>): FilterDef => ({ name: "status", label: "Statut", options: opt(map) });

const publishedFilter: FilterDef = {
  name: "published",
  label: "Publication",
  options: [
    { value: "true", label: "Publiés" },
    { value: "false", label: "Brouillons" },
  ],
};

export const RESOURCES: ResourceDef[] = [
  {
    key: "business-requests",
    title: "Business Center",
    singular: "demande",
    description: "Demandes des entreprises : recrutement, formation, audit RH.",
    icon: Handshake,
    mode: "inbox",
    statusMap: SIMPLE_STATUSES,
    searchPlaceholder: "Titre, entreprise, contact…",
    primary: (item) => item.title,
    columns: [
      { key: "title", label: "Demande", render: (i) => <div><div className="font-medium">{i.title}</div><div className="text-xs text-muted-foreground">{i.companyName} · {i.contactName}</div></div> },
      { key: "type", label: "Type", render: (i) => REQUEST_TYPES[i.type] ?? i.type },
      { key: "priority", label: "Priorité", render: (i) => <StatusBadge value={i.priority} map={PRIORITIES} /> },
      { key: "status", label: "Statut", render: (i) => <StatusBadge value={i.status} map={SIMPLE_STATUSES} /> },
      { key: "assignedTo", label: "Assignée à", render: (i) => i.assignedTo?.fullName ?? <span className="text-muted-foreground">—</span> },
      createdColumn,
    ],
    filters: [
      statusFilter(SIMPLE_STATUSES),
      { name: "type", label: "Type", options: opt(REQUEST_TYPES) },
      { name: "priority", label: "Priorité", options: opt(PRIORITIES) },
    ],
    deleteLevel: "admin",
  },
  {
    key: "quotes",
    title: "Devis",
    singular: "demande de devis",
    description: "Demandes déposées par le formulaire « Demander un devis » du site.",
    icon: Receipt,
    mode: "inbox",
    statusMap: SIMPLE_STATUSES,
    searchPlaceholder: "Nom, entreprise, email…",
    primary: (item) => `${item.name}${item.company ? ` — ${item.company}` : ""}`,
    columns: [
      { key: "name", label: "Contact", render: (i) => <div><div className="font-medium">{i.name}</div><div className="text-xs text-muted-foreground">{i.company ?? i.email}</div></div> },
      { key: "pole", label: "Pôle" },
      { key: "status", label: "Statut", render: (i) => <StatusBadge value={i.status} map={SIMPLE_STATUSES} /> },
      createdColumn,
    ],
    filters: [statusFilter(SIMPLE_STATUSES), { name: "pole", label: "Pôle", options: opt(POLES) }],
    details: (i) => [
      ["Pôle", i.pole],
      ["Nom", i.name],
      ["Entreprise", i.company],
      ["Email", mailto(i.email)],
      ["Téléphone", i.phone],
      ["Budget", i.budget],
      ["Échéance", i.deadline],
      ["Message", i.message],
      ["Reçu le", formatDate(i.createdAt, true)],
    ],
    deleteLevel: "admin",
  },
  {
    key: "pre-registrations",
    title: "Pré-inscriptions",
    singular: "pré-inscription",
    description: "Dossiers de pré-inscription aux formations.",
    icon: GraduationCap,
    mode: "inbox",
    statusMap: SIMPLE_STATUSES,
    searchPlaceholder: "Nom, email, téléphone…",
    primary: (item) => item.fullName,
    columns: [
      { key: "fullName", label: "Candidat", render: (i) => <div><div className="font-medium">{i.fullName}</div><div className="text-xs text-muted-foreground">{i.phone}</div></div> },
      { key: "training", label: "Formation" },
      { key: "startDate", label: "Début", render: (i) => formatDate(i.startDate), className: "whitespace-nowrap" },
      { key: "status", label: "Statut", render: (i) => <StatusBadge value={i.status} map={SIMPLE_STATUSES} /> },
      createdColumn,
    ],
    filters: [
      statusFilter(SIMPLE_STATUSES),
      { name: "training", label: "Formation", options: opt(TRAININGS) },
      { name: "financingType", label: "Financement", options: opt(FINANCING_TYPES) },
    ],
    details: (i) => [
      ["Formation", i.training],
      ["Durée", i.duration],
      ["Début souhaité", formatDate(i.startDate)],
      ["Nom complet", i.fullName],
      ["Email", mailto(i.email)],
      ["Téléphone", i.phone],
      ["Date de naissance", formatDate(i.dateOfBirth)],
      ["Lieu de naissance", i.placeOfBirth],
      ["Quartier", i.neighborhood],
      ["Profession", i.profession],
      ["Financement", i.financingType],
      ["Pièce d'identité", `${i.idDocumentType} — ${i.idDocumentNumber}`],
      ["Reçu le", formatDate(i.createdAt, true)],
    ],
    deleteLevel: "admin",
  },
  {
    key: "applications",
    title: "Candidatures",
    singular: "candidature",
    description: "Candidatures reçues, spontanées ou sur une offre.",
    icon: UserCheck,
    mode: "inbox",
    statusMap: APPLICATION_STATUSES,
    searchPlaceholder: "Nom, email, téléphone…",
    primary: (item) => item.fullName,
    columns: [
      { key: "fullName", label: "Candidat", render: (i) => <div><div className="font-medium">{i.fullName}</div><div className="text-xs text-muted-foreground">{i.email}</div></div> },
      { key: "offer", label: "Offre", render: (i) => i.offer?.title ?? <span className="text-muted-foreground">Spontanée</span> },
      { key: "status", label: "Statut", render: (i) => <StatusBadge value={i.status} map={APPLICATION_STATUSES} /> },
      createdColumn,
    ],
    filters: [statusFilter(APPLICATION_STATUSES)],
    details: (i) => [
      ["Offre", i.offer?.title ?? "Candidature spontanée"],
      ["Nom complet", i.fullName],
      ["Email", mailto(i.email)],
      ["Téléphone", i.phone],
      ["CV", link(i.cvUrl)],
      ["Message", i.coverLetter],
      ["Reçue le", formatDate(i.createdAt, true)],
    ],
    deleteLevel: "admin",
  },
  {
    key: "messages",
    title: "Messages",
    singular: "message",
    description: "Messages de contact et demandes de rendez-vous du site.",
    icon: Mail,
    mode: "inbox",
    statusMap: SIMPLE_STATUSES,
    searchPlaceholder: "Nom, email, sujet…",
    primary: (item) => `${item.kind === "rendez-vous" ? "Rendez-vous" : "Message"} — ${item.name}`,
    columns: [
      { key: "name", label: "Expéditeur", render: (i) => <div><div className="font-medium">{i.name}</div><div className="text-xs text-muted-foreground">{i.email}</div></div> },
      { key: "kind", label: "Type", render: (i) => <Badge tone={i.kind === "rendez-vous" ? "progress" : "neutral"}>{i.kind === "rendez-vous" ? <CalendarCheck className="h-3 w-3" /> : <Mail className="h-3 w-3" />}{MESSAGE_KINDS[i.kind] ?? i.kind}</Badge> },
      { key: "subject", label: "Objet", render: (i) => <span className="line-clamp-1">{i.subject ?? i.reason ?? "—"}</span> },
      { key: "status", label: "Statut", render: (i) => <StatusBadge value={i.status} map={SIMPLE_STATUSES} /> },
      createdColumn,
    ],
    filters: [statusFilter(SIMPLE_STATUSES), { name: "kind", label: "Type", options: opt(MESSAGE_KINDS) }],
    details: (i) => [
      ["Type", MESSAGE_KINDS[i.kind] ?? i.kind],
      ["Nom", i.name],
      ["Email", mailto(i.email)],
      ["Téléphone", i.phone],
      ...(i.kind === "rendez-vous"
        ? ([
            ["Motif", i.reason],
            ["Date souhaitée", formatDate(i.preferredDate)],
            ["Créneau", TIME_SLOTS[i.timeSlot] ?? i.timeSlot],
          ] as [string, React.ReactNode][])
        : ([["Sujet", i.subject]] as [string, React.ReactNode][])),
      ["Message", i.message],
      ["Reçu le", formatDate(i.createdAt, true)],
    ],
    deleteLevel: "admin",
  },
  {
    key: "offers",
    title: "Offres d'emploi",
    singular: "offre",
    description: "Offres d'emploi et de stage publiées sur le site.",
    icon: Briefcase,
    mode: "content",
    searchPlaceholder: "Titre, lieu, secteur…",
    primary: (item) => item.title,
    columns: [
      { key: "title", label: "Titre", render: (i) => <div><div className="font-medium">{i.title}</div><div className="text-xs text-muted-foreground">{[i.location, i.sector].filter(Boolean).join(" · ")}</div></div> },
      { key: "contractType", label: "Contrat", render: (i) => CONTRACT_TYPES[i.contractType] ?? i.contractType },
      { key: "expiresAt", label: "Expire", render: (i) => (i.expiresAt ? formatDate(i.expiresAt) : "—"), className: "whitespace-nowrap" },
      { key: "published", label: "État", render: published },
    ],
    filters: [publishedFilter, { name: "contractType", label: "Contrat", options: opt(CONTRACT_TYPES) }],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      { name: "contractType", label: "Type de contrat", type: "select", options: opt(CONTRACT_TYPES), required: true, defaultValue: "stage" },
      { name: "location", label: "Lieu", type: "text" },
      { name: "sector", label: "Secteur", type: "text" },
      { name: "duration", label: "Durée", type: "text" },
      { name: "description", label: "Description", type: "textarea", required: true, full: true, rows: 6, hint: "20 caractères minimum." },
      { name: "requirements", label: "Profil recherché", type: "textarea", full: true, rows: 4 },
      { name: "expiresAt", label: "Date d'expiration", type: "date", hint: "L'offre disparaît du site après cette date." },
      { name: "published", label: "Publiée sur le site", type: "boolean", defaultValue: false },
    ],
    deleteLevel: "admin",
  },
  {
    key: "formations",
    title: "Formations",
    singular: "formation",
    description: "Catalogue de formations affiché sur le site.",
    icon: GraduationCap,
    mode: "content",
    searchPlaceholder: "Titre, catégorie…",
    primary: (item) => item.title,
    columns: [
      { key: "title", label: "Formation", render: (i) => <div><div className="font-medium">{i.title}</div><div className="text-xs text-muted-foreground">{i.category}</div></div> },
      { key: "duration", label: "Durée" },
      { key: "certifying", label: "Certifiante", render: (i) => (i.certifying ? <Badge tone="success">Oui</Badge> : "—") },
      { key: "order", label: "Ordre" },
      { key: "published", label: "État", render: published },
    ],
    filters: [publishedFilter, { name: "category", label: "Catégorie", options: opt(FORMATION_CATEGORIES) }],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      { name: "category", label: "Catégorie", type: "select", options: opt(FORMATION_CATEGORIES), required: true },
      { name: "slug", label: "Slug (URL)", type: "text", omitIfEmpty: true, hint: "Laisser vide pour le générer depuis le titre." },
      { name: "duration", label: "Durée", type: "text" },
      { name: "level", label: "Niveau", type: "text" },
      { name: "price", label: "Tarif", type: "text" },
      { name: "order", label: "Ordre d'affichage", type: "number", defaultValue: 0 },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 4 },
      { name: "program", label: "Programme", type: "lines", full: true, rows: 6, hint: "Une ligne par module." },
      { name: "imageUrl", label: "Image", type: "image", full: true },
      { name: "certifying", label: "Formation certifiante", type: "boolean", defaultValue: false },
      { name: "published", label: "Publiée sur le site", type: "boolean", defaultValue: true },
    ],
    deleteLevel: "admin",
  },
  {
    key: "posts",
    title: "Blog",
    singular: "article",
    description: "Articles du blog.",
    icon: Newspaper,
    mode: "content",
    searchPlaceholder: "Titre, contenu…",
    primary: (item) => item.title,
    columns: [
      { key: "title", label: "Article", render: (i) => <div><div className="font-medium">{i.title}</div><div className="text-xs text-muted-foreground">{i.category}</div></div> },
      { key: "author", label: "Auteur", render: (i) => i.author?.fullName ?? "—" },
      { key: "publishedAt", label: "Publié le", render: (i) => formatDate(i.publishedAt), className: "whitespace-nowrap" },
      { key: "featured", label: "À la une", render: (i) => (i.featured ? <Badge tone="warning">À la une</Badge> : "—") },
      { key: "published", label: "État", render: published },
    ],
    filters: [publishedFilter, { name: "category", label: "Catégorie", options: opt(BLOG_CATEGORIES) }],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      { name: "category", label: "Catégorie", type: "select", options: opt(BLOG_CATEGORIES), required: true },
      { name: "slug", label: "Slug (URL)", type: "text", omitIfEmpty: true, hint: "Laisser vide pour le générer depuis le titre." },
      { name: "readTime", label: "Temps de lecture", type: "text", hint: "Ex. « 5 min »" },
      { name: "excerpt", label: "Résumé", type: "textarea", required: true, full: true, rows: 3, hint: "20 caractères minimum, affiché dans la liste des articles." },
      { name: "content", label: "Contenu", type: "textarea", required: true, full: true, rows: 14, hint: "Paragraphes séparés par une ligne vide. « ## » en début de ligne = sous-titre, « - » = élément de liste." },
      { name: "imageUrl", label: "Image", type: "image", full: true },
      { name: "featured", label: "Mettre à la une", type: "boolean", defaultValue: false },
      { name: "published", label: "Publié sur le site", type: "boolean", defaultValue: false },
    ],
    deleteLevel: "admin",
  },
  {
    key: "companies",
    title: "Entreprises",
    singular: "entreprise",
    description: "Fiches des entreprises clientes.",
    icon: Building2,
    mode: "content",
    searchPlaceholder: "Nom, secteur, ville, contact…",
    primary: (item) => item.name,
    columns: [
      { key: "name", label: "Entreprise", render: (i) => <div><div className="font-medium">{i.name}</div><div className="text-xs text-muted-foreground">{i.sector ?? ""}</div></div> },
      { key: "contactName", label: "Contact", render: (i) => <div><div>{i.contactName ?? "—"}</div><div className="text-xs text-muted-foreground">{i.contactEmail ?? ""}</div></div> },
      { key: "city", label: "Ville" },
      createdColumn,
    ],
    fields: [
      { name: "name", label: "Raison sociale", type: "text", required: true, full: true },
      { name: "sector", label: "Secteur", type: "text" },
      { name: "size", label: "Taille", type: "text", hint: "Ex. « 10-50 salariés »" },
      { name: "rccm", label: "RCCM", type: "text" },
      { name: "niu", label: "NIU", type: "text" },
      { name: "contactName", label: "Nom du contact", type: "text" },
      { name: "contactEmail", label: "Email du contact", type: "email" },
      { name: "contactPhone", label: "Téléphone du contact", type: "text" },
      { name: "address", label: "Adresse", type: "text" },
      { name: "city", label: "Ville", type: "text" },
      { name: "country", label: "Pays", type: "text", defaultValue: "Congo" },
      { name: "notes", label: "Notes internes", type: "textarea", full: true },
    ],
    deleteLevel: "admin",
  },
  {
    key: "subscribers",
    title: "Newsletter",
    singular: "abonné",
    description: "Liste de diffusion de la newsletter.",
    icon: Users,
    mode: "content",
    searchPlaceholder: "Email, origine…",
    primary: (item) => item.email,
    columns: [
      { key: "email", label: "Email", render: (i) => <span className="font-medium">{i.email}</span> },
      { key: "source", label: "Origine" },
      { key: "active", label: "État", render: (i) => (i.active ? <Badge tone="success">Actif</Badge> : <Badge>Désinscrit</Badge>) },
      { key: "createdAt", label: "Inscrit le", render: (i) => formatDate(i.createdAt), className: "whitespace-nowrap" },
    ],
    filters: [
      {
        name: "active",
        label: "État",
        options: [
          { value: "true", label: "Actifs" },
          { value: "false", label: "Désinscrits" },
        ],
      },
    ],
    fields: [
      { name: "email", label: "Email", type: "email", required: true, full: true },
      { name: "source", label: "Origine", type: "text", defaultValue: "admin" },
      { name: "active", label: "Abonnement actif", type: "boolean", defaultValue: true },
    ],
    deleteLevel: "edit",
    csvExport: "/subscribers/export/csv",
  },
];

export const RESOURCE_BY_KEY = Object.fromEntries(RESOURCES.map((r) => [r.key, r]));
