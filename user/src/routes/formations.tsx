import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award, CheckCircle2, Users, Calculator, Monitor, ShoppingBag,
  Truck, ShieldCheck, Languages, Code2, Rocket,
  GraduationCap, Sparkles, ArrowRight, BadgeCheck, MonitorPlay, UserCheck,
} from "lucide-react";
import sageHero from "@/assets/formation-sage-2.jpg";
import imgRH from "@/assets/consultant-rh.jpg";
import imgCompta from "@/assets/formation-sage-1.jpg";
import imgInfo from "@/assets/formation-sage-2.jpg";
import imgCommerce from "@/assets/team.jpg";
import imgLogistique from "@/assets/technical.jpg";
import imgQHSE from "@/assets/equipe-couloir.jpg";
import imgLangues from "@/assets/reunion-conseil.jpg";
import imgDigital from "@/assets/hero.jpg";
import imgEntrepreneuriat from "@/assets/training.jpg";

export const Route = createFileRoute("/formations")({
  head: () => ({
    meta: [
      { title: "Formations professionnelles — Office Management" },
      { name: "description", content: "Catalogue complet de formations certifiantes : RH, comptabilité, bureautique, commerce, logistique, QHSE, langues, digital, entrepreneuriat." },
      { property: "og:title", content: "Formations — Office Management" },
      { property: "og:description", content: "Programmes certifiants pour développer vos compétences." },
    ],
  }),
  component: Formations,
});

const categories = [
  { icon: Users, image: imgRH, title: "Ressources Humaines & Administration", items: [
      "Assistant(e) RH (Sage 100 i7 Paie & RH et Excel)",
      "Management RH (Sage 100 i7 Paie & RH)",
      "Gestion administrative du personnel (Excel)",
      "Secrétariat et Assistant(e) de Direction",
      "Secrétariat Comptable",
      "Techniques de recrutement et gestion des talents",
      "Gestion des conflits en entreprise",
      "Communication professionnelle",
  ]},
  { icon: Calculator, image: imgCompta, title: "Comptabilité & Gestion", items: [
      "Comptabilité (Sage 100 i7 Comptabilité)",
      "Gestion de Caisse (Sage 100 i7 Saisie de Caisse)",
      "Fiscalité d'entreprise",
      "Analyse financière",
      "Comptabilité générale et analytique",
      "Gestion budgétaire",
      "Initiation à l'audit comptable",
  ]},
  { icon: Monitor, image: imgInfo, title: "Informatique & Bureautique", items: [
      "Excel Débutant à Avancé",
      "Gestion de paie sur Excel",
      "Bureautique complète (Word, Excel, PowerPoint)",
      "Power BI & Tableaux de bord",
      "Informatique de base",
      "Maintenance informatique",
      "Initiation aux réseaux informatiques",
  ]},
  { icon: ShoppingBag, image: imgCommerce, title: "Commerce & Marketing", items: [
      "Gestion Commerciale (Sage 100 i7 Gescom)",
      "Vente en ligne",
      "E-commerce",
      "Community Management",
      "Marketing Digital",
      "Techniques de vente et négociation",
      "Service client et relation commerciale",
  ]},
  { icon: Truck, image: imgLogistique, title: "Logistique & Transit", items: [
      "Assistant(e) Logistique (Gescom et Excel)",
      "Gestion des Stocks & Approvisionnements",
      "Logistique et Transport",
      "Procédures douanières & Transit",
      "Gestion des opérations portuaires",
      "Chaîne logistique et Supply Chain",
  ]},
  { icon: ShieldCheck, image: imgQHSE, title: "QHSE & Industrie", items: [
      "Superviseur QHSE (Excel)",
      "QHSE : Qualité, Hygiène, Sécurité et Environnement",
      "Sécurité au travail",
      "Gestion des risques professionnels",
      "Sensibilisation HSE en entreprise",
  ]},
  { icon: Languages, image: imgLangues, title: "Langues & Communication", items: [
      "Anglais professionnel",
      "Anglais des affaires",
      "Communication d'entreprise",
      "Techniques de prise de parole en public",
  ]},
  { icon: Code2, image: imgDigital, title: "Développement Digital & Technologie", items: [
      "Programmation",
      "Création de sites web",
      "Design graphique",
      "Montage vidéo",
      "Infographie",
      "Initiation à l'intelligence artificielle",
  ]},
  { icon: Rocket, image: imgEntrepreneuriat, title: "Entrepreneuriat & Développement Personnel", items: [
      "Création et gestion d'entreprise",
      "Leadership professionnel",
      "Gestion de projet",
      "Entrepreneuriat digital",
      "Développement personnel et coaching professionnel",
  ]},
];

