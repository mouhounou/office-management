import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, Users, Wrench, Briefcase, Sparkles, Calculator,
  CheckCircle2, ArrowRight, Clock, Award, Target, Handshake, Cog,
  HardHat, Zap, ShieldCheck, FileText, UserCheck, Search, BookOpen,
} from "lucide-react";
import training from "@/assets/training.jpg";
import technical from "@/assets/technical.jpg";
import recruitment from "@/assets/recruitment.jpg";
import team from "@/assets/team.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos services — Office Management" },
      { name: "description", content: "Formation professionnelle, mise à disposition de personnel, prestations techniques, conseil RH et services additionnels." },
      { property: "og:title", content: "Services — Office Management" },
      { property: "og:description", content: "Six pôles d'expertise pour transformer votre capital humain." },
    ],
  }),
  component: Services,
});

function ServiceHero({ id, eyebrow, title, desc, image, reverse, bullets }: {
  id: string; eyebrow: string; title: string; desc: string; image: string; reverse?: boolean; bullets: string[];
}) {
  return (
    <section id={id} className="container mx-auto overflow-x-clip px-4 py-20 scroll-mt-24">
      <div className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">{eyebrow}</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">{title}</h2>
          <p className="text-muted-foreground mb-6">{desc}</p>
          <ul className="space-y-2.5 mb-8">
            {bullets.map(b => (
              <li key={b} className="flex items-start gap-2.5"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span className="text-sm">{b}</span></li>
            ))}
          </ul>
          <Button asChild className="gradient-cyan text-primary-foreground glow-cyan"><Link to="/devis">Demander un devis <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-primary/15 blur-3xl rounded-full" />
          <img src={image} alt={title} className="relative rounded-2xl shadow-elegant w-full" loading="lazy" width={1280} height={800} />
        </div>
      </div>
    </section>
  );
}

const formations = [
  { i: BookOpen, t: "Assistant comptable", d: "3 mois · certifiant" },
  { i: FileText, t: "Secrétariat bureautique", d: "2 mois · tous niveaux" },
  { i: Users, t: "Gestion des RH", d: "4 mois · intermédiaire" },
  { i: Cog, t: "Informatique bureautique", d: "2 mois" },
  { i: ShieldCheck, t: "QHSE", d: "3 mois · professionnel" },
  { i: Target, t: "Logistique", d: "3 mois" },
  { i: Award, t: "Management", d: "3 mois · cadres" },
  { i: Sparkles, t: "Entrepreneuriat", d: "2 mois" },
  { i: BookOpen, t: "Anglais professionnel", d: "4 mois" },
  { i: HardHat, t: "Formations techniques", d: "Sur mesure" },
];

const personnel = [
  { t: "Assistants administratifs", d: "Gestion d'agenda, courrier, support direction." },
  { t: "Comptables", d: "Tenue, déclarations, clôtures, reporting." },
  { t: "Chauffeurs", d: "Permis B/C, expérience entreprise et VIP." },
  { t: "Techniciens", d: "Maintenance, électricité, climatisation." },
  { t: "Agents commerciaux", d: "Prospection, relation client, vente." },
  { t: "Informaticiens", d: "Support, infra, développement." },
  { t: "Réceptionnistes", d: "Accueil, standard, gestion des visiteurs." },
  { t: "Agents de maintenance", d: "Bâtiment, équipements, propreté." },
];

const techniques = [
  { i: Zap, t: "Soudure", d: "TIG, MIG, MMA — structures et tuyauteries." },
  { i: Cog, t: "Maintenance industrielle", d: "Préventive, curative, prédictive sur sites industriels." },
  { i: Zap, t: "Électricité bâtiment", d: "Installation, mise aux normes, dépannage." },
  { i: Wrench, t: "Tuyauterie", d: "Conception, pose, raccordement et tests." },
  { i: Cog, t: "Climatisation", d: "Installation, maintenance et dépannage CVC." },
  { i: Sparkles, t: "Nettoyage industriel", d: "Sites tertiaires et industriels, vitrerie, post-chantier." },
  { i: ShieldCheck, t: "Sécurité", d: "Agents de sécurité formés et équipés." },
];

