import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { QUICK_ACTIONS } from "@/lib/account-actions";
import { useAccount } from "@/lib/account-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/espace/nouvelle-demande")({
  component: NouvelleDemande,
});

function NouvelleDemande() {
  const { member } = useAccount();
  // Les démarches du type de compte d'abord, les autres ensuite.
  const actions = [...QUICK_ACTIONS].sort(
    (a, b) =>
      Number(Boolean(b.audience === member?.accountType)) -
      Number(Boolean(a.audience === member?.accountType)),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle demande</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choisissez une démarche : vos coordonnées sont pré-remplies et la demande apparaîtra dans
          « Mes demandes ».
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action, index) => (
          <Link
            key={action.to}
            to={action.to}
            className={cn(
              "group relative flex min-h-40 flex-col overflow-hidden rounded-2xl border p-5 transition hover:-translate-y-0.5",
              index === 0
                ? "border-transparent bg-gradient-to-br from-navy-deep via-navy to-[oklch(0.34_0.08_235)]"
                : "border-border bg-card hover:border-brand/50",
            )}
          >
            {index === 0 && (
              <div className="pointer-events-none absolute -right-10 -bottom-16 h-40 w-40 rounded-full bg-cyan/30 blur-2xl" />
            )}
            <div className="relative flex items-start justify-between">
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl",
                  index === 0 ? "bg-white/10 text-cyan" : "bg-brand-soft text-brand-strong",
                )}
              >
                <action.icon className="h-5 w-5" />
              </span>
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border transition group-hover:rotate-45",
                  index === 0 ? "border-white bg-white text-navy-deep" : "border-foreground/20",
                )}
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <div className="relative mt-auto pt-6">
              <h2 className="text-lg font-semibold">{action.label}</h2>
              <p className={cn("text-sm", index === 0 ? "text-white/70" : "text-muted-foreground")}>
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
