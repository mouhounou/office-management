import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OffresSpeciales } from "@/components/sections/offres/OffresSpeciales";
import { NavyBand } from "@/components/sections/NavyBand";
import { PacksPme } from "@/components/sections/offres/PacksPme";
import { poles, type Pack } from "@/components/sections/offres/poles";
import { Clock, CheckCircle2, ArrowRight, Star, Building2, Tag } from "lucide-react";

const DARK_POLES = new Set(["additionnels"]);

export const Route = createFileRoute("/offres")({
  head: () => ({
    meta: [
      { title: "Nos offres & packs — Office Management" },
      {
        name: "description",
        content:
          "Packs par pôle (formation, mise à disposition, maintenance, conseil RH, logiciels), packs RH clé en main pour PME et offres spéciales : réductions étudiants, groupes et entreprises.",
      },
      { property: "og:title", content: "Offres & packs — Office Management" },
      {
        property: "og:description",
        content: "Des formules claires avec durée indicative et tarifs à partir de.",
      },
    ],
  }),
  component: Offres,
});

function PackCard({ p }: { p: Pack }) {
  return (
    <Card
      className={`relative rounded-2xl border-border bg-card shadow-card p-7 hover-lift flex flex-col h-full ${
        p.highlight ? "border-primary/60 shadow-elegant lg:scale-[1.03]" : ""
      }`}
    >
      {p.badge && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-cyan text-primary-foreground border-0 px-3 py-1 text-xs font-semibold shadow-elegant">
          <Star className="h-3 w-3 mr-1" /> {p.badge}
        </Badge>
      )}
      <h3 className="font-display text-xl font-bold mb-1">{p.name}</h3>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Clock className="h-3 w-3" /> {p.duration}
      </div>
      <p className="text-sm text-muted-foreground mb-5">{p.desc}</p>
      <div className="mb-5">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">à partir de</div>
        <div className="font-display text-2xl font-extrabold text-gradient-cyan">{p.price}</div>
      </div>
      <ul className="space-y-2 mb-6 flex-1">
        {p.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        className={p.highlight ? "gradient-cyan text-primary-foreground glow-cyan" : ""}
        variant={p.highlight ? "default" : "outline"}
      >
        <Link to="/devis">
          Choisir ce pack <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </Card>
  );
}

function Offres() {
  return (
    <>
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="eyebrow mb-3">Nos offres</span>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">
            Packs & formules par pôle
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Des formules structurées, transparentes et modulables. Tarifs indicatifs « à partir de »
            — devis personnalisé sous 48h.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {poles.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="glass rounded-full px-4 py-1.5 text-sm hover:text-primary transition flex items-center gap-2"
              >
                <p.icon className="h-3.5 w-3.5" /> {p.title}
              </a>
            ))}
            <a
              href="#packs-pme"
              className="glass rounded-full px-4 py-1.5 text-sm hover:text-primary transition flex items-center gap-2"
            >
              <Building2 className="h-3.5 w-3.5" /> Packs PME
            </a>
            <a
              href="#offres-speciales"
              className="glass rounded-full px-4 py-1.5 text-sm hover:text-primary transition flex items-center gap-2"
            >
              <Tag className="h-3.5 w-3.5" /> Offres spéciales
            </a>
          </div>
        </div>
      </section>

      {poles.map((pole) => {
        const content = (
          <>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-xl gradient-cyan flex items-center justify-center">
                <pole.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-bold">{pole.title}</h2>
            </div>
            <p className="text-muted-foreground mb-10 max-w-2xl">{pole.intro}</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
              {pole.packs.map((p) => (
                <PackCard key={p.name} p={p} />
              ))}
            </div>
          </>
        );
        return DARK_POLES.has(pole.id) ? (
          <NavyBand key={pole.id} id={pole.id}>
            {content}
          </NavyBand>
        ) : (
          <section key={pole.id} id={pole.id} className="container mx-auto px-4 py-16 scroll-mt-24">
            {content}
          </section>
        );
      })}

      <PacksPme />
      <OffresSpeciales />

      <Section className="pt-0!">
        <Card className="rounded-2xl bg-card shadow-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 bg-primary/30 blur-3xl rounded-full" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Besoin d'un pack sur mesure ?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Tous nos packs sont modulables. Décrivez-nous votre contexte, nous construisons une
              offre dédiée.
            </p>
            <Button asChild size="lg" className="gradient-cyan text-primary-foreground glow-cyan">
              <Link to="/devis">Construire mon offre sur mesure</Link>
            </Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
