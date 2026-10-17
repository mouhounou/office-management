import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | null, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

/** « il y a 3 h » pour les flux récents. */
export function timeAgo(value?: string | null) {
  if (!value) return "";
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
  if (seconds < 60) return "à l'instant";
  if (seconds < 3600) return rtf.format(-Math.round(seconds / 60), "minute");
  if (seconds < 86400) return rtf.format(-Math.round(seconds / 3600), "hour");
  if (seconds < 86400 * 30) return rtf.format(-Math.round(seconds / 86400), "day");
  return formatDate(value);
}

export function formatBytes(bytes?: number | null) {
  if (!bytes) return "—";
  const units = ["o", "Ko", "Mo", "Go"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit ? 1 : 0)} ${units[unit]}`;
}

/** Valeur `<input type="date">` à partir d'une date ISO. */
export function toDateInput(value?: string | null) {
  return value ? String(value).slice(0, 10) : "";
}
