import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Banknote,
  Briefcase,
  Building2,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Clock,
  Factory,
  FileText,
  Fuel,
  GraduationCap,
  Hammer,
  Headset,
  HeartPulse,
  Hotel,
  Landmark,
  MonitorSmartphone,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  UserCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { CeoSignature } from "@/components/CeoSignature";
import { fetchPosts, type Post } from "@/lib/content";
import { formatFrenchDate, postImage } from "@/lib/content-images";
import { cn } from "@/lib/utils";
import hero from "@/assets/hero.jpg";
import training from "@/assets/training.jpg";
import technical from "@/assets/technical.jpg";
import recruitment from "@/assets/recruitment.jpg";
import team from "@/assets/team.jpg";
import consultant from "@/assets/consultant-rh.jpg";
import reunion from "@/assets/reunion-conseil.jpg";
import entretien from "@/assets/entretien-recrutement.jpg";
import equipe from "@/assets/equipe-couloir.jpg";
import sage from "@/assets/formation-sage-1.jpg";
import ceo from "@/assets/ceo-akiana.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Office Management — Partenaire RH & Formation à Pointe-Noire" },
      {
        name: "description",
        content:
          "Cabinet RH au Congo : formation professionnelle, mise à disposition de personnel qualifié, prestations techniques et conseil RH.",
      },
      { property: "og:title", content: "Office Management — HR Consulting" },
      {
        property: "og:description",
        content: "Solutions RH innovantes pour entreprises et particuliers à Pointe-Noire.",
      },
    ],
  }),
  // Les trois derniers articles ; la page reste complète si l'API ne répond pas.
  loader: async () => ({
    posts: await fetchPosts()
      .then((p) => p.slice(0, 3))
      .catch(() => [] as Post[]),
  }),
  component: Accueil,
});

const SERVICES: {
  icon: LucideIcon;
  title: string;
  desc: string;
  image: string;
  to: string;
  hash?: string;
}[] = [
  {
    icon: GraduationCap,
    title: "Formation professionnelle",
    desc: "Ateliers, séminaires, coaching et certifications pour développer vos talents.",
    image: training,
    to: "/formations",
  },
  {
    icon: Users,
    title: "Mise à disposition de personnel",
    desc: "Du personnel qualifié et opérationnel pour vos missions temporaires ou durables.",
    image: equipe,
    to: "/recrutement",
  },
  {
    icon: Wrench,
    title: "Prestations techniques",
    desc: "Soudure, maintenance, électricité, climatisation, sécurité et nettoyage industriel.",
    image: technical,
    to: "/services",
    hash: "techniques",
  },
  {
    icon: Briefcase,
    title: "Conseil RH",
    desc: "Audit RH, externalisation de la paie, transformation digitale et organisation.",
    image: reunion,
    to: "/services",
    hash: "conseil",
  },
  {
    icon: Sparkles,
    title: "Services aux candidats",
    desc: "CV, lettres de motivation, coaching emploi et orientation professionnelle.",
    image: entretien,
    to: "/services",
  },
  {
    icon: Calculator,
    title: "Excel & SAGE 100 i7",
    desc: "Vente, installation, formation et support des logiciels de gestion.",
    image: sage,
    to: "/formations",
  },
];

const HERO_FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: GraduationCap, label: "Formations certifiantes" },
  { icon: ShieldCheck, label: "Recrutement rigoureux" },
  { icon: Clock, label: "Réponse sous 48 h" },
  { icon: Headset, label: "Conseiller dédié" },
];

const SECTORS: { icon: LucideIcon; label: string }[] = [
  { icon: Fuel, label: "Pétrole & gaz" },
  { icon: Hammer, label: "BTP" },
  { icon: Truck, label: "Logistique & transit" },
  { icon: Banknote, label: "Banque & assurance" },
  { icon: Factory, label: "Industrie" },
  { icon: HeartPulse, label: "Santé" },
  { icon: ShoppingBag, label: "Commerce" },
  { icon: MonitorSmartphone, label: "Télécoms & IT" },
  { icon: Hotel, label: "Hôtellerie" },
  { icon: Landmark, label: "Administration" },
];

