import { Section, SectionTitle } from "@/components/Section";
import consultantRh from "@/assets/consultant-rh.jpg";
import entretien from "@/assets/entretien-recrutement.jpg";
import equipeCouloir from "@/assets/equipe-couloir.jpg";
import sage1 from "@/assets/formation-sage-1.jpg";
import sage2 from "@/assets/formation-sage-2.jpg";
import hero from "@/assets/hero.jpg";
import moment4 from "@/assets/moment-0477.asset.json";
import moment5 from "@/assets/moment-0478.asset.json";
import moment3 from "@/assets/moment-202212160019.asset.json";
import moment2 from "@/assets/moment-202212160020.asset.json";
import moment1 from "@/assets/moment-9832.asset.json";
import recruitment from "@/assets/recruitment.jpg";
import reunionConseil from "@/assets/reunion-conseil.jpg";
import team from "@/assets/team.jpg";
import technical from "@/assets/technical.jpg";
import training from "@/assets/training.jpg";

/** Galerie photos (anciennement /galerie). */
const moments = [
  { src: moment1.url, t: "Coaching individuel & accompagnement" },
  { src: moment2.url, t: "Équipe de consultants" },
  { src: moment3.url, t: "Briefing & travail d'équipe" },
  { src: moment4.url, t: "Visite client & rendez-vous terrain" },
  { src: moment5.url, t: "Représentation & élégance corporate" },
];

const items = [
  { src: sage2, t: "Formation SAGE 100 i7", c: "row-span-2" },
  { src: equipeCouloir, t: "Équipes & collaborations", c: "" },
  { src: reunionConseil, t: "Réunions stratégiques", c: "" },
  { src: entretien, t: "Entretiens de recrutement", c: "" },
  { src: sage1, t: "Accompagnement logiciel", c: "row-span-2" },
  { src: consultantRh, t: "Conseil RH personnalisé", c: "" },
  { src: training, t: "Sessions de formation", c: "" },
  { src: technical, t: "Prestations techniques", c: "" },
  { src: recruitment, t: "Onboarding & intégration", c: "" },
  { src: team, t: "Séminaires d'entreprise", c: "" },
  { src: hero, t: "Vie d'entreprise", c: "" },
];

function Photo({ src, t, className = "" }: { src: string; t: string; className?: string }) {
  return (
    <figure className={`group relative overflow-hidden rounded-2xl shadow-card ${className}`}>
      <img
        src={src}
        alt={t}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-transparent" />
      <figcaption className="absolute bottom-3 left-3 right-3 font-display text-sm font-bold text-white md:bottom-4 md:left-4">
        {t}
      </figcaption>
    </figure>
  );
}

export function Galerie() {
  return (
    <Section id="galerie" className="scroll-mt-24">
      <SectionTitle
        eyebrow="Galerie"
        title="Office Management en images"
        subtitle="Formations, séminaires, équipes et prestations sur le terrain."
      />
      <h3 className="mb-5 font-display text-xl font-bold">L'équipe en action</h3>
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {moments.map((it) => (
          <Photo key={it.t} src={it.src} t={it.t} className="aspect-[3/4]" />
        ))}
      </div>
      <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <Photo key={it.t} src={it.src} t={it.t} className={it.c} />
        ))}
      </div>
    </Section>
  );
}
