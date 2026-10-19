import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle2,
  Rocket,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BadgeCheck,
  MonitorPlay,
  UserCheck,
} from "lucide-react";
import sageHero from "@/assets/formation-sage-2.jpg";

import { AcademiesStrip } from "@/components/sections/formations/AcademiesStrip";
import { CertificationsSection } from "@/components/sections/formations/CertificationsSection";
import { FormateursSection } from "@/components/sections/formations/FormateursSection";
import { LaureatsSection } from "@/components/sections/formations/LaureatsSection";
import { RoiCalculator } from "@/components/sections/formations/RoiCalculator";
import { fetchFormations, type Formation } from "@/lib/content";
import { FormationCatalogue } from "@/components/formations/FormationCatalogue";
import { GraduationScene } from "@/components/formations/GraduationScene";

type CategoryGroup = { title: string; items: Formation[] };

/** Regroupe les formations par catégorie, dans l'ordre d'affichage choisi en admin. */
function groupByCategory(formations: Formation[]): CategoryGroup[] {
  const groups = new Map<string, Formation[]>();
  for (const formation of formations) {
    const list = groups.get(formation.category) ?? [];
    list.push(formation);
    groups.set(formation.category, list);
  }
  return [...groups.entries()].map(([title, items]) => ({ title, items }));
}

export const Route = createFileRoute("/formations")({
  head: () => ({
    meta: [
      { title: "Formations professionnelles — Office Management" },
      {
        name: "description",
        content:
          "Office Management Business School : académies RH, comptabilité, management, informatique et Sage, catalogue de formations certifiantes, badges de certification, formateurs experts, lauréats et calculateur de ROI formation.",
      },
      { property: "og:title", content: "Formations — Office Management" },
      {
        property: "og:description",
        content: "Académies, certifications, formateurs experts et calculateur de ROI formation.",
      },
    ],
  }),
  loader: async () => {
    try {
      return { formations: await fetchFormations() };
    } catch {
      return { formations: [] as Formation[] };
    }
  },
  component: Formations,
});

const buildHighlights = (groupCount: number, total: number) => [
  { icon: GraduationCap, v: `${groupCount}`, l: "Domaines d'expertise" },
  { icon: BadgeCheck, v: `${total}+`, l: "Formations disponibles" },
  { icon: MonitorPlay, v: "Présentiel & en ligne", l: "Modalités flexibles" },
  { icon: Award, v: "Certifiantes", l: "Diplômes reconnus" },
];

const SECTION_LINKS = [
  { hash: "academies", label: "Académies" },
  { hash: "certifications", label: "Certifications" },
  { hash: "formateurs", label: "Formateurs" },
  { hash: "laureats", label: "Lauréats" },
  { hash: "roi", label: "Calculateur ROI" },
];

const advantages = [
  { icon: BadgeCheck, t: "Formations pratiques et professionnelles" },
  { icon: UserCheck, t: "Encadrement par des experts" },
  { icon: Award, t: "Certificats et diplômes reconnus" },
  { icon: Rocket, t: "Stages et accompagnement professionnel" },
  { icon: MonitorPlay, t: "Disponibles en présentiel et en ligne" },
  { icon: Sparkles, t: "Programmes actualisés selon le marché" },
];

function Formations() {
  const { formations } = Route.useLoaderData();
  const groups = groupByCategory(formations);
  const highlights = buildHighlights(groups.length, formations.length);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-24 md:py-28">
        <img
          src={sageHero}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
          width={1280}
          height={800}
          loading="eager"
        />
        <div className="absolute inset-0 -z-10 gradient-hero opacity-95" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div
          className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <GraduationCap className="h-3.5 w-3.5" /> Catalogue de formations
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Formations <span className="text-gradient-cyan">professionnelles</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Développez vos compétences avec nos formations qualifiantes et certifiantes, adaptées
            aux besoins actuels du marché.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan"
            >
              <Link to="/pre-inscription">
                Me pré-inscrire <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary/40 hover:bg-primary/10"
            >
              <Link to="/devis">Formation en entreprise</Link>
            </Button>
          </div>
          <nav
            aria-label="Sections de la page"
            className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground"
          >
            {SECTION_LINKS.map((l) => (
              <Link key={l.hash} to="/formations" hash={l.hash} className="hover:text-primary">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <Section className="py-12!">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h) => (
            <div key={h.l} className="glass rounded-2xl p-5 text-center">
              <div className="mx-auto mb-3 h-11 w-11 rounded-xl gradient-cyan flex items-center justify-center">
                <h.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="font-display text-lg md:text-xl font-extrabold text-gradient-cyan leading-tight">
                {h.v}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                {h.l}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ACADÉMIES & CATALOGUE */}
      <Section id="academies" className="scroll-mt-24 pt-0!">
        <SectionTitle
          eyebrow="Office Management Business School"
          title="Nos académies et notre catalogue"
          subtitle="Cinq académies, un même standard d'excellence — et le détail de chaque programme, domaine par domaine."
        />
        <AcademiesStrip />
        <div className="mt-14">
          <FormationCatalogue formations={formations} />
        </div>
      </Section>

      {/* AVANTAGES */}
      <Section className="pt-0!">
        <SectionTitle
          eyebrow="Pourquoi nous choisir"
          title="Des formations pensées pour l'emploi"
        />
        <div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
          data-reveal-stagger
        >
          {advantages.map((a) => (
            <Card
              key={a.t}
              className="gradient-card border-border p-5 flex items-center gap-4 hover-lift"
            >
              <div className="h-11 w-11 rounded-xl gradient-cyan flex items-center justify-center shrink-0">
                <a.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">{a.t}</span>
            </Card>
          ))}
        </div>
      </Section>

      <CertificationsSection />
      <FormateursSection />
      <LaureatsSection />
      <RoiCalculator />

      {/* APPEL À L'ACTION */}
      <Section className="pt-0!">
        <div
          className="theme-dark relative overflow-hidden rounded-3xl bg-navy-deep px-6 py-10 sm:px-10 md:py-14"
          data-reveal
        >
          <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-24 h-64 w-64 rounded-full border-[20px] border-cyan/15" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div className="text-center md:text-left">
              <div className="eyebrow mb-4 justify-center md:justify-start">Prochaine session</div>
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                Prêt à monter en <span className="text-gradient-cyan">compétences</span> ?
              </h2>
              <p className="mt-3 max-w-xl text-white/70">
                Pré-inscription en quelques minutes, réponse sous 48 h. Pour vos équipes, nous
                construisons un programme sur mesure, en présentiel ou en ligne.
              </p>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/80 md:justify-start">
                {["Présentiel ou en ligne", "Réponse sous 48 h", "Attestation ou certificat"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-glow" /> {item}
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                <Link
                  to="/pre-inscription"
                  className="inline-flex h-12 items-center gap-2 rounded-full gradient-cyan px-6 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                >
                  Démarrer ma pré-inscription <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/devis"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Former mon équipe
                </Link>
              </div>
            </div>
            <div className="mx-auto h-56 w-full max-w-xs md:h-72 md:max-w-sm">
              <GraduationScene />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
