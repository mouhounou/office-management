import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Bell,
  Briefcase,
  Building2,
  GraduationCap,
  Handshake,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  Newspaper,
  Receipt,
  Settings,
  Sun,
  UserCheck,
  UserCog,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { NotificationMenu } from "@/components/layout/NotificationMenu";
import { Button } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: "businessRequests" | "quotes" | "preRegistrations" | "applications" | "messages";
  admin?: boolean;
};

const NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Menu",
    items: [
      { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
      { to: "/business-requests", label: "Business Center", icon: Handshake, badge: "businessRequests" },
      { to: "/quotes", label: "Devis", icon: Receipt, badge: "quotes" },
      { to: "/pre-registrations", label: "Pré-inscriptions", icon: GraduationCap, badge: "preRegistrations" },
      { to: "/applications", label: "Candidatures", icon: UserCheck, badge: "applications" },
      { to: "/messages", label: "Messages", icon: Mail, badge: "messages" },
    ],
  },
  {
    title: "Contenus",
    items: [
      { to: "/offers", label: "Offres d'emploi", icon: Briefcase },
      { to: "/formations", label: "Formations", icon: GraduationCap },
      { to: "/posts", label: "Blog", icon: Newspaper },
      { to: "/media", label: "Médiathèque", icon: ImageIcon },
      { to: "/companies", label: "Entreprises", icon: Building2 },
      { to: "/subscribers", label: "Newsletter", icon: Users },
    ],
  },
  {
    title: "Général",
    items: [
      { to: "/settings", label: "Paramètres", icon: Settings },
      { to: "/users", label: "Utilisateurs", icon: UserCog, admin: true },
    ],
  },
];

type DashboardCounts = { counts: Record<string, { pending?: number }> };

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "http://localhost:8080";

export function AppLayout() {
  const { user, can, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  // Compteurs « à traiter » de la barre latérale, partagés avec le tableau de bord.
  const { data } = useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: async () => (await api.get<DashboardCounts>("/stats/dashboard")).data,
    refetchInterval: 60_000,
  });

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-3 px-6 pt-6 pb-5">
        <img src="/logo.png" alt="" className="h-10 w-10 rounded-xl bg-white object-contain p-0.5 ring-1 ring-border" />
        <div className="leading-tight">
          <div className="font-display text-sm font-bold tracking-wide">Office Management</div>
          <div className="text-[11px] text-muted-foreground">Back-office</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
        {NAV.map((section) => (
          <div key={section.title}>
            <div className="mb-2 px-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{section.title}</div>
            <ul className="space-y-0.5">
              {section.items
                .filter((item) => !item.admin || can("admin"))
                .map((item) => {
                  const pending = item.badge ? data?.counts[item.badge]?.pending : 0;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          cn(
                            "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                            isActive
                              ? "font-semibold text-foreground before:absolute before:top-1/2 before:-left-4 before:h-7 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-brand"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-brand-strong")} />
                            <span className="flex-1 truncate">{item.label}</span>
                            {pending ? (
                              <span className="rounded-md bg-navy-deep px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white dark:bg-cyan dark:text-navy-deep">
                                {pending}
                              </span>
                            ) : null}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Carte de mise en avant, comme l'encart « application mobile » de la maquette. */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl bg-navy-deep p-4 text-white">
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full border-[14px] border-cyan/20" />
          <div className="relative">
            <img src="/logo.png" alt="" className="mb-3 h-8 w-8 rounded-lg bg-white p-0.5" />
            <p className="text-sm font-semibold">Le site public</p>
            <p className="mt-0.5 text-xs text-white/60">Voyez vos contenus tels que les visiteurs les voient.</p>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-cyan py-2 text-xs font-semibold text-navy-deep transition hover:bg-cyan-glow"
            >
              Voir le site <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex lg:gap-4 lg:p-4">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-hidden rounded-3xl border border-border bg-surface">{sidebar}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85%] bg-surface shadow-2xl">
            {sidebar}
            <button className="absolute top-6 right-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
              <X className="h-5 w-5" />
            </button>
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1 bg-surface lg:rounded-3xl lg:border lg:border-border">
        <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6 lg:top-4 lg:rounded-t-3xl">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden flex-1 sm:block">
            <GlobalSearch />
          </div>
          <div className="flex-1 sm:hidden" />
          <ThemeToggle />
          <NotificationMenu />
          <UserMenu name={user?.fullName ?? ""} email={user?.email ?? ""} role={user?.role ?? "viewer"} onLogout={logout} />
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition hover:bg-muted"
    >
      {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}

function UserMenu({ name, email, role, onLogout }: { name: string; email: string; role: string; onLogout: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-3 rounded-full py-1 pr-1 pl-1 transition hover:bg-muted sm:pr-3" aria-haspopup="menu" aria-expanded={open}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-navy to-cyan text-xs font-bold text-white">{initials || "?"}</span>
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-sm font-semibold">{name}</span>
          <span className="block text-xs text-muted-foreground">{email || ROLES[role]?.label}</span>
        </span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div role="menu" className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-xl">
            <div className="px-3 py-2 text-xs text-muted-foreground">{ROLES[role]?.label ?? role}</div>
            <button role="menuitem" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted" onClick={() => { setOpen(false); navigate("/profile"); }}>
              <UserCog className="h-4 w-4" /> Mon profil
            </button>
            <button role="menuitem" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted" onClick={() => { setOpen(false); navigate("/notifications"); }}>
              <Bell className="h-4 w-4" /> Notifications
            </button>
            <div className="my-1 border-t border-border" />
            <button role="menuitem" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-destructive hover:bg-muted" onClick={() => onLogout()}>
              <LogOut className="h-4 w-4" /> Se déconnecter
            </button>
          </div>
        </>
      )}
    </div>
  );
}
