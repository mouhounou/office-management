import { Link, useLoaderData } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { NewsletterSignup } from "@/components/NewsletterSignup";

type FooterLink = { to: string; label: string };

function LinkList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="space-y-2.5 text-sm">
      {links.map((l) => (
        <li key={l.to}>
          <Link
            to={l.to}
            className="group inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4" />
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

const FALLBACK = {
  email: "hassanakiana@gmail.com",
  phone: "06 948 09 05",
  address: "Songolo, BP 97116, Pointe-Noire, Congo",
  hours: "Lun – Ven : 8h – 17h",
  rccm: "CG-PNR 01-25-A11-00062",
  niu: "P24000000506144",
  approval: "Nº 123 MJSECFQE/CAB/DGFQE/DDFQE-PN/SD",
  facebook: "https://www.facebook.com/share/1NiHHG8bHe/",
  instagram: "https://www.instagram.com/officemanagement2278",
  tiktok: "https://www.tiktok.com/@officemanagement93",
  linkedin: "",
};

export function Footer() {
  const { t } = useTranslation();
  // Coordonnées administrées depuis le back-office (écran Paramètres du site).
  const { settings } = useLoaderData({ from: "__root__" });
  const contact = { ...FALLBACK, ...(settings?.contact ?? {}) };
  const legal = { ...FALLBACK, ...(settings?.legal ?? {}) };
  const social = { ...FALLBACK, ...(settings?.social ?? {}) };
  const telHref = `tel:${(contact.phone ?? "").replace(/[^+d]/g, "")}`;

  const explore: FooterLink[] = [
    { to: "/business-center", label: t("nav.businessCenter") },
    { to: "/nos-experts", label: "Nos experts" },
    { to: "/centre-competences", label: "Centre de compétences" },
    { to: "/academy-tv", label: "Academy TV" },
    { to: "/calculateur-roi", label: "Calculateur ROI" },
  ];

  const institutional: FooterLink[] = [
    { to: "/references", label: "Nos références" },
    { to: "/partenaires-recruteurs", label: "Partenaires recruteurs" },
    { to: "/laureats", label: "Mur des lauréats" },
    { to: "/salle-de-presse", label: "Salle de presse" },
    { to: "/rapport-annuel", label: "Rapport annuel" },
    { to: "/objectifs-2030", label: "Objectifs 2030" },
  ];

  const socials = [
    { href: social.facebook, label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
    { href: social.instagram, label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { href: social.tiktok, label: "TikTok", icon: <span className="text-xs font-bold">TT</span> },
    ...(social.linkedin
      ? [{ href: social.linkedin, label: "LinkedIn", icon: <span className="text-xs font-bold">in</span> }]
      : []),
    // Un réseau vidé dans l'administration disparaît du pied de page.
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-[oklch(0.11_0.035_255)]">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[42rem] rounded-full bg-primary/10 blur-3xl" />

      {/* Main grid */}
      <div className="relative container mx-auto px-4 pt-16 pb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Office Management" className="h-12 w-12 rounded-md" width={48} height={48} loading="lazy" />
            <div>
              <div className="font-display font-bold text-gradient-cyan">OFFICE MANAGEMENT</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">HR Consulting</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-sm leading-relaxed">{t("footer.tagline")}</p>

          <div className="flex gap-2.5 mb-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="h-10 w-10 rounded-full border border-border bg-card/40 flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card/30 p-4 text-xs text-muted-foreground/80 space-y-1">
            <div>RCCM : {legal.rccm}</div>
            <div>NIU : {legal.niu}</div>
            <div>Agrément : {legal.approval}</div>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-foreground">{t("footer.explore")}</h4>
          <LinkList links={explore} />
        </div>

        {/* Institutional */}
        <div>
          <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-foreground">{t("footer.institutional")}</h4>
          <LinkList links={institutional} />
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-foreground">{t("footer.contact")}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {contact.address}
            </li>
            <li>
              <a href={telHref} className="flex items-center gap-2.5 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary shrink-0" /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary shrink-0" /> {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-primary shrink-0" /> {contact.hours}
            </li>
          </ul>

          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            {t("footer.contact")} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Newsletter */}
      <div className="relative container mx-auto px-4 pb-12">
        <NewsletterSignup source="footer" />
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-border">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 OFFICE MANAGEMENT — Human Resources Consulting. {t("footer.rights")}</span>
          <span className="flex items-center gap-4">
            <Link to="/faq" className="hover:text-primary transition-colors">{t("nav.faq")}</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">{t("footer.contact")}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
