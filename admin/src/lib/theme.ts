import { useSyncExternalStore } from "react";

const KEY = "om_admin_theme";
const listeners = new Set<() => void>();

function stored() {
  try {
    const value = localStorage.getItem(KEY);
    if (value) return value === "dark";
  } catch {
    /* stockage indisponible */
  }
  // Sans préférence enregistrée, le back-office s'ouvre en mode sombre.
  return true;
}

let dark = stored();

function setDark(value: boolean) {
  dark = value;
  document.documentElement.classList.toggle("dark", value);
  try {
    localStorage.setItem(KEY, value ? "dark" : "light");
  } catch {
    /* stockage indisponible */
  }
  listeners.forEach((listener) => listener());
}

/** Applique le thème avant le premier rendu (évite un flash clair). */
export function applyStoredTheme() {
  document.documentElement.classList.toggle("dark", dark);
}

/** Mode sombre partagé par toute l'application (barre, graphiques…). */
export function useTheme() {
  const value = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => dark,
  );
  return { dark: value, toggle: () => setDark(!value) };
}
