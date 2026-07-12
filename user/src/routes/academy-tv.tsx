import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Play, Video } from "lucide-react";

export const Route = createFileRoute("/academy-tv")({
  head: () => ({
    meta: [
      { title: "Office Management Academy TV" },
      { name: "description", content: "Plateforme vidéo : cours courts, astuces Excel, Sage 100 i7, conseils RH et emploi." },
    ],
  }),
  component: Page,
});

const videos = [
  { t: "5 astuces Excel pour gagner du temps", cat: "Excel", dur: "8 min" },
  { t: "Sage 100 i7 : créer un dossier comptable", cat: "Sage", dur: "12 min" },
  { t: "Réussir son entretien d'embauche", cat: "Emploi", dur: "10 min" },
  { t: "Les bases de la paie au Congo", cat: "RH", dur: "15 min" },
  { t: "Rédiger un CV qui se démarque", cat: "Emploi", dur: "7 min" },
  { t: "Tableaux croisés dynamiques", cat: "Excel", dur: "11 min" },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Apprendre en vidéo</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Office Management Academy TV</h1>
          <p className="text-muted-foreground text-lg">Des cours courts, gratuits, pour monter en compétences à votre rythme.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map(v => (
            <Card key={v.t} className="gradient-card border-border p-0 overflow-hidden hover-lift group cursor-pointer">
              <div className="aspect-video bg-[oklch(0.2_0.05_255)] flex items-center justify-center relative">
                <Video className="h-12 w-12 text-primary/30" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                  <Play className="h-12 w-12 text-white" fill="white" />
                </div>
              </div>
              <div className="p-5">
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">{v.cat}</span>
                <h3 className="font-display text-base font-bold mt-2 mb-1">{v.t}</h3>
                <div className="text-xs text-muted-foreground">{v.dur}</div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
