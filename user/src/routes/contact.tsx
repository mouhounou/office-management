import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Headset,
  CalendarClock,
  Crown,
  Building2,
  Handshake,
  TrendingUp,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { errorMessage } from "@/lib/api";
import { useMemberPrefill } from "@/lib/account-context";
import { submitContactMessage } from "@/lib/submissions";
import {
  AppointmentForm,
  APPOINTMENT_REASONS,
  DEFAULT_APPOINTMENT_REASON,
} from "@/components/sections/contact/AppointmentForm";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  // ?sujet=… préremplit le sujet du message (ex. demande d'un document).
  validateSearch: (search: Record<string, unknown>): { sujet?: string } =>
    typeof search.sujet === "string" && search.sujet ? { sujet: search.sujet.slice(0, 160) } : {},
  head: () => ({
    meta: [
      { title: "Contact — Office Management" },
      {
        name: "description",
        content:
          "Contactez Office Management à Pointe-Noire : envoyez un message ou prenez rendez-vous (conseils RH, orientation, formation, recrutement, direction générale).",
      },
      { property: "og:title", content: "Contact & rendez-vous — Office Management" },
      {
        property: "og:description",
        content: "Téléphone, WhatsApp, email, formulaire de contact et prise de rendez-vous.",
      },
    ],
  }),
  component: Contact,
});

const infos = [
  { i: MapPin, t: "Adresse", v: "Songolo, Pointe-Noire — Congo · BP 97116", href: undefined },
  { i: Phone, t: "Téléphone", v: "06 948 09 05 · 05 680 34 96", href: "tel:+242069480905" },
  { i: Mail, t: "Email", v: "hassanakiana@gmail.com", href: "mailto:hassanakiana@gmail.com" },
  { i: Clock, t: "Horaires", v: "Lundi – Vendredi : 8h – 17h", href: undefined },
];

/** Publics du rendez-vous avec la direction (ancienne page /rdv-pdg). */
const audiences = [
  { i: Building2, t: "Grands comptes", d: "Stratégies RH sur-mesure pour vos enjeux complexes." },
  { i: Handshake, t: "Partenaires", d: "Construire des collaborations à long terme." },
  { i: TrendingUp, t: "Investisseurs", d: "Présentation de la vision et des opportunités." },
  { i: Landmark, t: "Institutions", d: "Discussions de haut niveau sur les politiques RH." },
];

/** Motif préselectionné pour un rendez-vous avec la direction (doit exister dans APPOINTMENT_REASONS). */
const DIRECTION_REASON = "Conseils RH";

type Mode = "message" | "rendez-vous";

const modes: { id: Mode; label: string; icon: typeof Send }[] = [
  { id: "message", label: "Envoyer un message", icon: Send },
  { id: "rendez-vous", label: "Prendre rendez-vous", icon: CalendarClock },
];

function scrollToId(id: string) {
  // Laisse React afficher la section avant de défiler.
  requestAnimationFrame(() =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
  );
}

