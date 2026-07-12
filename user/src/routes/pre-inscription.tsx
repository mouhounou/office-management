import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { GraduationCap, CheckCircle2, Send, User, IdCard, BookOpen, ShieldCheck, Clock, BadgeCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pre-inscription")({
  head: () => ({
    meta: [
      { title: "Pré-inscription formation — Office Management" },
      { name: "description", content: "Formulaire de pré-inscription aux formations professionnelles : informations personnelles, formation choisie, durée et date de début." },
      { property: "og:title", content: "Pré-inscription — Office Management" },
      { property: "og:description", content: "Inscrivez-vous à nos formations certifiantes." },
    ],
  }),
  component: PreInscription,
});

const TRAININGS = [
  "Assistant Comptable",
  "Secrétariat Bureautique",
  "Gestion des Ressources Humaines",
  "Informatique Bureautique",
  "QHSE",
  "Logistique",
  "Management",
  "Entrepreneuriat",
  "Anglais Professionnel",
  "SAGE 100 i7",
  "Excel Avancé",
  "Formations Techniques",
] as const;

const FINANCING = ["Personnel", "Employeur", "Organisme / Bourse", "Autre"] as const;
const ID_TYPES = ["CNI", "Passeport", "Permis de conduire", "Carte consulaire", "Autre"] as const;

const schema = z.object({
  full_name: z.string().trim().min(2, "Nom trop court").max(120),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone invalide").max(30),
  date_of_birth: z.string().min(1, "Date requise"),
  place_of_birth: z.string().trim().min(2, "Lieu requis").max(120),
  neighborhood: z.string().trim().min(2, "Quartier requis").max(120),
  profession: z.string().trim().min(2, "Profession requise").max(120),
  financing_type: z.enum(FINANCING, { message: "Choisir un type de financement" }),
  id_document_type: z.enum(ID_TYPES, { message: "Choisir un type de pièce" }),
  id_document_number: z.string().trim().min(3, "Numéro requis").max(60),
  training: z.enum(TRAININGS, { message: "Choisir une formation" }),
  duration: z.string().trim().min(1, "Durée requise").max(50),
  start_date: z.string().min(1, "Date de début requise"),
});

type FormData = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormData, string>>;