const totalModules = categories.reduce((n, c) => n + c.items.length, 0);

const highlights = [
  { icon: GraduationCap, v: `${categories.length}`, l: "Domaines d'expertise" },
  { icon: BadgeCheck, v: `${totalModules}+`, l: "Formations disponibles" },
  { icon: MonitorPlay, v: "Présentiel & en ligne", l: "Modalités flexibles" },
  { icon: Award, v: "Certifiantes", l: "Diplômes reconnus" },
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
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-24 md:py-28">
        <img src={sageHero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" width={1280} height={800} loading="eager" />
        <div className="absolute inset-0 -z-10 gradient-hero opacity-95" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <GraduationCap className="h-3.5 w-3.5" /> Catalogue de formations
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Formations <span className="text-gradient-cyan">professionnelles</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Développez vos compétences avec nos formations qualifiantes et certifiantes, adaptées aux besoins actuels du marché.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan">
              <Link to="/pre-inscription">Me pré-inscrire <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
              <Link to="/devis">Formation en entreprise</Link>
            </Button>
          </div>
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
              <div className="font-display text-lg md:text-xl font-extrabold text-gradient-cyan leading-tight">{h.v}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{h.l}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* CATEGORIES */}
      <Section className="pt-0!">
        <SectionTitle eyebrow="Nos domaines" title="Un catalogue complet et certifiant" subtitle="Neuf domaines d'expertise pour construire ou faire évoluer votre carrière." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.title} className="group gradient-card border-border overflow-hidden hover-lift flex flex-col">
              <div className="relative h-44 overflow-hidden">
                <img src={cat.image} alt={cat.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" width={640} height={360} />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
                <div className="absolute top-3 left-3 h-11 w-11 rounded-xl gradient-cyan flex items-center justify-center glow-cyan">
                  <cat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-background/70 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-primary">
                  {cat.items.length} formations
                </div>
                <h3 className="absolute bottom-3 left-4 right-4 font-display text-lg font-bold leading-tight">{cat.title}</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-2 text-sm text-muted-foreground flex-1">
                  {cat.items.slice(0, 5).map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {it}
                    </li>
                  ))}
                  {cat.items.length > 5 && (
                    <li className="text-xs text-primary font-medium pl-6">+ {cat.items.length - 5} autres formations</li>
                  )}
                </ul>
                <Button asChild size="sm" className="mt-5 gradient-cyan text-primary-foreground">
                  <Link to="/pre-inscription">S'inscrire <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* AVANTAGES */}
      <Section className="pt-0!">
        <SectionTitle eyebrow="Pourquoi nous choisir" title="Des formations pensées pour l'emploi" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {advantages.map((a) => (
            <Card key={a.t} className="gradient-card border-border p-5 flex items-center gap-4 hover-lift">
              <div className="h-11 w-11 rounded-xl gradient-cyan flex items-center justify-center shrink-0">
                <a.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">{a.t}</span>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0!">
        <Card className="gradient-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 bg-primary/25 blur-3xl rounded-full" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Prêt à monter en compétences ?</h2>
            <p className="text-muted-foreground mb-8">
              Lancez votre pré-inscription en quelques minutes, ou demandez un programme sur mesure pour vos équipes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan">
                <Link to="/pre-inscription">Démarrer ma pré-inscription <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
                <Link to="/contact">Poser une question</Link>
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