function Contact() {
  const { sujet } = Route.useSearch();
  const prefill = useMemberPrefill();
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState<Mode>("message");
  const [reason, setReason] = useState(DEFAULT_APPOINTMENT_REASON);
  const [messageHint, setMessageHint] = useState<{ text: string; nonce: number }>();
  const routerHash = useLocation({ select: (l) => l.hash });

  // Ancres /contact#rendez-vous et /contact#message (lues côté client uniquement).
  const applyHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash === "rendez-vous" || hash === "message") {
      setMode(hash);
      scrollToId(hash);
    }
  }, []);

  useEffect(() => {
    applyHash();
  }, [applyHash, routerHash]);

  useEffect(() => {
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [applyHash]);

  const bookDirection = () => {
    setMode("rendez-vous");
    setReason(DIRECTION_REASON);
    setMessageHint({
      text: "Je souhaite un rendez-vous avec la direction générale.",
      nonce: Date.now(),
    });
    scrollToId("rendez-vous");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    setSending(true);
    try {
      await submitContactMessage({
        name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? ""),
        subject: String(fd.get("subject") ?? ""),
        message: String(fd.get("message") ?? ""),
      });
      setDone(true);
      toast.success("Message envoyé ! Nous vous recontactons rapidement.");
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
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div
          className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <Headset className="h-3.5 w-3.5" /> Contact
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Discutons de <span className="text-gradient-cyan">votre projet</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Écrivez-nous ou prenez rendez-vous : nos équipes vous répondent sous 48h. Devis,
            inscription formation, recrutement ou conseil — nous sommes à votre écoute.
          </p>
        </div>
      </section>

      {/* CONTENU */}
      <Section className="pt-14!">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
          {/* Coordonnées */}
          <div className="space-y-4">
            {infos.map((c) => {
              const inner = (
                <Card className="group gradient-card border-border p-5 flex items-start gap-4 hover-lift">
                  <div className="h-11 w-11 rounded-xl gradient-cyan flex items-center justify-center shrink-0 group-hover:glow-cyan transition">
                    <c.i className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold">{c.t}</div>
                    <div className="text-sm text-muted-foreground break-words">{c.v}</div>
                  </div>
                </Card>
              );
              return c.href ? (
                <a key={c.t} href={c.href} className="block">
                  {inner}
                </a>
              ) : (
                <div key={c.t}>{inner}</div>
              );
            })}

            <div className="flex gap-2 pt-1">
              <Button
                asChild
                className="flex-1 gradient-cyan text-primary-foreground font-semibold hover:opacity-90"
              >
                <a href="tel:+242069480905">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </a>
              </Button>
              <Button asChild className="flex-1 bg-[#25D366] hover:bg-[#1faa54] text-white">
                <a href="https://wa.me/242069480905" target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Formulaires : message ou rendez-vous */}
          <div>
            <div
              role="tablist"
              aria-label="Type de demande"
              className="mb-5 grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-1 shadow-card"
            >
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === m.id}
                  aria-controls={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    mode === m.id
                      ? "gradient-cyan text-primary-foreground shadow-card"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                  )}
                >
                  <m.icon className="h-4 w-4" />
                  {m.label}
                </button>
              ))}
            </div>

            <div id="message" role="tabpanel" hidden={mode !== "message"} className="scroll-mt-24">
              <Card className="gradient-card border-border p-8 md:p-10">
                {done ? (
                  <div className="text-center py-8">
                    <div className="mx-auto mb-5 h-16 w-16 rounded-full gradient-cyan flex items-center justify-center glow-cyan">
                      <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h2 className="font-display text-2xl font-bold mb-2">Message envoyé !</h2>
                    <p className="text-muted-foreground mb-6">
                      Merci, nous vous recontactons sous 48h ouvrées.
                    </p>
                    <Button
                      onClick={() => setDone(false)}
                      variant="outline"
                      className="border-primary/40 hover:bg-primary/10"
                    >
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <form key={prefill.key} onSubmit={onSubmit} className="space-y-5">
                    <h2 className="font-display text-2xl font-bold">Écrivez-nous</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Nom</Label>
                        <Input
                          name="name"
                          required
                          defaultValue={prefill.name}
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Téléphone</Label>
                        <Input
                          name="phone"
                          required
                          defaultValue={prefill.phone}
                          placeholder="06 ..."
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block">Email</Label>
                      <Input
                        name="email"
                        type="email"
                        required
                        defaultValue={prefill.email}
                        placeholder="email@exemple.com"
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block">Sujet</Label>
                      <Input
                        key={sujet}
                        name="subject"
                        required
                        defaultValue={sujet}
                        placeholder="Demande de devis, inscription, ..."
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block">Message</Label>
                      <Textarea
                        name="message"
                        required
                        rows={5}
                        placeholder="Décrivez votre besoin..."
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full gradient-cyan text-primary-foreground glow-cyan font-semibold hover:opacity-90"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {sending ? "Envoi en cours…" : "Envoyer le message"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Vos informations restent strictement confidentielles.
                    </p>
                  </form>
                )}
              </Card>
            </div>

            <section
              id="rendez-vous"
              role="tabpanel"
              aria-label="Prendre rendez-vous"
              hidden={mode !== "rendez-vous"}
              className="scroll-mt-24 space-y-6"
            >
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="eyebrow mb-3">Motifs disponibles</div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {APPOINTMENT_REASONS.map((m) => (
                    <button
                      key={m.t}
                      type="button"
                      onClick={() => setReason(m.t)}
                      aria-pressed={reason === m.t}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-3 text-center text-xs font-semibold transition",
                        reason === m.t
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:border-primary/40 text-muted-foreground",
                      )}
                    >
                      <m.i className="h-6 w-6 text-primary" />
                      {m.t}
                    </button>
                  ))}
                </div>
              </div>

              <Card className="gradient-card border-border p-8">
                <AppointmentForm
                  reason={reason}
                  onReasonChange={setReason}
                  messageHint={messageHint}
                />
              </Card>

              {/* Rendez-vous avec la direction (ancienne page /rdv-pdg) */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-start gap-4 mb-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
                    <Crown className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="eyebrow mb-1">Service premium</div>
                    <h3 className="font-display text-xl font-bold">
                      Rendez-vous avec la direction
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Un échange direct, confidentiel et stratégique avec la direction générale.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {audiences.map((a) => (
                    <div
                      key={a.t}
                      className="flex items-start gap-3 rounded-xl border border-border p-4"
                    >
                      <a.i className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <div>
                        <div className="font-display text-sm font-bold">{a.t}</div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{a.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={bookDirection}
                  variant="outline"
                  className="mt-5 w-full border-primary/40 hover:bg-primary/10"
                >
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Demander un rendez-vous avec la direction
                </Button>
              </div>
            </section>
          </div>
        </div>

        {/* Carte */}
        <div className="mt-10 rounded-2xl overflow-hidden border border-border shadow-elegant">
          <iframe
            title="Carte Pointe-Noire"
            src="https://www.google.com/maps?q=Pointe-Noire,+Republic+of+the+Congo&output=embed"
            width="100%"
            height="380"
            loading="lazy"
            style={{ border: 0 }}
          />
        </div>
      </Section>
    </>
  );
}
