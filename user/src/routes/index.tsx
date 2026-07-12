import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, SectionTitle } from "@/components/Section";
import { CeoSignature } from "@/components/CeoSignature";
import { WhyUs } from "@/components/WhyUs";
import {
  GraduationCap, Users, Wrench, Briefcase, Sparkles, ArrowRight, CheckCircle2,
  Award, Target, ShieldCheck, Zap, Heart, Quote, Calculator, FileText,
  FileSearch, ClipboardCheck, UserCheck, Rocket, Trophy, BadgeCheck, Lock,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import technical from "@/assets/technical.jpg";
import recruitment from "@/assets/recruitment.jpg";
import team from "@/assets/team.jpg";

const ROTATING_WORDS = ["Recrutement", "Formation", "Consulting RH", "Digitalisation", "Performance"];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % ROTATING_WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span key={i} className="inline-block text-gradient-cyan animate-fade-in-up">
      {ROTATING_WORDS[i]}
    </span>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Office Management — Partenaire RH & Formation à Pointe-Noire" },
      { name: "description", content: "Cabinet RH au Congo : formation professionnelle, mise à disposition de personnel qualifié, prestations techniques et conseil RH." },
      { property: "og:title", content: "Office Management — HR Consulting" },
      { property: "og:description", content: "Solutions RH innovantes pour entreprises et particuliers à Pointe-Noire." },
    ],
  }),
  component: Index,
});

