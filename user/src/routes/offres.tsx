import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, Users, Wrench, Briefcase, Sparkles, Calculator,
  Clock, CheckCircle2, ArrowRight, Star,
} from "lucide-react";

export const Route = createFileRoute("/offres")({
  head: () => ({
    meta: [
      { title: "Nos offres & packs — Office Management" },
      { name: "description", content: "Packs structurés par pôle : formation certifiante, mise à disposition, maintenance industrielle, audit RH, services additionnels et logiciels." },
      { property: "og:title", content: "Offres & packs — Office Management" },
      { property: "og:description", content: "Des formules claires avec durée indicative et tarifs à partir de." },
    ],
  }),
  component: Offres,
});

type Pack = {
  name: string;
  duration: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

type Pole = {
  id: string;
  icon: typeof GraduationCap;
  title: string;
  intro: string;
  packs: Pack[];
};

const poles: Pole[] = [
  {
    id: "formation",
    icon: GraduationCap,
    title: "Formation professionnelle",
    intro: "Des parcours certifiants et des modules ciblés, en présentiel ou à distance.",
    packs: [
      {
        name: "Pack Découverte",
        duration: "1 mois · 20h",
        price: "75 000 FCFA",
        desc: "Module unique pour monter rapidement en compétence sur un sujet précis.",
        features: ["1 module au choix", "Support pédagogique inclus", "Attestation de participation", "Présentiel ou e-learning"],
      },
      {
        name: "Pack Certifiant",
        duration: "2 à 4 mois",
        price: "250 000 FCFA",
        desc: "Parcours complet débouchant sur une certification professionnelle reconnue.",
        features: ["Programme intensif certifiant", "Stage professionnel intégré", "Suivi personnalisé", "Accompagnement à l'insertion"],
        highlight: true,
        badge: "Le + populaire",
      },
      {
        name: "Pack Entreprise",
        duration: "Sur mesure",
        price: "Sur devis",
        desc: "Formation intra-entreprise adaptée à vos enjeux métiers et à vos équipes.",
        features: ["Audit des besoins", "Programme sur mesure", "Formateurs experts métier", "Reporting de progression"],
      },
    ],
  },
  {
    id: "personnel",
    icon: Users,
    title: "Mise à disposition de personnel",
    intro: "Du remplacement ponctuel au placement permanent, des profils pré-qualifiés.",
    packs: [
      {
        name: "Mission Flash",
        duration: "1 à 4 semaines",
        price: "À partir de 150 000 FCFA / sem.",
        desc: "Personnel immédiatement opérationnel pour un besoin court (remplacement, surcroît).",
        features: ["Profil disponible sous 72h", "Gestion administrative incluse", "Remplacement garanti", "Suivi qualité"],
      },
      {
        name: "Mission Longue",
        duration: "1 à 12 mois",
        price: "À partir de 450 000 FCFA / mois",
        desc: "Mise à disposition durable d'un collaborateur intégré à vos équipes.",
        features: ["Profil sélectionné sur cahier des charges", "Paie et charges gérées", "Évaluation mensuelle", "Option d'embauche"],
        highlight: true,
        badge: "Recommandé",
      },
      {
        name: "Recrutement permanent",
        duration: "30 à 60 jours",
        price: "1 mois de salaire brut",
        desc: "Recrutement clé en main avec garantie de remplacement.",
        features: ["Sourcing & présélection", "Entretiens & tests", "Vérification des références", "Garantie 3 mois"],
      },
    ],
  },
  {
    id: "techniques",
    icon: Wrench,
    title: "Prestations techniques",
    intro: "Interventions ponctuelles ou contrats de maintenance pour vos sites et bâtiments.",
    packs: [
      {
        name: "Intervention Ponctuelle",
        duration: "À la demande",
        price: "À partir de 50 000 FCFA",
        desc: "Soudure, électricité, climatisation, plomberie — diagnostic et réparation.",
        features: ["Devis sous 24h", "Intervention rapide", "Pièces et main d'œuvre", "Garantie 30 jours"],
      },
      {
        name: "Contrat Maintenance Préventive",
        duration: "12 mois",
        price: "À partir de 350 000 FCFA / mois",
        desc: "Visites planifiées et maintenance préventive pour fiabiliser vos installations.",
        features: ["Visites mensuelles programmées", "Rapports d'intervention", "Tarif préférentiel curatif", "Astreinte téléphonique"],
        highlight: true,
        badge: "Meilleure valeur",
      },
      {
        name: "Pack Industriel 24/7",
        duration: "Sur mesure",
        price: "Sur devis",
        desc: "Couverture complète pour sites industriels avec équipes dédiées.",
        features: ["Équipe dédiée sur site", "Astreinte 24h/24 · 7j/7", "Maintenance prédictive", "KPI & reporting mensuel"],
      },
    ],
  },
  {
    id: "conseil",
    icon: Briefcase,
    title: "Conseil RH",
    intro: "De l'audit ponctuel à l'externalisation complète de la fonction RH.",
    packs: [
      {
        name: "Audit RH Express",
        duration: "2 semaines",
        price: "À partir de 500 000 FCFA",
        desc: "Diagnostic complet de votre fonction RH avec plan d'actions priorisé.",
        features: ["Audit organisationnel", "Cartographie des risques RH", "Rapport détaillé", "Présentation au comité"],
      },
      {
        name: "Externalisation Paie",
        duration: "Mensuel",
        price: "À partir de 5 000 FCFA / bulletin",
        desc: "Gestion intégrale de votre paie : bulletins, déclarations, conformité.",
        features: ["Bulletins de paie sécurisés", "Déclarations sociales", "Veille réglementaire", "Portail RH en ligne"],
        highlight: true,
        badge: "Le + demandé",
      },
      {
        name: "Transformation RH",
        duration: "3 à 12 mois",
        price: "Sur devis",
        desc: "Accompagnement stratégique pour structurer ou digitaliser votre fonction RH.",
        features: ["Cadrage stratégique", "Choix d'outils SIRH", "Conduite du changement", "Formation des managers"],
      },
    ],
  },
  {
    id: "additionnels",
    icon: Sparkles,
    title: "Services additionnels",
    intro: "Coaching, accompagnement carrière et services aux particuliers.",
    packs: [
      {
        name: "Pack CV & Lettre",
        duration: "3 jours",
        price: "25 000 FCFA",
        desc: "CV professionnel et lettre de motivation rédigés par des experts RH.",
        features: ["Entretien de cadrage", "CV mis en page premium", "Lettre personnalisée", "1 révision incluse"],
      },
      {
        name: "Coaching Emploi",
        duration: "1 mois · 4 séances",
        price: "75 000 FCFA",
        desc: "Accompagnement individuel pour décrocher le poste qui vous correspond.",
        features: ["Bilan de compétences", "Stratégie de recherche", "Simulation d'entretiens", "Suivi LinkedIn"],
        highlight: true,
        badge: "Best-seller",
      },
      {
        name: "Pack QVT Entreprise",
        duration: "Sur mesure",
        price: "Sur devis",
        desc: "Programme bien-être au travail : ateliers, médiation, gestion des conflits.",
        features: ["Diagnostic QVT", "Ateliers thématiques", "Médiation interpersonnelle", "Plan d'actions managérial"],
      },
    ],
  },
  {
    id: "logiciels",
    icon: Calculator,
    title: "Excel & SAGE 100 i7",
    intro: "Vente de licences, installation, paramétrage et formation des utilisateurs.",
    packs: [
      {
        name: "Pack Excel Pro",
        duration: "2 semaines · 16h",
        price: "60 000 FCFA / participant",
        desc: "Maîtrise des formules avancées, TCD et tableaux de bord opérationnels.",
        features: ["Formules avancées & TCD", "Création de dashboards", "Initiation aux macros", "Cas pratiques métier"],
      },
      {
        name: "Pack SAGE 100 i7",
        duration: "1 mois",
        price: "À partir de 850 000 FCFA",
        desc: "Licence + installation + paramétrage + formation des utilisateurs.",
        features: ["Licence officielle", "Installation & paramétrage", "Formation des équipes", "1 mois de support inclus"],
        highlight: true,
        badge: "Clé en main",
      },
      {
        name: "Support & Maintenance",
        duration: "Annuel",
        price: "À partir de 200 000 FCFA / an",
        desc: "Hotline, intervention et mise à jour de votre environnement SAGE.",
        features: ["Hotline prioritaire", "Interventions illimitées", "Mises à jour incluses", "Sauvegardes mensuelles"],
      },
    ],
  },
];

function PackCard({ p }: { p: Pack }) {
  return (
    <Card
      className={`relative gradient-card border-border p-7 hover-lift flex flex-col h-full ${
        p.highlight ? "border-primary/60 shadow-elegant lg:scale-[1.03]" : ""
      }`}
    >
      {p.badge && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-cyan text-primary-foreground border-0 px-3 py-1 text-xs font-semibold shadow-elegant">
          <Star className="h-3 w-3 mr-1" /> {p.badge}
        </Badge>
      )}
      <h3 className="font-display text-xl font-bold mb-1">{p.name}</h3>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Clock className="h-3 w-3" /> {p.duration}
      </div>
      <p className="text-sm text-muted-foreground mb-5">{p.desc}</p>
      <div className="mb-5">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">à partir de</div>
        <div className="font-display text-2xl font-extrabold text-gradient-cyan">{p.price}</div>
      </div>
      <ul className="space-y-2 mb-6 flex-1">
        {p.features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button asChild className={p.highlight ? "gradient-cyan text-primary-foreground glow-cyan" : ""} variant={p.highlight ? "default" : "outline"}>
        <Link to="/devis">Choisir ce pack <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
    </Card>
  );
}

function Offres() {
  return (
    <>
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Nos offres</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Packs & formules par pôle</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Des formules structurées, transparentes et modulables. Tarifs indicatifs « à partir de » — devis personnalisé sous 48h.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {poles.map(p => (
              <a key={p.id} href={`#${p.id}`} className="glass rounded-full px-4 py-1.5 text-sm hover:text-primary transition flex items-center gap-2">
                <p.icon className="h-3.5 w-3.5" /> {p.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {poles.map(pole => (
        <section key={pole.id} id={pole.id} className="container mx-auto px-4 py-16 scroll-mt-24">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-xl gradient-cyan flex items-center justify-center">
              <pole.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-bold">{pole.title}</h2>
          </div>
          <p className="text-muted-foreground mb-10 max-w-2xl">{pole.intro}</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
            {pole.packs.map(p => <PackCard key={p.name} p={p} />)}
          </div>
        </section>
      ))}

      <Section>
        <Card className="gradient-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 bg-primary/30 blur-3xl rounded-full" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Besoin d'un pack sur mesure ?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Tous nos packs sont modulables. Décrivez-nous votre contexte, nous construisons une offre dédiée.
            </p>
            <Button asChild size="lg" className="gradient-cyan text-primary-foreground glow-cyan">
              <Link to="/devis">Construire mon offre sur mesure</Link>
            </Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
