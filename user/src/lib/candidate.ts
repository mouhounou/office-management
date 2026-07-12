import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Offer = Database["public"]["Tables"]["internship_offers"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export const APP_STATUS: Record<string, { fr: string; en: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  submitted: { fr: "Soumise", en: "Submitted", variant: "outline" },
  reviewed: { fr: "Étudiée", en: "Reviewed", variant: "secondary" },
  shortlisted: { fr: "Présélection", en: "Shortlisted", variant: "secondary" },
  accepted: { fr: "Acceptée", en: "Accepted", variant: "default" },
  rejected: { fr: "Refusée", en: "Rejected", variant: "destructive" },
  placed: { fr: "Placé(e)", en: "Placed", variant: "default" },
};

export async function listPublishedOffers(): Promise<Offer[]> {
  const { data } = await supabase
    .from("internship_offers")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function listMyApplications(): Promise<(Application & { offer?: Offer | null })[]> {
  const { data } = await supabase
    .from("applications")
    .select("*, offer:internship_offers(*)")
    .order("created_at", { ascending: false });
  return (data as (Application & { offer?: Offer | null })[]) ?? [];
}

export async function listMyNotifications(): Promise<Notification[]> {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}