function useCounter(target: number, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

function StatValue({ end, suffix }: { end: number; suffix: string }) {
  const { val, ref } = useCounter(end);
  return (
    <div ref={ref} className="font-display text-3xl md:text-4xl font-extrabold text-gradient-cyan leading-none">
      {val}{suffix}
    </div>
  );
}

function Counter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { val, ref } = useCounter(end);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl md:text-6xl font-extrabold text-gradient-cyan">{val}{suffix}</div>
      <div className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

const services = [
  { icon: GraduationCap, title: "Formation Professionnelle", desc: "Ateliers, séminaires, coaching, certifications pour développer vos talents." },
  { icon: Users, title: "Mise à disposition de Personnel", desc: "Personnel qualifié et opérationnel pour vos missions temporaires ou permanentes." },
  { icon: Wrench, title: "Prestations Techniques", desc: "Soudure, maintenance, électricité, climatisation, sécurité, nettoyage industriel." },
  { icon: Briefcase, title: "Conseil RH", desc: "Audit RH, externalisation paie, transformation digitale, développement organisationnel." },
  { icon: Sparkles, title: "Services Additionnels", desc: "CV, lettres de motivation, coaching emploi, orientation professionnelle." },
  { icon: Calculator, title: "Vente & Formation Logiciels", desc: "Excel et SAGE 100 i7 — installation, formation et support technique." },
];

const values = [
  { icon: ShieldCheck, t: "Professionnalisme" },
  { icon: Award, t: "Excellence" },
  { icon: Zap, t: "Innovation" },
  { icon: Heart, t: "Intégrité" },
  { icon: Target, t: "Réactivité" },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[calc(100svh-4.5rem)] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 -z-10">
          <img src={hero} alt="Équipe consulting Office Management" className="h-full w-full object-cover opacity-40" width={1920} height={1080} />
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="absolute inset-0 bg-grid" />
          {/* Aurora orbs */}
          <div className="absolute -top-32 -left-24 h-[32rem] w-[32rem] rounded-full bg-primary/25 blur-3xl animate-float" />
          <div className="absolute top-1/3 -right-24 h-[30rem] w-[30rem] rounded-full bg-cyan-glow/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-28 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center">
          {/* Left column */}
          <div className="animate-fade-in-up max-w-2xl">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Pointe-Noire · République du Congo
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.03] tracking-tight">
              Former les talents.<br />
              Transformer les <span className="text-gradient-cyan">entreprises.</span>
            </h1>

            <div className="mt-5 flex items-center gap-3 text-xl md:text-2xl font-bold">
              <span className="h-px w-8 bg-primary/60" />
              <span className="font-display"><RotatingWord /></span>
            </div>

            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Cabinet RH premium au Congo. Solutions innovantes en formation professionnelle, recrutement, conseil RH et digitalisation pour les entreprises ambitieuses.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan">
                <Link to="/devis">Demander un devis <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
                <Link to="/formations">Découvrir nos formations</Link>
              </Button>
            </div>

            {/* Trust chips */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {["Agréé par l'État", "+10 ans d'expertise", "Certifications reconnues"].map((trust) => (
                <span key={trust} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {trust}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — stats card */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div className="absolute -inset-6 bg-primary/15 blur-3xl rounded-full" />
            <div className="relative glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 text-xs uppercase tracking-widest text-primary">
                <Sparkles className="h-4 w-4" /> Notre impact en chiffres
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: GraduationCap, end: 500, suffix: "+", label: "Personnes formées" },
                  { icon: Briefcase, end: 120, suffix: "+", label: "Entreprises" },
                  { icon: UserCheck, end: 300, suffix: "+", label: "Placements" },
                  { icon: Award, end: 95, suffix: "%", label: "Satisfaction" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-card/40 p-4">
                    <div className="mb-3 h-9 w-9 rounded-xl gradient-cyan flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <StatValue end={s.end} suffix={s.suffix} />
                    <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground/70">
          <span className="text-[10px] uppercase tracking-widest">Défiler</span>
          <span className="h-9 w-5 rounded-full border border-border flex justify-center pt-1.5">
            <span className="h-1.5 w-1 rounded-full bg-primary animate-bounce" />
          </span>
        </div>
      </section>

      {/* SERVICES */}
      <Section>
        <SectionTitle eyebrow="Nos expertises" title="Des solutions sur mesure" subtitle="Cinq pôles d'expertise pour transformer votre capital humain en avantage compétitif durable." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Card key={i} className="group gradient-card border-border hover-lift p-7">
              <div className="h-12 w-12 rounded-xl gradient-cyan flex items-center justify-center mb-5 group-hover:glow-cyan transition">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="border-primary/40 hover:bg-primary/10">
            <Link to="/services">Voir tous les services <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </Section>

      {/* À PROPOS */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src={team} alt="Équipe Office Management" className="rounded-2xl shadow-elegant" width={1280} height={800} loading="lazy" />
            <div className="absolute -bottom-6 -right-6 glass rounded-xl p-5 hidden md:block">
              <div className="font-display text-3xl font-bold text-gradient-cyan">+10 ans</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">d'expertise RH</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Qui sommes-nous</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Transformer la gestion des compétences en levier de performance</h2>
            <p className="text-muted-foreground mb-4">
              Office Management est un cabinet de conseil en ressources humaines spécialisé dans le développement des compétences, l'accompagnement des entreprises et la valorisation du capital humain.
            </p>
            <p className="text-muted-foreground mb-8">
              Notre mission : offrir des solutions professionnelles fiables, modernes et adaptées aux besoins du marché.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {values.map((v, i) => (
                <div key={i} className="glass rounded-lg p-4 flex items-center gap-3">
                  <v.icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-semibold">{v.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CHIFFRES */}
      <Section>
        <div className="glass rounded-2xl p-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Counter end={500} suffix="+" label="Apprenants formés" />
          <Counter end={120} suffix="+" label="Entreprises partenaires" />
          <Counter end={300} suffix="+" label="Placements réussis" />
          <Counter end={95} suffix="%" label="Taux de satisfaction" />
        </div>
      </Section>

      {/* FORMATIONS VEDETTE */}
      <Section>
        <SectionTitle eyebrow="Formations en vedette" title="Développez vos compétences" subtitle="Programmes certifiants conçus pour répondre aux besoins concrets du marché." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Assistant Comptable", d: "3 mois", lvl: "Débutant à intermédiaire" },
            { t: "Secrétariat Bureautique", d: "2 mois", lvl: "Tous niveaux" },
            { t: "Gestion des Ressources Humaines", d: "4 mois", lvl: "Intermédiaire" },
            { t: "QHSE", d: "3 mois", lvl: "Professionnel" },
            { t: "Logiciel SAGE 100 i7", d: "1 mois", lvl: "Comptables" },
            { t: "Excel Avancé", d: "1 mois", lvl: "Tous niveaux" },
          ].map((f, i) => (
            <Card key={i} className="gradient-card border-border hover-lift p-6 group">
              <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest mb-3">
                <Award className="h-4 w-4" /> Certification incluse
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{f.t}</h3>
              <div className="flex gap-4 text-sm text-muted-foreground mb-5">
                <span>⏱ {f.d}</span><span>· {f.lvl}</span>
              </div>
              <Button asChild size="sm" className="gradient-cyan text-primary-foreground w-full">
                <Link to="/formations">S'inscrire <ArrowRight className="ml-2 h-3 w-3" /></Link>
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      {/* POUR ENTREPRISES */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Pour les entreprises</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Solutions RH complètes pour votre croissance</h2>
            <ul className="space-y-3">
              {["Recrutement & sélection", "Externalisation RH & paie", "Gestion du personnel", "Audit RH organisationnel", "Formation du personnel", "Évaluation des compétences", "Marque employeur", "Reporting & tableaux de bord RH"].map((x, i) => (
                <li key={i} className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span>{x}</span></li>
              ))}
            </ul>
            <Button asChild className="mt-8 gradient-cyan text-primary-foreground"><Link to="/contact">Discutons de votre besoin</Link></Button>
          </div>
          <img src={recruitment} alt="Solutions RH entreprises" className="rounded-2xl order-1 lg:order-2 shadow-elegant" width={1280} height={800} loading="lazy" />
        </div>
      </Section>

      {/* POURQUOI NOUS */}
      <WhyUs />

      {/* PRESTATIONS TECHNIQUES */}
      <section className="relative py-20 my-12 overflow-hidden">
        <img src={technical} alt="Prestations techniques" className="absolute inset-0 h-full w-full object-cover opacity-25" width={1280} height={800} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Prestations techniques</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Une expertise terrain au service de l'industrie</h2>
            <p className="text-muted-foreground mb-8">Soudure, maintenance industrielle, électricité bâtiment, tuyauterie, climatisation, nettoyage industriel et sécurité — nos équipes interviennent sur site avec rigueur et savoir-faire.</p>
            <div className="flex flex-wrap gap-2">
              {["Soudure", "Maintenance", "Électricité", "Tuyauterie", "Climatisation", "Nettoyage", "Sécurité"].map(t => (
                <span key={t} className="glass rounded-full px-4 py-1.5 text-sm">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <Section>
        <SectionTitle eyebrow="Témoignages" title="Ils nous font confiance" />
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { q: "Grâce à Office Management, notre entreprise a trouvé un personnel qualifié rapidement et durablement.", a: "Directeur RH — Industrie pétrolière" },
            { q: "Formation très professionnelle avec des formateurs expérimentés. Une expérience marquante.", a: "Ancien apprenant — Promotion 2025" },
          ].map((t, i) => (
            <Card key={i} className="gradient-card border-border p-8 relative">
              <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/20" />
              <p className="text-lg italic mb-6">"{t.q}"</p>
              <div className="text-sm font-semibold text-primary">— {t.a}</div>
            </Card>
          ))}
        </div>
      </Section>


      {/* NOS PROCESSUS — Recrutement */}
      <Section>
        <SectionTitle eyebrow="Notre méthode" title="Un processus de recrutement maîtrisé" subtitle="Cinq étapes rigoureuses pour identifier et intégrer les meilleurs talents." />
        <div className="grid gap-4 md:grid-cols-5">
          {[
            { icon: FileSearch, t: "Analyse", d: "Compréhension fine du besoin" },
            { icon: Users, t: "Sélection", d: "Sourcing & présélection" },
            { icon: ClipboardCheck, t: "Tests", d: "Évaluation technique & RH" },
            { icon: UserCheck, t: "Entretien", d: "Validation des compétences" },
            { icon: Rocket, t: "Intégration", d: "Onboarding & suivi" },
          ].map((s, i) => (
            <div key={i} className="relative group">
              <Card className="gradient-card border-border p-6 text-center hover-lift h-full">
                <div className="mx-auto h-14 w-14 rounded-2xl gradient-cyan flex items-center justify-center mb-4 group-hover:glow-cyan transition">
                  <s.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="text-xs uppercase tracking-widest text-primary mb-1">Étape {i + 1}</div>
                <div className="font-display font-bold mb-1">{s.t}</div>
                <div className="text-xs text-muted-foreground">{s.d}</div>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* PROGRAMMES CERTIFIANTS — Badges */}
      <Section>
        <SectionTitle eyebrow="Programmes certifiants" title="Des parcours qui ouvrent des portes" />
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: BadgeCheck, t: "Certificat professionnel" },
            { icon: Zap, t: "Formation intensive" },
            { icon: Wrench, t: "Formation pratique" },
            { icon: Briefcase, t: "Stage inclus" },
            { icon: Trophy, t: "Insertion professionnelle" },
            { icon: Lock, t: "Certificat numérique vérifiable" },
          ].map((b, i) => (
            <div key={i} className="glass rounded-full pl-2 pr-5 py-2 flex items-center gap-3 hover:border-primary/40 transition">
              <span className="h-9 w-9 rounded-full gradient-cyan flex items-center justify-center">
                <b.icon className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="text-sm font-semibold">{b.t}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* NOS TECHNOLOGIES */}
      <Section>
        <SectionTitle eyebrow="Nos technologies" title="Des outils de référence internationale" subtitle="Nous formons et déployons sur les standards utilisés par les leaders du marché." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {["Excel", "SAGE 100 i7", "Power BI", "Google Workspace", "Microsoft 365"].map((tech, i) => (
            <div key={i} className="glass rounded-xl p-6 flex flex-col items-center justify-center text-center hover-lift group">
              <div className="h-12 w-12 rounded-xl gradient-cyan flex items-center justify-center mb-3 group-hover:glow-cyan transition">
                <span className="font-display font-extrabold text-primary-foreground text-lg">{tech.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="font-display font-bold text-sm">{tech}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* MOT DU PDG */}
      <Section>
        <Card className="gradient-card border-primary/30 p-8 md:p-14 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 h-72 w-72 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative grid lg:grid-cols-[1fr_1.4fr] gap-10 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
              <img
                src={team}
                alt="Hassan Monlay I AKIANA — PDG Office Management"
                className="relative rounded-2xl shadow-elegant w-full object-cover aspect-[4/5]"
                width={640} height={800} loading="lazy"
              />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Le mot du PDG</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 leading-tight">
                « Faire du capital humain le moteur d'une croissance durable au Congo. »
              </h2>
              <p className="text-muted-foreground mb-4">
                Chez Office Management, nous portons une conviction forte : la performance des organisations africaines passe par l'investissement dans les compétences, la rigueur et l'innovation.
              </p>
              <p className="text-muted-foreground mb-8">
                Notre engagement est de fournir à chaque entreprise, chaque talent et chaque institution les outils, les méthodes et l'accompagnement nécessaires pour réussir dans un monde du travail en pleine transformation.
              </p>
              <div className="border-t border-border pt-6">
                <CeoSignature />
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* CTA FINAL */}
      <Section>
        <Card className="gradient-card border-primary/30 p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 bg-primary/30 blur-3xl rounded-full" />
          <div className="relative">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Prêt à libérer le potentiel de vos équipes ?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">Demandez votre devis personnalisé ou téléchargez notre brochure pour découvrir l'ensemble de nos offres.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="gradient-cyan text-primary-foreground glow-cyan"><Link to="/devis">Demander un devis</Link></Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40"><a href="#" download>Télécharger la brochure</a></Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
