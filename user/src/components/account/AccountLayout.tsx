import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  FilePlus2,
  FolderOpen,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  ShieldCheck,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";

import logo from "@/assets/logo.png";
import { initials, LoadingBlock } from "@/components/account/ui";
import { useAccount } from "@/lib/account-context";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean };

const NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Menu",
    items: [
      { to: "/espace", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
      { to: "/espace/demandes", label: "Mes demandes", icon: FolderOpen },
      { to: "/espace/nouvelle-demande", label: "Nouvelle demande", icon: FilePlus2 },
    ],
  },
  {
    title: "Compte",
    items: [
      { to: "/espace/profil", label: "Mon profil", icon: UserRound },
      { to: "/espace/securite", label: "Sécurité", icon: ShieldCheck },
    ],
  },
];

/**
 * Cadre de l'espace client, même design que le back-office : barre latérale
 * en panneau arrondi avec indicateur cyan, en-tête et contenu dans un second
 * panneau. Réservé aux visiteurs connectés.
 */
export function AccountLayout() {
  const { member, loading, logout } = useAccount();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    // Seulement sur une page de l'espace : pendant la navigation vers /connexion,
    // l'effet ne doit pas se relancer et écraser le chemin de retour.
    if (!loading && !member && location.pathname.startsWith("/espace")) {
      navigate({ to: "/connexion", search: { redirect: location.pathname }, replace: true });
    }
  }, [loading, member, navigate, location.pathname]);

  if (loading || !member) {
    return (
      <div className="theme-dark flex min-h-screen items-center justify-center bg-background">
        <LoadingBlock label="Ouverture de votre espace…" />
      </div>
    );
  }

  const isActive = (item: NavItem) =>
    item.exact
      ? location.pathname === item.to || location.pathname === `${item.to}/`
      : location.pathname.startsWith(item.to);

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-3 px-6 pt-6 pb-5">
        <img
          src={logo}
          alt=""
          className="h-10 w-10 rounded-xl bg-white object-contain p-0.5"
          width={40}
          height={40}
        />
        <div className="leading-tight">
          <div className="font-display text-sm font-bold tracking-wide">Office Management</div>
          <div className="text-[11px] text-muted-foreground">Espace client</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
        {NAV.map((section) => (
          <div key={section.title}>
            <div className="mb-2 px-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                        active
                          ? "font-semibold text-foreground before:absolute before:top-1/2 before:-left-4 before:h-7 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-brand"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <item.icon
                        className={cn("h-[18px] w-[18px] shrink-0", active && "text-brand-strong")}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {section.title === "Compte" && (
                <li>
                  <button
                    onClick={async () => {
                      await logout();
                      navigate({ to: "/connexion" });
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <LogOut className="h-[18px] w-[18px]" /> Se déconnecter
                  </button>
                </li>
              )}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl bg-navy-deep p-4">
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full border-[14px] border-cyan/20" />
          <div className="relative">
            <MessageCircle className="mb-3 h-7 w-7 text-cyan" />
            <p className="text-sm font-semibold text-white">Une question ?</p>
            <p className="mt-0.5 text-xs text-white/60">
              Notre équipe vous répond du lundi au vendredi.
            </p>
            <Link
              to="/contact"
              className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-cyan py-2 text-xs font-semibold text-navy-deep transition hover:bg-cyan-glow"
            >
              Nous contacter <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="theme-dark min-h-screen bg-background lg:flex lg:gap-4 lg:p-4">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-hidden rounded-3xl border border-border bg-surface">
          {sidebar}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85%] bg-surface shadow-2xl">
            {sidebar}
            <button
              className="absolute top-6 right-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1 bg-surface lg:rounded-3xl lg:border lg:border-border">
        <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6 lg:top-4 lg:rounded-t-3xl">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <Link
            to="/"
            className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm transition hover:bg-muted"
            aria-label="Retour au site"
          >
            <Globe className="h-4 w-4" /> <span className="hidden sm:inline">Retour au site</span>
          </Link>
          <Link
            to="/espace/profil"
            className="flex items-center gap-3 rounded-full py-1 pr-1 pl-1 transition hover:bg-muted sm:pr-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-navy to-cyan text-xs font-bold text-white">
              {initials(member.fullName)}
            </span>
            <span className="hidden text-left leading-tight md:block">
              <span className="block text-sm font-semibold">{member.fullName}</span>
              <span className="block text-xs text-muted-foreground">{member.email}</span>
            </span>
          </Link>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