const TESTIMONIALS = [
  {
    quote:
      "Grâce à Office Management, notre entreprise a trouvé un personnel qualifié rapidement et durablement. Une équipe réactive et professionnelle.",
    author: "Directeur des ressources humaines",
    company: "Industrie pétrolière, Pointe-Noire",
  },
  {
    quote:
      "Formation très professionnelle avec des formateurs expérimentés. J'ai trouvé un emploi trois mois après ma certification.",
    author: "Ancien apprenant",
    company: "Promotion 2025 — Assistant comptable",
  },
  {
    quote:
      "L'audit RH nous a permis de remettre à plat nos contrats et notre paie. Un accompagnement clair, du diagnostic jusqu'à la mise en œuvre.",
    author: "Gérante de PME",
    company: "Commerce & distribution",
  },
];

const STEPS = ["Reçue", "En étude", "En cours", "Terminée"];

function Accueil() {
  const { posts } = Route.useLoaderData();

  return (
    <>
      {/* HÉROS ---------------------------------------------------------------- */}
      <section className="theme-dark relative isolate overflow-hidden bg-navy-deep">
        <img
          src={hero}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy-deep to-transparent" />
        {/* Diagonale cyan, rappel de la maquette */}
        <div className="pointer-events-none absolute -right-24 -bottom-10 -z-10 hidden h-64 w-[38rem] -rotate-[28deg] gradient-cyan opacity-90 md:block" />

        <div className="container mx-auto px-4 pt-20 pb-10 md:pt-28">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="eyebrow mb-5">Cabinet RH à Pointe-Noire</div>
            <h1 className="font-display text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
              Former les talents.
              <span className="block text-gradient-cyan">Faire grandir les entreprises.</span>
            </h1>
            <p className="mt-5 text-xl font-semibold">Formation. Recrutement. Conseil.</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Office Management accompagne les entreprises et les particuliers au Congo : formations
              certifiantes, personnel qualifié, prestations techniques et conseil RH, avec un suivi
              clair à chaque étape.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/devis"
                className="inline-flex h-12 items-center gap-2 rounded-full gradient-cyan px-6 font-semibold text-primary-foreground glow-cyan transition hover:opacity-90"
              >
                Demander un devis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pre-inscription"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-6 font-semibold text-white transition hover:bg-white/10"
              >
                <GraduationCap className="h-4 w-4" /> Pré-inscription formation
              </Link>
            </div>
          </div>

          <div className="mt-16 grid max-w-3xl grid-cols-2 gap-6 border-t border-white/15 pt-8 md:grid-cols-4">
            {HERO_FEATURES.map((feature) => (
              <div key={feature.label} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5">
                  <feature.icon className="h-5 w-5 text-cyan-glow" />
                </span>
                <span className="text-sm leading-tight font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES ------------------------------------------------------------- */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-2">
          <div>
            <div className="eyebrow mb-4">Nos services</div>
            <h2 className="font-display text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
              Des solutions RH complètes pour{" "}
              <span className="text-gradient-cyan">votre entreprise</span>
            </h2>
          </div>
          <p className="text-base text-muted-foreground lg:text-lg">
            De la formation à la mise à disposition de personnel, nous couvrons chaque besoin en
            ressources humaines, avec des équipes présentes sur le terrain à Pointe-Noire.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              to={service.to}
              hash={service.hash}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={640}
                  height={384}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 to-transparent" />
              </div>
              <div className="relative px-6 pt-10 pb-6">
                <span className="absolute -top-7 left-6 flex h-14 w-14 items-center justify-center rounded-full gradient-cyan text-white ring-4 ring-card">
                  <service.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-bold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  En savoir plus{" "}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POURQUOI NOUS ---------------------------------------------------------- */}
      <section className="theme-dark relative overflow-hidden bg-navy-deep">
        <div className="container mx-auto grid items-stretch gap-10 px-4 lg:grid-cols-2">
          <div className="py-16 md:py-20">
            <div className="eyebrow mb-4">Pourquoi Office Management</div>
            <h2 className="font-display text-3xl leading-tight font-bold md:text-4xl">
              Le partenaire RH de confiance des entreprises congolaises
            </h2>
            <p className="mt-5 max-w-lg text-muted-foreground">
              Méthode éprouvée, formateurs expérimentés et suivi personnalisé : nous combinons
              expertise, réactivité et connaissance du terrain pour des résultats durables.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "500+", label: "Apprenants formés", icon: GraduationCap },
                { value: "120+", label: "Entreprises partenaires", icon: Building2 },
                { value: "95 %", label: "Taux de satisfaction", icon: Star },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
                >
                  <stat.icon className="h-7 w-7 shrink-0 text-cyan-glow" />
                  <div>
                    <div className="font-display text-2xl font-extrabold md:text-3xl">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/a-propos"
              className="mt-10 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-navy-deep transition hover:bg-white/90"
            >
              Qui sommes-nous <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative hidden min-h-[26rem] lg:block">
            <div className="absolute inset-y-0 right-[-50vw] left-0 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]">
              <img
                src={consultant}
                alt="Consultante RH Office Management"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-y-0 left-[9%] w-3 -skew-x-[12deg] gradient-cyan" />
          </div>
        </div>
      </section>

      {/* SUIVI + RÉSEAU ---------------------------------------------------------- */}
      <section className="container mx-auto grid gap-6 px-4 py-20 md:py-24 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card md:p-10">
          <div className="eyebrow mb-4">Votre espace client</div>
          <h2 className="font-display text-3xl font-bold">Suivez vos demandes en temps réel</h2>
          <p className="mt-3 text-muted-foreground">
            Devis, pré-inscription, demande de recrutement : créez votre espace pour suivre chaque
            dossier, de la réception à la réalisation.
          </p>
          <ol className="relative mt-10 grid grid-cols-4">
            <div className="absolute top-4 right-[12.5%] left-[12.5%] h-0.5 bg-border" />
            <div className="absolute top-4 left-[12.5%] h-0.5 w-1/2 gradient-cyan" />
            {STEPS.map((step, index) => (
              <li key={step} className="relative flex flex-col items-center gap-2 text-center">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold",
                    index < 2
                      ? "border-transparent gradient-cyan text-white"
                      : index === 2
                        ? "border-primary bg-card text-primary"
                        : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span className="text-xs font-medium">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/inscription"
              className="inline-flex h-11 items-center gap-2 rounded-full gradient-cyan px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Créer mon espace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/connexion"
              search={{}}
              className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold transition hover:border-primary/40 hover:text-primary"
            >
              J'ai déjà un compte
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="relative h-56">
            <img
              src={recruitment}
              alt="Entretien de recrutement"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/50 to-transparent" />
          </div>
          <div className="p-8 md:p-10">
            <div className="eyebrow mb-4">Notre réseau</div>
            <h2 className="font-display text-3xl font-bold">
              Relier les talents et les <span className="text-gradient-cyan">entreprises</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Un vivier de candidats qualifiés et des partenaires dans tous les secteurs : nous
              trouvons la bonne personne, au bon moment.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "300+", label: "Placements réussis", icon: UserCheck },
                { value: "44", label: "Formations au catalogue", icon: FileText },
                { value: "10", label: "Secteurs couverts", icon: Building2 },
              ].map((stat) => (
                <div key={stat.label}>
                  <stat.icon className="mb-2 h-5 w-5 text-primary" />
                  <div className="font-display text-2xl font-extrabold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* SECTEURS ---------------------------------------------------------------- */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="eyebrow mb-4">Secteurs</div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Des solutions RH pour chaque <span className="text-gradient-cyan">secteur</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Nous accompagnons les entreprises de tous les secteurs, avec des profils et des
            formations adaptés.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
          {SECTORS.map((sector, index) => (
            <Link
              key={sector.label}
              to="/services"
              hash="secteurs"
              className="group flex flex-col items-center gap-3 text-center"
            >
              <span
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full transition group-hover:-translate-y-1 group-hover:shadow-card",
                  ["gradient-cyan text-white", "bg-navy text-white", "bg-accent text-primary"][
                    index % 3
                  ],
                )}
              >
                <sector.icon className="h-7 w-7" />
              </span>
              <span className="text-sm font-medium">{sector.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* MOT DU PDG -------------------------------------------------------------- */}
      <section className="container mx-auto px-4 pb-20 md:pb-24">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:grid-cols-[0.9fr_1.4fr]">
          <img
            src={ceo}
            alt="Hassan Monlay I AKIANA — PDG d'Office Management"
            className="h-full max-h-[32rem] w-full object-cover object-top"
            loading="lazy"
          />
          <div className="p-8 md:p-12 lg:pl-0">
            <div className="eyebrow mb-4">Le mot du PDG</div>
            <h2 className="font-display text-2xl leading-snug font-bold md:text-3xl">
              « Faire du capital humain le moteur d'une croissance durable au Congo. »
            </h2>
            <p className="mt-5 text-muted-foreground">
              La performance des organisations africaines passe par l'investissement dans les
              compétences, la rigueur et l'innovation. Notre engagement : donner à chaque entreprise
              et à chaque talent les outils et l'accompagnement pour réussir.
            </p>
            <div className="mt-8 border-t border-border pt-6">
              <CeoSignature />
            </div>
          </div>
        </div>
      </section>

      {/* APPEL À L'ACTION ---------------------------------------------------------- */}
      <section className="theme-dark relative overflow-hidden bg-navy-deep">
        <div className="absolute inset-y-0 left-0 hidden w-1/2 lg:block">
          <img src={team} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-navy-deep/30 to-navy-deep" />
        </div>
        <div className="pointer-events-none absolute top-0 left-[44%] hidden h-full w-6 -skew-x-[14deg] gradient-cyan lg:block" />
        <div className="relative container mx-auto grid px-4 lg:grid-cols-2">
          <div className="lg:col-start-2 lg:pl-16">
            <div className="py-16 md:py-20">
              <div className="eyebrow mb-4">Passons à l'action</div>
              <h2 className="font-display text-3xl leading-tight font-bold md:text-4xl">
                Votre prochain recrutement ou formation commence ici
              </h2>
              <p className="mt-4 text-muted-foreground">
                Décrivez votre besoin : un conseiller vous répond sous 48 heures ouvrées.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/devis"
                  className="inline-flex h-12 items-center gap-2 rounded-full gradient-cyan px-6 font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Demander un devis <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-6 font-semibold text-white transition hover:bg-white/10"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG ------------------------------------------------------------------- */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow mb-4">Actualités</div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Conseils, tendances et actualités RH
            </h2>
            <p className="mt-2 text-muted-foreground">
              Les derniers articles de nos experts sur l'emploi, la formation et le management.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold transition hover:border-primary/40 hover:text-primary"
          >
            Tous les articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Les articles arrivent bientôt.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={postImage(post.imageUrl, post.category)}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 rounded-full gradient-cyan px-3 py-1 text-xs font-semibold text-white">
                    {formatFrenchDate(post.publishedAt ?? post.createdAt)}
                  </span>
                </div>
                <div className="p-6">
                  <div className="text-xs font-semibold tracking-wide text-primary uppercase">
                    {post.category}
                  </div>
                  <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold">{post.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Lire la suite{" "}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/** Témoignages en carrousel, sur bande navy comme la maquette. */
function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = TESTIMONIALS[index];
  const go = (delta: number) =>
    setIndex((i) => (i + delta + TESTIMONIALS.length) % TESTIMONIALS.length);

  // Défilement automatique, suspendu quand l'onglet est caché.
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="theme-dark relative overflow-hidden bg-navy-deep">
      <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:py-20 lg:grid-cols-[1fr_1.2fr]">
        <div className="relative">
          <div className="absolute -top-4 -left-4 h-24 w-24 rounded-2xl gradient-cyan" />
          <img
            src={team}
            alt="L'équipe Office Management"
            className="relative aspect-[4/3] w-full rounded-2xl object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <div className="eyebrow mb-4">Témoignages</div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ce que disent nos clients</h2>
          <figure className="mt-8" aria-live="polite">
            <Quote className="mb-4 h-10 w-10 text-cyan-glow" />
            <blockquote
              key={index}
              className="animate-fade-in-up text-lg leading-relaxed md:text-xl"
            >
              « {current.quote} »
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 font-display font-bold">
                  {current.author.charAt(0)}
                </span>
                <div>
                  <div className="font-semibold">{current.author}</div>
                  <div className="text-sm text-muted-foreground">{current.company}</div>
                  <div className="mt-1 flex gap-0.5" aria-label="5 étoiles sur 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-cyan-glow text-cyan-glow" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Témoignage précédent"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Témoignage suivant"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </figcaption>
          </figure>
          <div className="mt-6 flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Témoignage ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-8 bg-cyan-glow" : "w-3 bg-white/25",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
