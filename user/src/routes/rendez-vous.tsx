import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Briefcase, Compass, GraduationCap, Search, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/rendez-vous")({
  head: () => ({
    meta: [
      { title: "Prendre rendez-vous — Office Management" },
      { name: "description", content: "Réservez un rendez-vous avec notre équipe pour un accompagnement personnalisé : conseils RH, orientation, formation, recrutement." },
      { property: "og:title", content: "Rendez-vous — Office Management" },
      { property: "og:description", content: "Bénéficiez d'un accompagnement personnalisé." },
    ],
  }),
  component: RendezVous,
});

const motifs = [
  { i: Briefcase, t: "Conseils RH" },
  { i: Compass, t: "Orientation professionnelle" },
  { i: GraduationCap, t: "Informations sur les formations" },
  { i: Search, t: "Recrutement et emploi" },
];

function RendezVous() {
  const [motif, setMotif] = useState("Conseils RH");
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Rendez-vous</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Prenez rendez-vous</h1>
          <p className="text-muted-foreground text-lg">
            Bénéficiez d'un accompagnement personnalisé adapté à vos besoins professionnels.
          </p>
        </div>
      </section>

      <Section>
        <SectionTitle eyebrow="Motifs disponibles" title="Pourquoi nous rencontrer ?" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12 max-w-5xl mx-auto">
          {motifs.map((m) => (
            <Card key={m.t} className="gradient-card border-border p-5 text-center hover-lift">
              <m.i className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="font-display font-semibold text-sm">{m.t}</div>
            </Card>
          ))}
        </div>

        <Card className="gradient-card border-border p-8 max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Demande de rendez-vous envoyée ! Nous vous recontactons sous 48h.");
              (e.target as HTMLFormElement).reset();
            }}
            className="space-y-4"
          >
            <h2 className="font-display text-2xl font-bold mb-2 flex items-center gap-2">
              <CalendarClock className="h-6 w-6 text-primary" /> Réserver un rendez-vous
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Nom complet</Label><Input required placeholder="Jean Dupont" /></div>
              <div><Label>Téléphone</Label><Input required placeholder="06 ..." /></div>
            </div>
            <div><Label>Email</Label><Input type="email" required placeholder="email@exemple.com" /></div>
            <div>
              <Label>Motif</Label>
              <Select value={motif} onValueChange={setMotif}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {motifs.map((m) => <SelectItem key={m.t} value={m.t}>{m.t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Date souhaitée</Label><Input type="date" required /></div>
              <div><Label>Créneau</Label>
                <Select defaultValue="matin">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matin">Matin (8h - 12h)</SelectItem>
                    <SelectItem value="apres-midi">Après-midi (13h - 17h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Message (facultatif)</Label><Textarea rows={4} placeholder="Précisez votre besoin..." /></div>
            <Button type="submit" className="w-full gradient-cyan text-primary-foreground glow-cyan">Confirmer le rendez-vous</Button>
          </form>
        </Card>
      </Section>
    </>
  );
}
