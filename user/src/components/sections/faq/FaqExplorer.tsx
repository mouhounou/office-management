import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Audience = "particuliers" | "entreprises";
type Faq = { q: string; a: string; audience: Audience };

/** FAQ unique : questions de /faq et /faq-interactive, dédoublonnées. */
const FAQS: Faq[] = [
  {
    audience: "particuliers",
    q: "Comment s'inscrire à une formation ?",
    a: "Inscrivez-vous directement en ligne via notre page Pré-inscription, ou contactez-nous via nos numéros officiels.",
  },
  {
    audience: "particuliers",
    q: "Les formations sont-elles certifiantes ?",
    a: "Oui, nos formations donnent droit à des certificats et diplômes selon la durée choisie.",
  },
  {
    audience: "particuliers",
    q: "Comment obtenir son certificat ?",
    a: "Le certificat est délivré à l'issue de la formation, après validation des évaluations, sous 15 jours ouvrés.",
  },
  {
    audience: "particuliers",
    q: "Proposez-vous des stages ?",
    a: "Oui, certains programmes incluent des stages pratiques en entreprise.",
  },
  {
    audience: "particuliers",
    q: "Les formations sont-elles bilingues ?",
    a: "Oui, plusieurs de nos formations sont disponibles en français et en anglais.",
  },
  {
    audience: "particuliers",
    q: "Puis-je suivre une formation à distance ?",
    a: "Oui. Nos formations sont proposées en présentiel à Pointe-Noire et plusieurs d'entre elles sont disponibles en ligne pour davantage de flexibilité.",
  },
  {
    audience: "particuliers",
    q: "Quels sont les moyens de paiement acceptés ?",
    a: "Mobile money, virement bancaire ou espèces, selon les modalités convenues.",
  },
  {
    audience: "entreprises",
    q: "Comment demander un recrutement ?",
    a: "Depuis notre Business Center, rubrique Recrutement. Nous revenons vers vous sous 48 h.",
  },
  {
    audience: "entreprises",
    q: "Quels sont vos délais de recrutement ?",
    a: "De 15 à 45 jours selon le profil et la rareté des compétences recherchées.",
  },
  {
    audience: "entreprises",
    q: "Quels secteurs couvrez-vous ?",
    a: "Pétrole & gaz, industrie, banque, télécoms, ONG, distribution et administration.",
  },
  {
    audience: "entreprises",
    q: "Proposez-vous des audits RH ?",
    a: "Oui : audit social, audit paie, audit de conformité et audit organisationnel.",
  },
];

const FILTERS: { value: "tous" | Audience; label: string }[] = [
  { value: "tous", label: "Toutes les questions" },
  { value: "particuliers", label: "Particuliers & formations" },
  { value: "entreprises", label: "Entreprises" },
];

export function FaqExplorer() {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState<"tous" | Audience>("tous");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter(
      (f) =>
        (audience === "tous" || f.audience === audience) &&
        (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)),
    );
  }, [query, audience]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une question…"
          aria-label="Rechercher une question"
          className="pl-10"
        />
      </div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setAudience(f.value)}
            aria-pressed={audience === f.value}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              audience === f.value
                ? "gradient-cyan text-primary-foreground"
                : "bg-brand-soft text-brand-strong hover:opacity-80",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card px-6 shadow-card">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucune question ne correspond à votre recherche.
          </p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filtered.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="last:border-b-0">
                <AccordionTrigger className="text-left font-display">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
