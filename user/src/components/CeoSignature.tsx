import { useEffect, useState } from "react";
import { fetchSettings } from "@/lib/content";

type Signature = {
  signatureUrl: string | null;
  displayName: string;
  displayTitle: string;
};

// Valeurs de repli tant que l'administration n'a rien renseigné.
const DEFAULTS: Signature = {
  signatureUrl: null,
  displayName: "Hassan Monlay I AKIANA",
  displayTitle: "Président Directeur Général — Office Management",
};

/** Pure SVG cursive signature — no image asset required. */
function SignatureSVG({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 520 140"
      className="h-20 md:h-24 w-auto text-primary"
      role="img"
      aria-label={`Signature manuscrite de ${name}`}
    >
      <defs>
        <linearGradient id="ink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Cursive flourish path */}
      <path
        d="M20,90 C40,30 70,30 80,90 C90,140 120,40 140,90 C150,115 165,55 180,90 C195,125 215,35 235,90 C250,130 270,45 290,90 C305,125 330,40 355,90 C375,125 405,40 430,80 C450,110 475,70 500,60"
        fill="none"
        stroke="url(#ink)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Underline stroke */}
      <path
        d="M30,118 C140,108 320,112 480,104"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Final flourish dot */}
      <circle cx="500" cy="60" r="2.2" fill="currentColor" />
      {/* Cursive name (typographic accent) */}
      <text
        x="60"
        y="78"
        fontFamily='"Dancing Script", "Brush Script MT", cursive'
        fontWeight="700"
        fontSize="46"
        fill="currentColor"
        opacity="0.85"
      >
        {name.split(" ").slice(0, 2).join(" ")}
      </text>
    </svg>
  );
}

export function CeoSignature() {
  const [s, setS] = useState<Signature>(DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    fetchSettings()
      .then(({ ceo }) => {
        if (cancelled || !ceo) return;
        // Un champ vide côté admin ne doit pas effacer la valeur par défaut.
        setS({
          signatureUrl: ceo.signatureUrl || null,
          displayName: ceo.displayName || DEFAULTS.displayName,
          displayTitle: ceo.displayTitle || DEFAULTS.displayTitle,
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">Signature</div>
      {s.signatureUrl ? (
        <img
          src={s.signatureUrl}
          alt={`Signature manuscrite de ${s.displayName}`}
          className="h-20 md:h-24 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert select-none"
          width={320}
          height={120}
          loading="lazy"
          draggable={false}
        />
      ) : (
        <SignatureSVG name={s.displayName} />
      )}
      <div className="mt-2 text-sm">
        <div className="font-semibold text-foreground">{s.displayName}</div>
        <div className="text-muted-foreground">{s.displayTitle}</div>
      </div>
    </div>
  );
}