function PreInscription() {
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
    const { data: sessionData } = await supabase.auth.getSession();
    const submitter_id = sessionData.session?.user.id ?? null;
    const { error } = await supabase.from("pre_registrations").insert({ ...parsed.data, submitter_id });
    setSubmitting(false);
    if (error) {
      console.error("[pre-inscription] insert error", error);
      toast.error("Erreur lors de l'envoi. Réessayez ou appelez-nous au 069480905.");
      return;
    }
    setDone(true);
    toast.success("Pré-inscription enregistrée ! Nous vous recontactons rapidement.");
  };

  if (done) {
    return (
      <Section className="py-24!">
        <Card className="gradient-card border-primary/30 max-w-xl mx-auto p-12 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-56 w-56 bg-primary/25 blur-3xl rounded-full" />
          <div className="relative">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full gradient-cyan flex items-center justify-center glow-cyan">
              <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-3">Pré-inscription enregistrée !</h1>
            <p className="text-muted-foreground mb-8">Notre équipe pédagogique reviendra vers vous sous 48h ouvrées pour confirmer votre inscription.</p>
            <Button onClick={() => { setDone(false); setData({}); }} className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90">Nouvelle inscription</Button>
          </div>
        </Card>
      </Section>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <GraduationCap className="h-3.5 w-3.5" /> Pré-inscription
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Inscrivez-vous à une <span className="text-gradient-cyan">formation</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Remplissez ce formulaire pour réserver votre place. Confirmation sous 48h.
          </p>
        </div>
      </section>

      <Section className="pt-14!">
        <div className="grid lg:grid-cols-[0.8fr_1.6fr] gap-8 items-start">
          {/* Aside réassurance */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <Card className="gradient-card border-border p-6">
              <h2 className="font-display text-lg font-bold mb-4">Pourquoi se pré-inscrire ?</h2>
              <ul className="space-y-4">
                {[
                  { icon: Clock, t: "Réponse sous 48h", d: "Notre équipe pédagogique vous recontacte rapidement." },
                  { icon: BadgeCheck, t: "Formations certifiantes", d: "Des diplômes et attestations reconnus." },
                  { icon: ShieldCheck, t: "100% confidentiel", d: "Vos données sont chiffrées et protégées." },
                ].map((b) => (
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
            <Card className="glass p-5 text-sm text-muted-foreground">
              Une question ? Appelez-nous au <a href="tel:+242069480905" className="text-primary font-semibold">06 948 09 05</a>.
            </Card>
          </aside>

          {/* Formulaire */}
          <Card className="gradient-card border-border p-8 md:p-10">
          <form onSubmit={onSubmit} className="space-y-8" noValidate>
            <div>
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Informations personnelles</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Nom complet *</Label>
                  <Input maxLength={120} value={data.full_name ?? ""} onChange={e => set("full_name", e.target.value)} className={errors.full_name ? "border-destructive" : ""} />
                  {errors.full_name && <p className="text-xs text-destructive mt-1.5">{errors.full_name}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">Profession *</Label>
                  <Input maxLength={120} value={data.profession ?? ""} onChange={e => set("profession", e.target.value)} placeholder="Ex : étudiant, comptable" className={errors.profession ? "border-destructive" : ""} />
                  {errors.profession && <p className="text-xs text-destructive mt-1.5">{errors.profession}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">Date de naissance *</Label>
                  <Input type="date" value={data.date_of_birth ?? ""} onChange={e => set("date_of_birth", e.target.value)} className={errors.date_of_birth ? "border-destructive" : ""} />
                  {errors.date_of_birth && <p className="text-xs text-destructive mt-1.5">{errors.date_of_birth}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">Lieu de naissance *</Label>
                  <Input maxLength={120} value={data.place_of_birth ?? ""} onChange={e => set("place_of_birth", e.target.value)} placeholder="Ville, pays" className={errors.place_of_birth ? "border-destructive" : ""} />
                  {errors.place_of_birth && <p className="text-xs text-destructive mt-1.5">{errors.place_of_birth}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">Email *</Label>
                  <Input type="email" maxLength={255} value={data.email ?? ""} onChange={e => set("email", e.target.value)} className={errors.email ? "border-destructive" : ""} />
                  {errors.email && <p className="text-xs text-destructive mt-1.5">{errors.email}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">Téléphone *</Label>
                  <Input maxLength={30} value={data.phone ?? ""} onChange={e => set("phone", e.target.value)} placeholder="+242 ..." className={errors.phone ? "border-destructive" : ""} />
                  {errors.phone && <p className="text-xs text-destructive mt-1.5">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label className="mb-2 block">Quartier de résidence *</Label>
                  <Input maxLength={120} value={data.neighborhood ?? ""} onChange={e => set("neighborhood", e.target.value)} placeholder="Ex : Mpita, Pointe-Noire" className={errors.neighborhood ? "border-destructive" : ""} />
                  {errors.neighborhood && <p className="text-xs text-destructive mt-1.5">{errors.neighborhood}</p>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><IdCard className="h-4 w-4 text-primary" /> Pièce d'identité</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Type de pièce *</Label>
                  <Select value={data.id_document_type} onValueChange={(v) => set("id_document_type", v as typeof ID_TYPES[number])}>
                    <SelectTrigger className={errors.id_document_type ? "border-destructive" : ""}>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ID_TYPES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.id_document_type && <p className="text-xs text-destructive mt-1.5">{errors.id_document_type}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">Numéro de pièce *</Label>
                  <Input maxLength={60} value={data.id_document_number ?? ""} onChange={e => set("id_document_number", e.target.value)} className={errors.id_document_number ? "border-destructive" : ""} />
                  {errors.id_document_number && <p className="text-xs text-destructive mt-1.5">{errors.id_document_number}</p>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Formation</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="mb-2 block">Formation choisie *</Label>
                  <Select value={data.training} onValueChange={(v) => set("training", v as typeof TRAININGS[number])}>
                    <SelectTrigger className={errors.training ? "border-destructive" : ""}>
                      <SelectValue placeholder="Choisir une formation..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TRAININGS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.training && <p className="text-xs text-destructive mt-1.5">{errors.training}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">Durée *</Label>
                  <Input maxLength={50} value={data.duration ?? ""} onChange={e => set("duration", e.target.value)} placeholder="Ex : 3 mois" className={errors.duration ? "border-destructive" : ""} />
                  {errors.duration && <p className="text-xs text-destructive mt-1.5">{errors.duration}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">Date de début souhaitée *</Label>
                  <Input type="date" value={data.start_date ?? ""} onChange={e => set("start_date", e.target.value)} className={errors.start_date ? "border-destructive" : ""} />
                  {errors.start_date && <p className="text-xs text-destructive mt-1.5">{errors.start_date}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label className="mb-2 block">Type de financement *</Label>
                  <Select value={data.financing_type} onValueChange={(v) => set("financing_type", v as typeof FINANCING[number])}>
                    <SelectTrigger className={errors.financing_type ? "border-destructive" : ""}>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FINANCING.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.financing_type && <p className="text-xs text-destructive mt-1.5">{errors.financing_type}</p>}
                </div>
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full gradient-cyan text-primary-foreground glow-cyan">
              <Send className="h-4 w-4 mr-2" />{submitting ? "Envoi en cours..." : "Valider ma pré-inscription"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">Vos informations restent strictement confidentielles.</p>
          </form>
          </Card>
        </div>
      </Section>
    </>
  );
}
