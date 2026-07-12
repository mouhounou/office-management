import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type BusinessRequest = Database["public"]["Tables"]["business_requests"]["Row"];
export type BusinessDocument = Database["public"]["Tables"]["business_documents"]["Row"];
export type BusinessRequestEvent = Database["public"]["Tables"]["business_request_events"]["Row"];

export type RequestType = "recrutement" | "formation" | "audit_rh" | "autre";

export const STATUS_LABELS: Record<string, { fr: string; en: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  new: { fr: "Reçue", en: "Received", variant: "outline" },
  in_review: { fr: "En analyse", en: "In review", variant: "secondary" },
  in_progress: { fr: "En cours", en: "In progress", variant: "secondary" },
  completed: { fr: "Terminée", en: "Completed", variant: "default" },
  cancelled: { fr: "Annulée", en: "Cancelled", variant: "destructive" },
};

export const TYPE_LABELS: Record<RequestType, { fr: string; en: string }> = {
  recrutement: { fr: "Recrutement", en: "Recruitment" },
  formation: { fr: "Formation", en: "Training" },
  audit_rh: { fr: "Audit RH", en: "HR Audit" },
  autre: { fr: "Autre", en: "Other" },
};

export async function getMyCompany(): Promise<Company | null> {
  const { data: s } = await supabase.auth.getSession();
  const uid = s.session?.user.id;
  if (!uid) return null;
  const { data } = await supabase.from("companies").select("*").eq("owner_id", uid).order("created_at").limit(1).maybeSingle();
  return data;
}

export async function listMyRequests(): Promise<BusinessRequest[]> {
  const { data } = await supabase.from("business_requests").select("*").order("created_at", { ascending: false });
  return data ?? [];
}
