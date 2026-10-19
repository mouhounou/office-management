import { useEffect, useRef, useState } from "react";

/** Découpe « 2 500+ » en { préfixe, nombre, suffixe } ; null si rien à compter. */
function parse(value: string) {
  const match = value.match(/^(\D*)(\d[\d\s]*\d|\d)(.*)$/);
  if (!match) return null;
  const target = Number(match[2].replace(/\D/g, ""));
  return Number.isFinite(target)
    ? { prefix: match[1], target, suffix: match[3], grouped: /\D/.test(match[2]) }
    : null;
}

const format = (n: number, grouped: boolean) => (grouped ? n.toLocaleString("fr-FR") : String(n));

/**
 * Chiffre clé qui compte de 0 à sa valeur quand il entre à l'écran. Le rendu
 * pré-généré affiche la valeur finale : rien ne manque sans JavaScript.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const parts = parse(value);
    const element = ref.current;
    if (!parts || !element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(
            `${parts.prefix}${format(Math.round(parts.target * eased), parts.grouped)}${parts.suffix}`,
          );
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
