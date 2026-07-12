import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, Building2 } from "lucide-react";
import { type RequestType, TYPE_LABELS } from "@/lib/business";

const requestSchema = z.object({
  contact_name: z.string().trim().min(2, "Nom requis").max(120),
  company: z.string().trim().min(2, "Entreprise requise").max(180),
  contact_email: z.string().trim().email("Email invalide").max(180),
  contact_phone: z.string().trim().min(6, "Téléphone invalide").max(40),
  title: z.string().trim().min(4, "Titre trop court").max(180),
  description: z.string().trim().min(20, "Décrivez votre besoin (min. 20 caractères)").max(4000),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  budget: z.string().max(80).optional().or(z.literal("")),
  deadline: z.string().optional().or(z.literal("")),
});

export function BusinessRequestForm({ type }: { type: RequestType }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [extra, setExtra] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const obj = Object.fromEntries(fd.entries());
    const parsed = requestSchema.safeParse(obj);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    // Envoi simulé (le backend Node.js branchera l'API plus tard).
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setDone(true);
    toast.success("Demande envoyée ! Notre équipe vous recontacte sous 48h.");
  };

  if (done) {
    return (
      <Card className="gradient-card border-primary/30 max-w-xl mx-auto p-10 text-center">
        <div className="mx-auto mb-5 h-16 w-16 rounded-full gradient-cyan flex items-center justify-center glow-cyan">
          <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Demande envoyée !</h2>
        <p className="text-muted-foreground mb-6">
          Merci. Notre équipe traite votre demande {TYPE_LABELS[type].fr.toLowerCase()} et revient vers vous sous 48h ouvrées.
        </p>
        <Button onClick={() => setDone(false)} className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90">Nouvelle demande</Button>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Coordonnées */}
      <div>
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Vos coordonnées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="contact_name">Nom complet *</Label><Input id="contact_name" name="contact_name" required maxLength={120} placeholder="Jean Dupont" /></div>
          <div className="space-y-2"><Label htmlFor="company">Entreprise *</Label><Input id="company" name="company" required maxLength={180} placeholder="Société SARL" /></div>
          <div className="space-y-2"><Label htmlFor="contact_email">Email *</Label><Input id="contact_email" name="contact_email" type="email" required maxLength={180} placeholder="email@entreprise.com" /></div>
          <div className="space-y-2"><Label htmlFor="contact_phone">Téléphone *</Label><Input id="contact_phone" name="contact_phone" required maxLength={40} placeholder="+242 ..." /></div>
        </div>
      </div>

      {/* Besoin */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold flex items-center gap-2">Votre besoin</h3>
        <div className="space-y-2">
          <Label htmlFor="title">Titre de la demande *</Label>
          <Input id="title" name="title" required maxLength={180} placeholder={titlePlaceholder(type)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description détaillée *</Label>
          <Textarea id="description" name="description" required rows={6} maxLength={4000} placeholder={descPlaceholder(type)} />
        </div>

        <TypeSpecificFields type={type} extra={extra} setExtra={setExtra} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select name="priority" defaultValue="normal">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="normal">Normale</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget indicatif (FCFA)</Label>
            <Input id="budget" name="budget" maxLength={80} placeholder="ex. 2 000 000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Échéance souhaitée</Label>
            <Input id="deadline" name="deadline" type="date" />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={submitting} className="w-full gradient-cyan text-primary-foreground font-semibold hover:opacity-90">
        {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Envoyer la demande
      </Button>
      <p className="text-xs text-center text-muted-foreground">Vos informations restent strictement confidentielles.</p>
    </form>
  );
}

function titlePlaceholder(t: RequestType) {
  return { recrutement: "ex. Recrutement d'un Responsable QHSE", formation: "ex. Formation Excel avancé — 12 collaborateurs", audit_rh: "ex. Audit complet de la fonction RH", autre: "ex. Mission spécifique" }[t];
}
function descPlaceholder(t: RequestType) {
  return { recrutement: "Postes recherchés, profils, missions, contexte, urgence...", formation: "Thématiques, public visé, niveau, durée, format (présentiel/en ligne), lieu...", audit_rh: "Périmètre de l'audit, effectif, objectifs, livrables attendus...", autre: "Décrivez votre besoin." }[t];
}

function TypeSpecificFields({ type, extra, setExtra }: { type: RequestType; extra: Record<string, string>; setExtra: (e: Record<string, string>) => void }) {
  const upd = (k: string, v: string) => setExtra({ ...extra, [k]: v });
  if (type === "recrutement") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Nombre de postes</Label><Input value={extra.positions ?? ""} onChange={e => upd("positions", e.target.value)} placeholder="ex. 3" /></div>
        <div className="space-y-2"><Label>Type de contrat</Label>
          <Select value={extra.contract ?? ""} onValueChange={v => upd("contract", v)}>
            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cdi">CDI</SelectItem><SelectItem value="cdd">CDD</SelectItem>
              <SelectItem value="stage">Stage</SelectItem><SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
  if (type === "formation") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Nombre de participants</Label><Input value={extra.participants ?? ""} onChange={e => upd("participants", e.target.value)} placeholder="ex. 12" /></div>
        <div className="space-y-2"><Label>Format</Label>
          <Select value={extra.format ?? ""} onValueChange={v => upd("format", v)}>
            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="presentiel">Présentiel</SelectItem>
              <SelectItem value="en_ligne">En ligne</SelectItem>
              <SelectItem value="hybride">Hybride</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
  if (type === "audit_rh") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Effectif total</Label><Input value={extra.headcount ?? ""} onChange={e => upd("headcount", e.target.value)} placeholder="ex. 45" /></div>
        <div className="space-y-2"><Label>Périmètre</Label>
          <Select value={extra.scope ?? ""} onValueChange={v => upd("scope", v)}>
            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Audit global RH</SelectItem>
              <SelectItem value="conformite">Audit de conformité</SelectItem>
              <SelectItem value="paie">Audit paie</SelectItem>
              <SelectItem value="organisation">Audit organisationnel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
  return null;
}
