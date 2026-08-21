/** Types de demandes du Business Center, partagés par les formulaires du site. */
export type RequestType = "recrutement" | "formation" | "audit_rh" | "autre";

export const TYPE_LABELS: Record<RequestType, { fr: string; en: string }> = {
  recrutement: { fr: "Recrutement", en: "Recruitment" },
  formation: { fr: "Formation", en: "Training" },
  audit_rh: { fr: "Audit RH", en: "HR Audit" },
  autre: { fr: "Autre", en: "Other" },
};
