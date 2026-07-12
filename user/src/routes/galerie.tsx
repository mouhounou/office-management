import { createFileRoute } from "@tanstack/react-router";
import training from "@/assets/training.jpg";
import technical from "@/assets/technical.jpg";
import recruitment from "@/assets/recruitment.jpg";
import team from "@/assets/team.jpg";
import hero from "@/assets/hero.jpg";
import sage1 from "@/assets/formation-sage-1.jpg";
import sage2 from "@/assets/formation-sage-2.jpg";
import consultantRh from "@/assets/consultant-rh.jpg";
import entretien from "@/assets/entretien-recrutement.jpg";
import equipeCouloir from "@/assets/equipe-couloir.jpg";
import reunionConseil from "@/assets/reunion-conseil.jpg";
import moment1 from "@/assets/moment-9832.asset.json";
import moment2 from "@/assets/moment-202212160020.asset.json";
import moment3 from "@/assets/moment-202212160019.asset.json";
import moment4 from "@/assets/moment-0477.asset.json";
import moment5 from "@/assets/moment-0478.asset.json";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie — Office Management" },
      { name: "description", content: "Photos de nos formations, séminaires, équipes et prestations techniques." },
      { property: "og:title", content: "Galerie — Office Management" },
      { property: "og:description", content: "Découvrez Office Management en images." },
    ],
  }),
  component: Galerie,
});

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

const moments = [
  { src: moment1.url, t: "Coaching individuel & accompagnement" },
  { src: moment2.url, t: "Équipe de consultants" },
  { src: moment3.url, t: "Briefing & travail d'équipe" },
  { src: moment4.url, t: "Visite client & rendez-vous terrain" },
  { src: moment5.url, t: "Représentation & élégance corporate" },
];

function Galerie() {
  return (
    <>
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Galerie</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Office Management en images</h1>
          <p className="text-muted-foreground text-lg">Formations, séminaires, équipes, remises d'attestations et prestations sur le terrain.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Nos moments</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">L'équipe Office Management en action</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {moments.map((it, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl group aspect-[3/4]">
              <img src={it.src} alt={it.t} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="font-display text-sm font-bold">{it.t}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[220px] gap-4">
          {items.map((it, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl group ${it.c}`}>
              <img src={it.src} alt={it.t} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-display font-bold">{it.t}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
