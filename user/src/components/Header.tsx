import { Link, useLoaderData, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ChevronDown, Menu, Phone, UserRound } from "lucide-react";

import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAccount } from "@/lib/account-context";
import { cn } from "@/lib/utils";

type NavItem = { to: string; hash?: string; label: string };
type NavGroup = { label: string; to?: string; items: NavItem[] };

/**
 * En-tête du site : barre blanche fixe, menus déroulants au survol sur grand
 * écran, menu latéral complet sur mobile. L'ombre apparaît au défilement.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const { member } = useAccount();
  const { pathname } = useLocation();
  const { settings } = useLoaderData({ from: "__root__" });
  const phone = settings?.contact?.phone ?? "06 948 09 05";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Les anciennes pages secondaires sont désormais des sections (ancres).
  const groups: NavGroup[] = [
    {
      label: t("nav.about"),
      to: "/a-propos",
      items: [
        { to: "/a-propos", label: t("nav.about") },
        { to: "/a-propos", hash: "engagements", label: t("nav.commitments", "Nos engagements") },
        { to: "/a-propos", hash: "qualite", label: t("nav.certifications") },
        { to: "/realisations", label: t("nav.achievements") },
      ],
    },
    {
      label: t("nav.services"),
      to: "/services",
      items: [
        { to: "/services", label: t("nav.services") },
        { to: "/services", hash: "secteurs", label: t("nav.sectors") },
        { to: "/business-center", label: t("nav.businessCenter") },
        { to: "/offres", label: t("nav.offers", "Offres & tarifs") },
      ],
    },
    {
      label: t("nav.trainings"),
      to: "/formations",
      items: [
        { to: "/formations", label: t("nav.trainings") },
        { to: "/pre-inscription", label: t("nav.preregistration") },
      ],
    },
    {
      label: t("nav.recruitment"),
      to: "/recrutement",
      items: [{ to: "/recrutement", label: t("nav.recruitment") }],
    },
    {
      label: t("nav.resources", "Ressources"),
      items: [
        { to: "/blog", label: t("nav.news") },
        { to: "/blog", hash: "telechargements", label: t("nav.downloads") },
        { to: "/faq", label: t("nav.faq") },
      ],
    },
    {
      label: t("nav.contact"),
      to: "/contact",
      items: [{ to: "/contact", label: t("nav.contact") }],
    },
  ];

  const isActive = (group: NavGroup) =>
    group.items.some(
      (item) => item.to === pathname || (item.to !== "/" && pathname.startsWith(`${item.to}/`)),
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl transition-shadow",
        scrolled
          ? "border-border shadow-[0_8px_30px_-18px_oklch(0.22_0.05_255/0.35)]"
          : "border-transparent",
      )}
    >
      <div className="container mx-auto flex h-[4.5rem] items-center gap-3 px-4 2xl:gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img
            src={logo}
            alt="Office Management"
            className="h-11 w-11 rounded-lg"
            width={44}
            height={44}
          />
          <div className="leading-tight">
            <div className="font-display text-sm font-extrabold tracking-wide text-foreground uppercase">
              Office Management
            </div>
            <div className="hidden text-[10px] tracking-[0.2em] text-muted-foreground uppercase sm:block">
              Human Resources Consulting
            </div>
          </div>
        </Link>

        {/* Navigation principale (grand écran) */}
        <nav
          className="hidden flex-1 items-center justify-center gap-0.5 xl:flex"
          aria-label="Navigation principale"
        >
          <Link
            to="/"
            className={cn(
              "relative px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:text-primary 2xl:px-3",
              pathname === "/" ? "text-primary" : "text-foreground/80",
            )}
          >
            {t("nav.home")}
            {pathname === "/" && (
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
          {groups.map((group) =>
            group.items.length === 1 && group.to ? (
              <Link
                key={group.label}
                to={group.to}
                className={cn(
                  "relative px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:text-primary 2xl:px-3",
                  isActive(group) ? "text-primary" : "text-foreground/80",
                )}
              >
                {group.label}
                {isActive(group) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ) : (
              <div key={group.label} className="group relative">
                <button
                  className={cn(
                    "relative flex items-center gap-1 px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors 2xl:px-3 group-hover:text-primary group-focus-within:text-primary",
                    isActive(group) ? "text-primary" : "text-foreground/80",
                  )}
                  aria-haspopup="true"
                >
                  {group.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  {isActive(group) && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                  )}
                </button>
                <div className="invisible absolute top-full left-1/2 z-50 w-60 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-2xl border border-border bg-popover p-2 shadow-card">
                    {group.items.map((item) => (
                      <Link
                        key={item.to + (item.hash ?? "")}
                        to={item.to}
                        hash={item.hash}
                        activeOptions={{ includeHash: true }}
                        className="block rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
                        activeProps={{ className: "bg-accent text-primary font-medium" }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <a
            href={`tel:${phone.replace(/[^+\d]/g, "")}`}
            className="mr-2 hidden items-center gap-2.5 2xl:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
              <Phone className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-foreground">{phone}</span>
              <span className="block text-[11px] text-muted-foreground">Lun – Ven, 8h – 17h</span>
            </span>
          </a>
          <Link
            to={member ? "/espace" : "/connexion"}
            aria-label={member ? t("nav.myAccount") : t("nav.login")}
            title={member ? t("nav.myAccount") : t("nav.login")}
            className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
          >
            <UserRound className="h-4 w-4" />
            <span className="hidden md:inline xl:hidden 2xl:inline">
              {member ? t("nav.myAccount") : t("nav.login")}
            </span>
          </Link>
          <Link
            to="/devis"
            className="hidden h-10 items-center gap-1.5 rounded-full gradient-cyan px-5 text-sm font-semibold whitespace-nowrap text-primary-foreground shadow-sm transition hover:opacity-90 sm:inline-flex"
          >
            {/* Libellé court entre 1280 et 1536 px, où la navigation complète prend la place. */}
            <span className="xl:hidden 2xl:inline">{t("nav.requestQuote")}</span>
            <span className="hidden xl:inline 2xl:hidden">Devis</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full xl:hidden"
                aria-label={t("nav.menu")}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-full flex-col bg-background p-0 sm:max-w-md"
            >
              <SheetHeader className="border-b border-border px-6 pt-6 pb-4 text-left">
                <SheetTitle className="flex items-center gap-3">
                  <img src={logo} alt="" className="h-9 w-9 rounded-md" width={36} height={36} />
                  <span className="font-display text-base font-bold tracking-wide uppercase">
                    Office Management
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-5">
                <Link
                  to="/"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-primary"
                  activeProps={{ className: "bg-accent text-primary" }}
                  activeOptions={{ exact: true }}
                >
                  {t("nav.home")}
                </Link>
                {groups.map((group) => (
                  <div key={group.label}>
                    <div className="px-3 pb-1 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                      {group.label}
                    </div>
                    {group.items.map((item) => (
                      <Link
                        key={item.to + (item.hash ?? "")}
                        to={item.to}
                        hash={item.hash}
                        activeOptions={{ includeHash: true }}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-primary"
                        activeProps={{ className: "bg-accent text-primary" }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
              <div className="space-y-2 border-t border-border p-4">
                <Link
                  to="/devis"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full gradient-cyan text-sm font-semibold text-primary-foreground"
                >
                  {t("nav.requestQuote")} <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-medium"
                >
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
