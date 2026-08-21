import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, CheckCircle2, Send } from "lucide-react";
import { errorMessage, fieldErrorsOf } from "@/lib/api";
import { submitQuote } from "@/lib/submissions";

export const Route = createFileRoute("/devis")({
  head: () => ({
    meta: [
      { title: "Demande de devis — Office Management" },
      { name: "description", content: "Demandez un devis personnalisé pour formation, personnel, prestations techniques, conseil RH ou logiciels Excel/SAGE." },
      { property: "og:title", content: "Demande de devis — Office Management" },
      { property: "og:description", content: "Réponse sous 48h pour votre projet RH ou technique." },
    ],
  }),
  component: Devis,
});

const POLES = [
  "Formation professionnelle",
  "Mise à disposition de personnel",
  "Prestations techniques",
  "Conseil RH",
  "Services additionnels",
  "Excel & SAGE 100 i7",
] as const;

const schema = z.object({
  pole: z.enum(POLES, { message: "Veuillez choisir un pôle de services" }),
  name: z.string().trim().min(2, "Nom trop court").max(100, "Nom trop long"),
  company: z.string().trim().max(120, "Trop long").optional(),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone invalide").max(30),
  budget: z.string().max(50).optional(),
  deadline: z.string().max(50).optional(),
  message: z.string().trim().min(10, "Décrivez votre besoin (min 10 caractères)").max(2000, "Message trop long (max 2000)"),
});

type FormData = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormData, string>>;

function Devis() {
  const [data, setData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    setData(d => ({ ...d, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fe: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormData;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      toast.error("Merci de corriger les champs en rouge.");
      return;
    }
    setSubmitting(true);
    try {
      await submitQuote(parsed.data);
      setDone(true);
      toast.success("Demande envoyée ! Nous vous recontactons sous 48h.");
    } catch (error) {
      // L'API revalide les données : ses erreurs par champ sont réaffichées ici.
      setErrors(fieldErrorsOf(error) as Errors);
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Section>
        <Card className="gradient-card border-primary/30 max-w-xl mx-auto p-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-5 animate-pulse-glow rounded-full" />
          <h1 className="font-display text-3xl font-bold mb-3">Demande bien reçue !</h1>
          <p className="text-muted-foreground mb-6">Notre équipe revient vers vous sous 48h ouvrées avec une proposition personnalisée.</p>
          <Button onClick={() => { setDone(false); setData({}); }} className="gradient-cyan text-primary-foreground">Faire une nouvelle demande</Button>
        </Card>
      </Section>
    );
  }

  return (
    <>
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Demande de devis</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Obtenez votre devis personnalisé</h1>
          <p className="text-muted-foreground text-lg">Réponse sous 48h ouvrées. Sans engagement.</p>
        </div>
      </section>

      <Section>
        <Card className="gradient-card border-border max-w-3xl mx-auto p-8 md:p-10">
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div>
              <Label className="mb-2 block">Pôle de services <span className="text-primary">*</span></Label>
              <Select value={data.pole} onValueChange={(v) => set("pole", v as typeof POLES[number])}>
                <SelectTrigger className={errors.pole ? "border-destructive" : ""}>
                  <SelectValue placeholder="Choisir un pôle..." />
                </SelectTrigger>
                <SelectContent>
                  {POLES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.pole && <p className="text-xs text-destructive mt-1.5">{errors.pole}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Nom complet <span className="text-primary">*</span></Label>
                <Input maxLength={100} value={data.name ?? ""} onChange={e => set("name", e.target.value)} placeholder="Jean Dupont" className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="text-xs text-destructive mt-1.5">{errors.name}</p>}
              </div>
              <div>
                <Label className="mb-2 block">Entreprise</Label>
                <Input maxLength={120} value={data.company ?? ""} onChange={e => set("company", e.target.value)} placeholder="Société SARL (optionnel)" />
                {errors.company && <p className="text-xs text-destructive mt-1.5">{errors.company}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Email <span className="text-primary">*</span></Label>
                <Input type="email" maxLength={255} value={data.email ?? ""} onChange={e => set("email", e.target.value)} placeholder="vous@entreprise.com" className={errors.email ? "border-destructive" : ""} />
                {errors.email && <p className="text-xs text-destructive mt-1.5">{errors.email}</p>}
              </div>
              <div>
                <Label className="mb-2 block">Téléphone <span className="text-primary">*</span></Label>
                <Input maxLength={30} value={data.phone ?? ""} onChange={e => set("phone", e.target.value)} placeholder="+242 ..." className={errors.phone ? "border-destructive" : ""} />
                {errors.phone && <p className="text-xs text-destructive mt-1.5">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Budget estimé</Label>
                <Input maxLength={50} value={data.budget ?? ""} onChange={e => set("budget", e.target.value)} placeholder="Ex : 500 000 – 1 000 000 FCFA" />
              </div>
              <div>
                <Label className="mb-2 block">Échéance souhaitée</Label>
                <Input maxLength={50} value={data.deadline ?? ""} onChange={e => set("deadline", e.target.value)} placeholder="Ex : sous 3 mois" />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Description du besoin <span className="text-primary">*</span></Label>
              <Textarea rows={5} maxLength={2000} value={data.message ?? ""} onChange={e => set("message", e.target.value)} placeholder="Décrivez votre projet, le nombre de personnes concernées, le contexte..." className={errors.message ? "border-destructive" : ""} />
              <div className="flex justify-between mt-1.5">
                {errors.message ? <p className="text-xs text-destructive">{errors.message}</p> : <span />}
                <p className="text-xs text-muted-foreground">{(data.message ?? "").length}/2000</p>
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full gradient-cyan text-primary-foreground glow-cyan">
              <Send className="h-4 w-4 mr-2" />{submitting ? "Envoi en cours..." : "Envoyer ma demande de devis"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">Vos informations restent strictement confidentielles.</p>
          </form>
        </Card>
      </Section>
    </>
  );
}
