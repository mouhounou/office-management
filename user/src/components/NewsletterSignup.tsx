import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({ email: z.string().trim().email("Email invalide").max(255) });

export function NewsletterSignup({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.email, source });
    setLoading(false);
    if (error) {
      if (error.code === "23505") toast.info("Vous êtes déjà inscrit. Merci !");
      else toast.error("Erreur, réessayez plus tard.");
      return;
    }
    toast.success("Merci ! Vous êtes inscrit à notre newsletter.");
    setEmail("");
  };

  return (
    <form onSubmit={onSubmit} className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-bold">Newsletter RH</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Recevez nos offres, formations et conseils RH directement par email.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          required
          maxLength={255}
          placeholder="votre.email@exemple.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading} className="gradient-cyan text-primary-foreground">
          <Send className="h-4 w-4 mr-1.5" />
          {loading ? "..." : "S'inscrire"}
        </Button>
      </div>
    </form>
  );
}
