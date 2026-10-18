import { Briefcase, Calculator, Database, Laptop, Users } from "lucide-react";

/**
 * Les cinq académies de l'Office Management Business School (ex-pages
 * « Business School » et « Centre de compétences », fusionnées). Le détail
 * des programmes vient du catalogue administré, affiché juste en dessous.
 */
const ACADEMIES = [
  {
    icon: Users,
    title: "Ressources Humaines",
    topics: [
      "Assistant RH",
      "Responsable RH",
      "Administration du personnel",
      "Recrutement",
      "Paie",
      "GPEC",
      "Audit social",
    ],
  },
  {
    icon: Calculator,
    title: "Comptabilité & Finance",
    topics: ["Comptabilité générale", "Fiscalité", "Contrôle de gestion", "Audit"],
  },
  {
    icon: Briefcase,
    title: "Management & Leadership",
    topics: [
      "Leadership",
      "Gestion des équipes",
      "Coaching",
      "Communication",
      "Gestion de projet",
      "Procédures",
    ],
  },
  {
    icon: Laptop,
    title: "Informatique & Bureautique",
    topics: ["Excel avancé", "Word", "PowerPoint", "Power BI", "Microsoft 365"],
  },
  {
    icon: Database,
    title: "Sage",
    topics: [
      "Sage 100 i7",
      "Sage Paie & RH",
      "Sage Comptabilité",
      "Sage Gestion commerciale",
      "Sage Immobilisations",
    ],
  },
];

export function AcademiesStrip() {
  return (
    <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {ACADEMIES.map((a) => (
        <div key={a.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <a.icon className="h-5 w-5" />
            </span>
            <h3 className="font-display text-sm font-bold leading-tight">
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-brand-strong">
                Académie
              </span>
              {a.title}
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{a.topics.join(" · ")}</p>
        </div>
      ))}
    </div>
  );
}
