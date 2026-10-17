import { Link, useLoaderData } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

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
            className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-3" />
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

/** Pied de page navy, comme la maquette : marque, liens, services, contact. */
export function Footer() {
  const { t } = useTranslation();
  // Coordonnées administrées depuis le back-office (écran Paramètres du site).
  const { settings } = useLoaderData({ from: "__root__" });
  const contact = { ...FALLBACK, ...(settings?.contact ?? {}) };
  const legal = { ...FALLBACK, ...(settings?.legal ?? {}) };
  const social = { ...FALLBACK, ...(settings?.social ?? {}) };
  const telHref = `tel:${(contact.phone ?? "").replace(/[^+\d]/g, "")}`;

  const quickLinks: FooterLink[] = [
    { to: "/a-propos", label: t("nav.about") },
    { to: "/realisations", label: t("nav.achievements") },
    { to: "/blog", label: t("nav.news") },
    { to: "/references", label: "Nos références" },
    { to: "/faq", label: t("nav.faq") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const services: FooterLink[] = [
    { to: "/formations", label: "Formation professionnelle" },
    { to: "/recrutement", label: "Recrutement & personnel" },
    { to: "/technical-services", label: "Prestations techniques" },
    { to: "/om-consulting", label: "Conseil RH" },
    { to: "/business-center", label: t("nav.businessCenter") },
    { to: "/packs-pme", label: t("nav.smepacks") },
  ];

  const socials = [
    { href: social.facebook, label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
    { href: social.instagram, label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { href: social.tiktok, label: "TikTok", icon: <span className="text-xs font-bold">TT</span> },
    ...(social.linkedin
      ? [
          {
            href: social.linkedin,
            label: "LinkedIn",
            icon: <span className="text-xs font-bold">in</span>,
          },
        ]
      : []),
    // Un réseau vidé dans l'administration disparaît du pied de page.
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="theme-dark relative overflow-hidden bg-navy-deep">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" />

      <div className="relative container mx-auto grid gap-10 px-4 pt-16 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="mb-4 flex items-center gap-3">
            <img
              src={logo}
              alt="Office Management"
              className="h-12 w-12 rounded-lg bg-white p-0.5"
              width={48}
              height={48}
              loading="lazy"
            />
            <div>
              <div className="font-display font-extrabold tracking-wide uppercase">
                Office Management
              </div>
              <div className="text-[10px] tracking-widest text-muted-foreground uppercase">
                Human Resources Consulting
              </div>
            </div>
          </Link>
          <p className="mb-2 text-sm font-semibold">Former. Recruter. Accompagner.</p>
          <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("footer.tagline")}
          </p>
          <div className="flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/40 text-foreground/80 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold tracking-wider uppercase">
            Liens rapides
          </h4>
          <LinkList links={quickLinks} />
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold tracking-wider uppercase">
            {t("footer.services")}
          </h4>
          <LinkList links={services} />
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold tracking-wider uppercase">
            {t("footer.contact")}
          </h4>
          <ul className="space-y-3.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {contact.address}
            </li>
            <li>
              <a
                href={telHref}
                className="flex items-center gap-3 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary" /> {contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 break-all transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary" /> {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-primary" /> {contact.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="relative container mx-auto px-4 pb-12">
        <NewsletterSignup source="footer" />
      </div>

      <div className="relative border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-muted-foreground lg:flex-row lg:text-left">
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} Office Management — Human Resources Consulting.{" "}
            {t("footer.rights")}
          </span>
          <span>
            RCCM {legal.rccm} · NIU {legal.niu} · Agrément {legal.approval}
          </span>
        </div>
      </div>
    </footer>
  );
}
