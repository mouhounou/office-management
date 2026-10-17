import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Briefcase,
  Building2,
  ExternalLink,
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

import { NotificationMenu } from "@/components/layout/NotificationMenu";
import { Button } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: LucideIcon; badge?: "businessRequests" | "quotes" | "preRegistrations" | "applications" | "messages"; admin?: boolean };

const NAV: { title?: string; items: NavItem[] }[] = [
  { items: [{ to: "/", label: "Tableau de bord", icon: LayoutDashboard }] },
  {
    title: "Demandes",
    items: [
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
    ],
  },
  {
    title: "Relations",
    items: [
      { to: "/companies", label: "Entreprises", icon: Building2 },
      { to: "/subscribers", label: "Newsletter", icon: Users },
    ],
  },
  {
    title: "Administration",
    items: [
      { to: "/users", label: "Utilisateurs", icon: UserCog, admin: true },
      { to: "/settings", label: "Paramètres du site", icon: Settings },
    ],
  },
];

type DashboardCounts = { counts: Record<string, { pending?: number }> };

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
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link to="/" className="flex items-center gap-3 px-5 py-5">
        <img src="/logo.png" alt="" className="h-9 w-9 rounded-lg bg-white/95 object-contain p-0.5" />
        <div className="leading-tight">
          <div className="font-display text-sm font-bold tracking-wider text-cyan uppercase">Office Management</div>
          <div className="text-[10px] tracking-[0.2em] text-sidebar-muted uppercase">Back-office</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV.map((section, index) => (
          <div key={section.title ?? index}>
            {section.title && <div className="mb-1.5 px-3 text-[11px] font-semibold tracking-wider text-sidebar-muted uppercase">{section.title}</div>}
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
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                            isActive ? "bg-sidebar-active font-medium text-white shadow-[inset_3px_0_0_var(--cyan)]" : "text-sidebar-muted hover:bg-white/5 hover:text-white",
                          )
                        }
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {pending ? <span className="rounded-full bg-cyan px-1.5 py-0.5 text-[10px] leading-none font-bold text-navy-deep">{pending}</span> : null}
                      </NavLink>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <a href={import.meta.env.VITE_SITE_URL ?? "http://localhost:8080"} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-muted transition hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4 w-4" /> Voir le site
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85%] shadow-2xl">
            {sidebar}
            <button className="absolute top-5 right-3 rounded-lg p-1 text-white/70 hover:text-white" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
              <X className="h-5 w-5" />
            </button>
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
        <ThemeToggle />
        <NotificationMenu />
        <UserMenu name={user?.fullName ?? ""} role={user?.role ?? "viewer"} onLogout={logout} />
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}>
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function UserMenu({ name, role, onLogout }: { name: string; role: string; onLogout: () => Promise<void> }) {
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
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-3 rounded-lg py-1 pr-2 pl-1 transition hover:bg-muted" aria-haspopup="menu" aria-expanded={open}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-xs font-bold text-white">{initials || "?"}</span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-medium">{name}</span>
          <span className="block text-xs text-muted-foreground">{ROLES[role]?.label ?? role}</span>
        </span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div role="menu" className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
            <button role="menuitem" className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted" onClick={() => { setOpen(false); navigate("/profile"); }}>
              <UserCog className="h-4 w-4" /> Mon profil
            </button>
            <button role="menuitem" className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted" onClick={() => { setOpen(false); navigate("/notifications"); }}>
              <Bell className="h-4 w-4" /> Notifications
            </button>
            <div className="my-1 border-t border-border" />
            <button role="menuitem" className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-destructive hover:bg-muted" onClick={() => onLogout()}>
              <LogOut className="h-4 w-4" /> Se déconnecter
            </button>
          </div>
        </>
      )}
    </div>
  );
}
