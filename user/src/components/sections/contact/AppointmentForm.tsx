import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Briefcase, CalendarClock, Compass, GraduationCap, Loader2, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { errorMessage } from "@/lib/api";
import { useMemberPrefill } from "@/lib/account-context";
import { submitAppointment } from "@/lib/submissions";

/** Motifs de rendez-vous proposés (valeurs envoyées telles quelles à l'API). */
// eslint-disable-next-line react-refresh/only-export-components
export const APPOINTMENT_REASONS: { i: LucideIcon; t: string }[] = [
  { i: Briefcase, t: "Conseils RH" },
  { i: Compass, t: "Orientation professionnelle" },
  { i: GraduationCap, t: "Informations sur les formations" },
  { i: Search, t: "Recrutement et emploi" },
];

export const DEFAULT_APPOINTMENT_REASON = "Conseils RH";

/**
 * Formulaire de demande de rendez-vous (kind « rendez-vous »), anciennement
 * sur /rendez-vous. Le motif peut être piloté par le parent (`reason` +
 * `onReasonChange`) ; `messageHint` pré-remplit le message s'il est vide.
 */
export function AppointmentForm({
  reason,
  onReasonChange,
  messageHint,
}: {
  reason?: string;
  onReasonChange?: (reason: string) => void;
  messageHint?: { text: string; nonce: number };
}) {
  const prefill = useMemberPrefill();
  const [innerMotif, setInnerMotif] = useState(DEFAULT_APPOINTMENT_REASON);
  const motif = reason ?? innerMotif;
  const setMotif = (value: string) => {
    setInnerMotif(value);
    onReasonChange?.(value);
  };
  const [sending, setSending] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = messageRef.current;
    if (messageHint && el && !el.value.trim()) el.value = messageHint.text;
  }, [messageHint]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    setSending(true);
    try {
      await submitAppointment({
        name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? ""),
        reason: motif,
        preferredDate: String(fd.get("preferredDate") ?? ""),
        timeSlot: (fd.get("timeSlot") as "matin" | "apres-midi") ?? "matin",
        message: String(fd.get("message") ?? ""),
      });
      toast.success("Demande de rendez-vous envoyée ! Nous vous recontactons sous 48h.");
      form.reset();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSending(false);
    }
  };

  return (
    <form key={prefill.key} onSubmit={onSubmit} className="space-y-4">
      <h2 className="font-display text-2xl font-bold mb-2 flex items-center gap-2">
        <CalendarClock className="h-6 w-6 text-primary" /> Réserver un rendez-vous
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Nom complet</Label>
          <Input name="name" required defaultValue={prefill.name} placeholder="Jean Dupont" />
        </div>
        <div>
          <Label>Téléphone</Label>
          <Input name="phone" required defaultValue={prefill.phone} placeholder="06 ..." />
        </div>
      </div>
      <div>
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          required
          defaultValue={prefill.email}
          placeholder="email@exemple.com"
        />
      </div>
      <div>
        <Label>Motif</Label>
        <Select value={motif} onValueChange={setMotif}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {APPOINTMENT_REASONS.map((m) => (
              <SelectItem key={m.t} value={m.t}>
                {m.t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Date souhaitée</Label>
          <Input name="preferredDate" type="date" required />
        </div>
        <div>
          <Label>Créneau</Label>
          <Select name="timeSlot" defaultValue="matin">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matin">Matin (8h - 12h)</SelectItem>
              <SelectItem value="apres-midi">Après-midi (13h - 17h)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Message (facultatif)</Label>
        <Textarea ref={messageRef} name="message" rows={4} placeholder="Précisez votre besoin..." />
      </div>
      <Button
        type="submit"
        disabled={sending}
        className="w-full gradient-cyan text-primary-foreground glow-cyan"
      >
        {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
        {sending ? "Envoi en cours…" : "Confirmer le rendez-vous"}
      </Button>
    </form>
  );
}
