import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, ArrowRight, UserRound } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAccount } from "@/lib/account-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = { to: string; label: string };
type NavGroup = { label: string; items: NavItem[] };

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { member } = useAccount();

  const groups: NavGroup[] = [
    {
      label: t("nav.about"),
      items: [
        { to: "/", label: t("nav.home") },
        { to: "/a-propos", label: t("nav.about") },
        { to: "/poles", label: t("nav.poles") },
        { to: "/realisations", label: t("nav.achievements") },
        { to: "/certifications", label: t("nav.certifications") },
      ],
    },
    {
      label: t("nav.services"),
      items: [
        { to: "/services", label: t("nav.services") },
        { to: "/secteurs", label: t("nav.sectors") },
        { to: "/business-center", label: t("nav.businessCenter") },
        { to: "/packs-pme", label: t("nav.smepacks") },
        { to: "/processus", label: t("nav.methodology") },
      ],
    },
    {
      label: t("nav.trainings"),
      items: [
        { to: "/formations", label: t("nav.trainings") },
        { to: "/pre-inscription", label: t("nav.preregistration") },
      ],
    },
    {
      label: t("nav.recruitment"),
      items: [{ to: "/recrutement", label: t("nav.recruitment") }],
    },
    {
      label: t("nav.resources", "Ressources"),
      items: [
        { to: "/blog", label: t("nav.news") },
        { to: "/telechargements", label: t("nav.downloads") },
        { to: "/faq", label: t("nav.faq") },
        { to: "/contact", label: t("nav.contact") },
      ],
    },
  ];

  const itemClass =
    "block rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors";
  const activeItemClass =
    "block rounded-lg px-3 py-2 text-sm font-medium text-primary bg-primary/10";

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Office Management" className="h-11 w-11 rounded-md" width={44} height={44} />
          <div className="leading-tight">
            <div className="font-display text-sm font-bold uppercase tracking-wider text-gradient-cyan">Office Management</div>
            <div className="hidden sm:block text-[10px] uppercase tracking-widest text-muted-foreground">Human Resources Consulting</div>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {/* Espace client : « Mon espace » une fois connecté, sinon « Connexion ». */}
          <Button asChild variant="outline" size="sm" className="gap-2 border-primary/30">
            <Link to={member ? "/espace" : "/connexion"} aria-label={member ? t("nav.myAccount") : t("nav.login")}>
              <UserRound className="h-4 w-4" />
              <span className="hidden md:inline">{member ? t("nav.myAccount") : t("nav.login")}</span>
            </Link>
          </Button>
          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex gradient-cyan text-primary-foreground font-semibold hover:opacity-90">
            <Link to="/devis">{t("nav.requestQuote")}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-primary/30">
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.menu")}</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 bg-background/95 backdrop-blur-xl">
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border text-left">
                <SheetTitle className="flex items-center gap-3">
                  <img src={logo} alt="" className="h-9 w-9 rounded-md" width={36} height={36} />
                  <span className="font-display text-base font-bold uppercase tracking-wider text-gradient-cyan">Office Management</span>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
                {groups.map((group) => (
                  <div key={group.label}>
                    <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{group.label}</div>
                    <div className="flex flex-col">
                      {group.items.map((it) => (
                        <Link
                          key={it.to}
                          to={it.to}
                          onClick={() => setOpen(false)}
                          className={itemClass}
                          activeProps={{ className: activeItemClass }}
                        >
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="border-t border-border p-4">
                <Button asChild className="w-full gradient-cyan text-primary-foreground font-semibold hover:opacity-90">
                  <Link to="/devis" onClick={() => setOpen(false)}>{t("nav.requestQuote")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
