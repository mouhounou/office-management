import { Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, TrendingUp } from "lucide-react";
import { useState } from "react";

import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Calculateur de retour sur investissement formation (ex-page calculateur-roi). */
export function RoiCalculator() {
  const [employees, setEmployees] = useState(10);
  const [budget, setBudget] = useState(500000);
  const productivity = Math.round(employees * 150000 * 0.15);
  const errors = Math.round(employees * 80000 * 0.2);
  const total = productivity + errors;
  const roi = budget > 0 ? Math.round(((total - budget) / budget) * 100) : 0;

  return (
    <Section id="roi" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Outil entreprises"
        title="Calculez le ROI de vos formations"
        subtitle="Estimez les gains potentiels d'un plan de formation pour vos équipes."
      />
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold">
            <Calculator className="h-5 w-5 text-brand-strong" /> Vos données
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="roi-employees" className="mb-2 block">
                Nombre d'employés à former
              </Label>
              <Input
                id="roi-employees"
                type="number"
                min={1}
                value={employees}
                onChange={(e) => setEmployees(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
            <div>
              <Label htmlFor="roi-budget" className="mb-2 block">
                Budget formation (FCFA)
              </Label>
              <Input
                id="roi-budget"
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold">
            <TrendingUp className="h-5 w-5 text-brand-strong" /> Gains estimés sur 1 an
          </h3>
          <div className="space-y-3 text-sm">
            <Row label="Gains de productivité" value={productivity} />
            <Row label="Réduction des erreurs" value={errors} />
            <div className="border-t border-border pt-3">
              <Row label="Total des gains" value={total} bold />
            </div>
            <div className="mt-4 rounded-xl bg-brand-soft p-4 text-center">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                ROI estimé
              </div>
              <div className="font-display text-4xl font-extrabold text-gradient-cyan">{roi}%</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Estimations indicatives basées sur des moyennes sectorielles.
          </p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Button asChild className="gradient-cyan text-primary-foreground">
          <Link to="/devis">
            Demander un devis personnalisé <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}

function Row({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-bold" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value.toLocaleString("fr-FR")} FCFA</span>
    </div>
  );
}
