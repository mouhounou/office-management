import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "fr";

  const change = (lng: "fr" | "en") => {
    i18n.changeLanguage(lng);
    if (typeof document !== "undefined") document.documentElement.lang = lng;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t("language.switchTo")} className="gap-1">
          <Globe className="h-4 w-4" />
          {!compact && <span className="text-xs font-semibold uppercase">{current}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => change("fr")} className={current === "fr" ? "font-bold" : ""}>
          🇫🇷 {t("language.fr")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => change("en")} className={current === "en" ? "font-bold" : ""}>
          🇬🇧 {t("language.en")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