const additionnels = [
  { i: FileText, t: "Rédaction de CV professionnels" },
  { i: FileText, t: "Lettres de motivation" },
  { i: Handshake, t: "Coaching emploi & orientation" },
  { i: UserCheck, t: "Bilans de compétences" },
  { i: Users, t: "Gestion des conflits & médiation" },
  { i: Award, t: "Formations leadership" },
  { i: Sparkles, t: "Bien-être au travail & QVT" },
  { i: Target, t: "Démarche RSE" },
  { i: Briefcase, t: "Gestion de projets d'envergure" },
  { i: Cog, t: "Digitalisation des entreprises" },
  { i: Calculator, t: "Vente, installation & formation Excel / SAGE 100 i7" },
];

const conseil = [
  "Audit organisationnel & RH",
  "Externalisation de la paie",
  "Externalisation des fonctions RH",
  "Reporting & tableaux de bord RH",
  "Gestion documentaire & archivage",
  "Veille juridique & réglementaire",
  "Marque employeur",
  "Transformation digitale RH",
  "Développement organisationnel",
];

function Services() {
  return (
    <>
      {/* HERO */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Nos services</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Une offre globale et intégrée</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Six pôles d'expertise pour répondre aux besoins concrets des entreprises et des particuliers — de la formation au placement, en passant par les prestations techniques et le conseil RH.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              ["#formation", "Formation"],
              ["#personnel", "Mise à disposition"],
              ["#techniques", "Prestations techniques"],
              ["#conseil", "Conseil RH"],
              ["#additionnels", "Services additionnels"],
              ["#logiciels", "Excel & SAGE"],
            ].map(([h, t]) => (
              <a key={h} href={h} className="glass rounded-full px-4 py-1.5 text-sm hover:text-primary transition">{t}</a>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATION */}
      <ServiceHero
        id="formation"
        eyebrow="Pôle 01"
        title="Formation professionnelle"
        image={training}
        desc="Nous offrons une large variété de programmes de formation pour renforcer les compétences et développer les talents au sein des entreprises. Ateliers, séminaires, coaching, mentorat et certifications — en présentiel comme en ligne."
        bullets={[
          "Formations certifiantes reconnues",
          "Formateurs experts métier",
          "Modalités présentiel, distanciel et hybride",
          "Catalogue inter-entreprises et intra sur mesure",
          "Stages professionnels intégrés",
        ]}
      />
      <Section className="py-0 pb-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {formations.map((f, i) => (
            <Card key={i} className="gradient-card border-border p-5 hover-lift">
              <f.i className="h-7 w-7 text-primary mb-3" />
              <div className="font-display font-bold text-sm mb-1">{f.t}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{f.d}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* PERSONNEL */}
      <ServiceHero
        id="personnel"
        eyebrow="Pôle 02"
        title="Mise à disposition de personnel"
        image={recruitment}
        reverse
        desc="Nous mettons à disposition des entreprises un personnel qualifié et immédiatement opérationnel, pour vos missions temporaires comme permanentes. Notre vivier est rigoureusement évalué et formé."
        bullets={[
          "Profils pré-qualifiés et testés",
          "Délai de mise à disposition rapide",
          "Gestion administrative et paie incluse",
          "Suivi qualité tout au long de la mission",
          "Remplacement garanti en cas d'inadéquation",
        ]}
      />
      <Section className="py-0 pb-20">
        <SectionTitle eyebrow="Profils disponibles" title="Des compétences pour tous vos besoins" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {personnel.map((p, i) => (
            <Card key={i} className="gradient-card border-border p-5 hover-lift">
              <div className="font-display font-bold mb-2 text-primary">{p.t}</div>
              <p className="text-sm text-muted-foreground">{p.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* TECHNIQUES */}
      <section id="techniques" className="relative py-24 my-12 overflow-hidden scroll-mt-24">
        <img src={technical} alt="Prestations techniques" className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" width={1280} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative container mx-auto px-4 max-w-4xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Pôle 03</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">Prestations techniques</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Nos équipes interviennent sur site avec rigueur, équipement adapté et respect strict des règles de sécurité. Forfait, régie ou contrat de maintenance — nous nous adaptons à votre besoin.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {techniques.map((t, i) => (
              <Card key={i} className="gradient-card border-border p-5 hover-lift">
                <t.i className="h-7 w-7 text-primary mb-3" />
                <div className="font-display font-bold mb-1">{t.t}</div>
                <p className="text-xs text-muted-foreground">{t.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CONSEIL RH */}
      <ServiceHero
        id="conseil"
        eyebrow="Pôle 04"
        title="Conseil RH"
        image={team}
        desc="Nos services de consulting en ressources humaines sont conçus pour optimiser la gestion des équipes et des opérations. De l'audit à la transformation digitale, nous structurons votre fonction RH pour la performance."
        bullets={conseil.slice(0, 5)}
      />
      <Section className="py-0 pb-20">
        <div className="grid gap-3 md:grid-cols-3">
          {conseil.map((c) => (
            <div key={c} className="glass rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-medium">{c}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ADDITIONNELS */}
      <section id="additionnels" className="container mx-auto px-4 py-20 scroll-mt-24">
        <SectionTitle eyebrow="Pôle 05" title="Services additionnels" subtitle="Un accompagnement complet pour particuliers et entreprises, au-delà du recrutement et de la formation." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {additionnels.map((a, i) => (
            <Card key={i} className="gradient-card border-border p-6 hover-lift flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl gradient-cyan flex items-center justify-center shrink-0"><a.i className="h-5 w-5 text-primary-foreground" /></div>
              <div className="font-display font-semibold">{a.t}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* LOGICIELS */}
      <section id="logiciels" className="container mx-auto px-4 py-20 scroll-mt-24">
        <Card className="gradient-card border-primary/30 p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 h-72 w-72 bg-primary/25 blur-3xl rounded-full" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Pôle 06</div>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">Vente, installation & formation logiciels</h2>
              <p className="text-muted-foreground mb-6">
                Office Management est votre partenaire pour les logiciels métiers <strong className="text-foreground">Excel</strong> et <strong className="text-foreground">SAGE 100 i7</strong> — de la vente à la formation des utilisateurs.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Licences SAGE 100 i7 — Comptabilité & Gestion commerciale",
                  "Installation et paramétrage personnalisés",
                  "Formation des équipes (initiation à perfectionnement)",
                  "Excel — formules avancées, TCD, tableaux de bord, macros",
                  "Support technique et assistance continue",
                ].map(x => <li key={x} className="flex items-start gap-2.5"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span className="text-sm">{x}</span></li>)}
              </ul>
              <Button asChild className="gradient-cyan text-primary-foreground glow-cyan"><Link to="/contact">Demander une démo <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { t: "Excel", d: "Tableaux de bord, automatisation, formation tous niveaux." },
                { t: "SAGE 100 i7", d: "Comptabilité générale, analytique et auxiliaire." },
                { t: "Installation", d: "Paramétrage métier sur site ou à distance." },
                { t: "Support", d: "Hotline, intervention et maintenance applicative." },
              ].map((c, i) => (
                <Card key={i} className="glass border-border p-5 hover-lift">
                  <Calculator className="h-7 w-7 text-primary mb-3" />
                  <div className="font-display font-bold mb-1">{c.t}</div>
                  <p className="text-xs text-muted-foreground">{c.d}</p>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* PROCESSUS */}
      <Section>
        <SectionTitle eyebrow="Notre méthode" title="Comment nous travaillons" subtitle="Un processus éprouvé pour des résultats mesurables." />
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { n: "01", i: Search, t: "Diagnostic", d: "Analyse de votre besoin et de votre contexte." },
            { n: "02", i: Target, t: "Proposition", d: "Solution sur mesure, planning et devis détaillé." },
            { n: "03", i: Cog, t: "Exécution", d: "Mise en œuvre par nos experts, en lien étroit avec vos équipes." },
            { n: "04", i: Award, t: "Suivi", d: "Évaluation des résultats et amélioration continue." },
          ].map((s, i) => (
            <Card key={i} className="gradient-card border-border p-6 hover-lift relative">
              <div className="absolute top-4 right-4 font-display text-4xl font-extrabold text-primary/15">{s.n}</div>
              <s.i className="h-8 w-8 text-primary mb-3" />
              <div className="font-display font-bold mb-1">{s.t}</div>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <Card className="gradient-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 bg-primary/30 blur-3xl rounded-full" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Un projet en tête ?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">Parlez-nous de votre besoin — nous vous proposons une solution adaptée sous 48h.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="gradient-cyan text-primary-foreground glow-cyan"><Link to="/devis">Demander un devis</Link></Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40"><Link to="/formations">Voir les formations</Link></Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
