import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, Headset } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { errorMessage } from "@/lib/api";
import { useMemberPrefill } from "@/lib/account-context";
import { submitContactMessage } from "@/lib/submissions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Office Management" },
      { name: "description", content: "Contactez Office Management à Pointe-Noire pour vos besoins en formation, recrutement et conseil RH." },
      { property: "og:title", content: "Contact — Office Management" },
      { property: "og:description", content: "Téléphone, WhatsApp, email et formulaire de contact." },
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

function Contact() {
  const prefill = useMemberPrefill();
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

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
        <div className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <Headset className="h-3.5 w-3.5" /> Contact
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Discutons de <span className="text-gradient-cyan">votre projet</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nos équipes vous répondent sous 48h. Devis, inscription formation, recrutement ou conseil — nous sommes à votre écoute.
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
                  <div className="h-11 w-11 rounded-xl gradient-cyan flex items-center justify-center shrink-0 group-hover:glow-cyan transition"><c.i className="h-5 w-5 text-primary-foreground" /></div>
                  <div className="min-w-0">
                    <div className="font-display font-bold">{c.t}</div>
                    <div className="text-sm text-muted-foreground break-words">{c.v}</div>
                  </div>
                </Card>
              );
              return c.href ? <a key={c.t} href={c.href} className="block">{inner}</a> : <div key={c.t}>{inner}</div>;
            })}

            <div className="flex gap-2 pt-1">
              <Button asChild className="flex-1 gradient-cyan text-primary-foreground font-semibold hover:opacity-90"><a href="tel:+242069480905"><Phone className="h-4 w-4 mr-2" />Appeler</a></Button>
              <Button asChild className="flex-1 bg-[#25D366] hover:bg-[#1faa54] text-white"><a href="https://wa.me/242069480905" target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4 mr-2" />WhatsApp</a></Button>
            </div>
          </div>

          {/* Formulaire */}
          <Card className="gradient-card border-border p-8 md:p-10">
            {done ? (
              <div className="text-center py-8">
                <div className="mx-auto mb-5 h-16 w-16 rounded-full gradient-cyan flex items-center justify-center glow-cyan">
                  <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">Message envoyé !</h2>
                <p className="text-muted-foreground mb-6">Merci, nous vous recontactons sous 48h ouvrées.</p>
                <Button onClick={() => setDone(false)} variant="outline" className="border-primary/40 hover:bg-primary/10">Envoyer un autre message</Button>
              </div>
            ) : (
              <form key={prefill.key} onSubmit={onSubmit} className="space-y-5">
                <h2 className="font-display text-2xl font-bold">Écrivez-nous</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label className="mb-2 block">Nom</Label><Input name="name" required defaultValue={prefill.name} placeholder="Jean Dupont" /></div>
                  <div><Label className="mb-2 block">Téléphone</Label><Input name="phone" required defaultValue={prefill.phone} placeholder="06 ..." /></div>
                </div>
                <div><Label className="mb-2 block">Email</Label><Input name="email" type="email" required defaultValue={prefill.email} placeholder="email@exemple.com" /></div>
                <div><Label className="mb-2 block">Sujet</Label><Input name="subject" required placeholder="Demande de devis, inscription, ..." /></div>
                <div><Label className="mb-2 block">Message</Label><Textarea name="message" required rows={5} placeholder="Décrivez votre besoin..." /></div>
                <Button type="submit" disabled={sending} className="w-full gradient-cyan text-primary-foreground glow-cyan font-semibold hover:opacity-90">
                  {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  {sending ? "Envoi en cours…" : "Envoyer le message"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">Vos informations restent strictement confidentielles.</p>
              </form>
            )}
          </Card>
        </div>

        {/* Carte */}
        <div className="mt-10 rounded-2xl overflow-hidden border border-border shadow-elegant">
          <iframe
            title="Carte Pointe-Noire"
            src="https://www.google.com/maps?q=Pointe-Noire,+Republic+of+the+Congo&output=embed"
            width="100%" height="380" loading="lazy" style={{ border: 0 }}
          />
        </div>
      </Section>
    </>
  );
}
