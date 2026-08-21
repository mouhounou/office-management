import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { errorMessage } from "@/lib/api";
import { submitApplication, submitBusinessRequest } from "@/lib/submissions";
import { Briefcase, Users, UserCheck, Search, Send, ArrowRight, Clock, ShieldCheck, Network, Target } from "lucide-react";
import entretien from "@/assets/entretien-recrutement.jpg";

export const Route = createFileRoute("/recrutement")({
  head: () => ({
    meta: [
      { title: "Recrutement & Mise à disposition — Office Management" },
      { name: "description", content: "Espace candidat et entreprise : recrutement, sélection, placement et onboarding de talents qualifiés." },
      { property: "og:title", content: "Recrutement — Office Management" },
      { property: "og:description", content: "Trouvez les meilleurs talents ou postulez à nos offres." },
    ],
  }),
  component: Recrutement,
});

const SERVICES = [
  { i: Search, t: "Recrutement & sélection", d: "Sourcing ciblé et présélection rigoureuse." },
  { i: Briefcase, t: "Placement temp. & permanent", d: "Missions courtes ou postes durables." },
  { i: UserCheck, t: "Évaluation des compétences", d: "Tests techniques et entretiens structurés." },
  { i: Users, t: "Intégration & Onboarding", d: "Accompagnement jusqu'à la prise de poste." },
];

const ASIDE = {
  candidat: [
    { icon: Target, t: "Des offres qui vous correspondent", d: "Nous ciblons les postes adaptés à votre profil." },
    { icon: Network, t: "120+ entreprises partenaires", d: "Un réseau actif pour accélérer votre placement." },
    { icon: Clock, t: "Réponse sous 48h", d: "Un suivi réactif à chaque étape." },
  ],
  entreprise: [
    { icon: Target, t: "Les bons profils, plus vite", d: "Un vivier qualifié et présélectionné." },
    { icon: ShieldCheck, t: "Sélection rigoureuse", d: "Tests, références et évaluation des compétences." },
    { icon: Clock, t: "Mission lancée sous 48h", d: "Réactivité et disponibilité de nos équipes." },
  ],
};

function Recrutement() {
  const [tab, setTab] = useState<"candidat" | "entreprise">("candidat");
  const [sending, setSending] = useState(false);

  /**
   * Deux destinations selon l'onglet : un candidat dépose une candidature
   * spontanée, une entreprise ouvre une demande de recrutement dans le
   * Business Center.
   */
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const phoneOrCompany = String(fd.get("phoneOrCompany") ?? "");
    const position = String(fd.get("position") ?? "");
    const details = String(fd.get("details") ?? "");

    setSending(true);
    try {
      if (tab === "candidat") {
        await submitApplication({
          fullName: name,
          email,
          phone: phoneOrCompany,
          coverLetter: `Poste recherché : ${position}

${details}`,
        });
      } else {
        await submitBusinessRequest({
          companyName: phoneOrCompany,
          contactName: name,
          contactEmail: email,
          contactPhone: String(fd.get("phone") ?? ""),
          type: "recrutement",
          title: `Recrutement — ${position}`,
          description: details,
        });
      }
      toast.success("Votre demande a bien été envoyée ! Nous vous recontactons sous 48h.");
      form.reset();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSending(false);
    }
  };
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-24 md:py-28">
        <img src={entretien} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" width={1280} height={800} />
        <div className="absolute inset-0 -z-10 gradient-hero opacity-95" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <Briefcase className="h-3.5 w-3.5" /> Recrutement & placement
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Le bon talent. <span className="text-gradient-cyan">Le bon poste.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Que vous soyez candidat ou employeur, nous facilitons la rencontre de l'opportunité et du talent.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <Section className="pt-14!">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <Card key={s.t} className="group gradient-card border-border p-6 hover-lift">
              <div className="h-12 w-12 rounded-xl gradient-cyan flex items-center justify-center mb-4 group-hover:glow-cyan transition">
                <s.i className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="font-display font-bold mb-1">{s.t}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FORMULAIRE */}
      <Section className="pt-0!">
        {/* Toggle segmenté */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 rounded-full glass p-1">
            {(["candidat", "entreprise"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  tab === k ? "gradient-cyan text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {k === "candidat" ? "Espace candidat" : "Espace entreprise"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.8fr_1.6fr] gap-8 items-start">
          {/* Aside dynamique */}
          <aside className="lg:sticky lg:top-24">
            <Card className="gradient-card border-border p-6">
              <h2 className="font-display text-lg font-bold mb-4">
                {tab === "candidat" ? "Pourquoi postuler avec nous" : "Pourquoi nous confier vos recrutements"}
              </h2>
              <ul className="space-y-4">
                {ASIDE[tab].map((b) => (
                  <li key={b.t} className="flex gap-3">
                    <div className="h-10 w-10 rounded-xl gradient-cyan flex items-center justify-center shrink-0">
                      <b.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{b.t}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{b.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>

          {/* Form */}
          <Card className="gradient-card border-border p-8 md:p-10">
            <form onSubmit={onSubmit} className="space-y-5">
              <h2 className="font-display text-2xl font-bold mb-2">{tab === "candidat" ? "Déposer ma candidature" : "Décrire mon besoin de recrutement"}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="mb-2 block">Nom complet</Label><Input name="name" required placeholder="Jean Dupont" /></div>
                <div><Label className="mb-2 block">{tab === "candidat" ? "Téléphone" : "Entreprise"}</Label><Input name="phoneOrCompany" required placeholder={tab === "candidat" ? "06 ..." : "Société SARL"} /></div>
              </div>
              {tab === "entreprise" ? (
                <div><Label className="mb-2 block">Téléphone</Label><Input name="phone" required placeholder="06 ..." /></div>
              ) : null}
              <div><Label className="mb-2 block">Email</Label><Input name="email" type="email" required placeholder="email@exemple.com" /></div>
              <div><Label className="mb-2 block">{tab === "candidat" ? "Poste recherché" : "Poste à pourvoir"}</Label><Input name="position" required placeholder="Ex : Comptable" /></div>
              <div><Label className="mb-2 block">{tab === "candidat" ? "Présentation / parcours" : "Description du besoin"}</Label><Textarea name="details" required rows={4} minLength={20} placeholder="Décrivez votre profil ou votre besoin (20 caractères minimum)..." /></div>
              <Button type="submit" disabled={sending} className="w-full gradient-cyan text-primary-foreground glow-cyan font-semibold hover:opacity-90">
                {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                {sending ? "Envoi en cours…" : "Envoyer ma demande"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Une question ? <Link to="/contact" className="text-primary font-medium">Contactez notre équipe <ArrowRight className="inline h-3 w-3" /></Link>
              </p>
            </form>
          </Card>
        </div>
      </Section>
    </>
  );
}
