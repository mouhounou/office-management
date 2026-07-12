import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/calculateur-roi")({
  head: () => ({
    meta: [
      { title: "Calculateur ROI formation — Office Management" },
      { name: "description", content: "Estimez le retour sur investissement de vos formations : productivité, réduction d'erreurs, performance." },
    ],
  }),
  component: Page,
});

function Page() {
  const [employees, setEmployees] = useState(10);
  const [budget, setBudget] = useState(500000);
  const productivity = Math.round(employees * 150000 * 0.15);
  const errors = Math.round(employees * 80000 * 0.20);
  const total = productivity + errors;
  const roi = budget > 0 ? Math.round(((total - budget) / budget) * 100) : 0;

  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Calculator className="h-10 w-10 text-primary mx-auto mb-4" />
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Outil entreprises</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Calculateur de ROI formation</h1>
          <p className="text-muted-foreground text-lg">Estimez les gains potentiels d'une formation pour votre entreprise.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="p-6 gradient-card border-border">
            <h3 className="font-display text-xl font-bold mb-6">Vos données</h3>
            <div className="space-y-4">
              <div>
                <Label>Nombre d'employés à former</Label>
                <Input type="number" min={1} value={employees} onChange={e => setEmployees(Math.max(1, Number(e.target.value) || 1))} />
              </div>
              <div>
                <Label>Budget formation (FCFA)</Label>
                <Input type="number" min={0} value={budget} onChange={e => setBudget(Math.max(0, Number(e.target.value) || 0))} />
              </div>
            </div>
          </Card>
          <Card className="p-6 gradient-card border-border">
            <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Gains estimés sur 1 an</h3>
            <div className="space-y-3 text-sm">
              <Row label="Gains de productivité" value={productivity} />
              <Row label="Réduction des erreurs" value={errors} />
              <div className="border-t border-border pt-3">
                <Row label="Total des gains" value={total} bold />
              </div>
              <div className="bg-primary/10 rounded-lg p-4 mt-4 text-center">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">ROI estimé</div>
                <div className="font-display text-4xl font-extrabold text-gradient-cyan">{roi}%</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Estimations indicatives basées sur des moyennes sectorielles.</p>
          </Card>
        </div>
        <div className="text-center mt-8">
          <Button asChild className="gradient-cyan text-primary-foreground"><a href="/devis">Demander un devis personnalisé</a></Button>
        </div>
      </Section>
    </>
  );
}

function Row({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold text-base" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value.toLocaleString("fr-FR")} FCFA</span>
    </div>
  );
}
