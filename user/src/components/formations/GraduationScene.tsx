/**
 * Diplômé qui lance sa toque, diplôme et étoiles animés (classes ds-* de
 * styles.css, coupées si le visiteur demande moins de mouvement).
 */
export function GraduationScene() {
  return (
    <svg viewBox="0 0 240 200" className="doc-scene h-full w-full" aria-hidden>
      <ellipse cx="120" cy="188" rx="70" ry="7" className="fill-navy-deep/50" />
      {/* Toque lancée */}
      <g className="ds-toss">
        <path d="M120 10 L156 24 L120 38 L84 24 Z" className="fill-cyan" />
        <rect x="106" y="30" width="28" height="10" rx="2" className="fill-cyan" />
        <path d="M152 25 L152 42" className="stroke-white" strokeWidth="2" />
        <circle cx="152" cy="44" r="3" className="fill-white" />
      </g>
      {/* Personnage */}
      <g className="ds-float">
        <circle cx="120" cy="78" r="18" className="fill-[oklch(0.42_0.06_50)]" />
        <path d="M102 74 q18 -24 36 0 q-3 -16 -18 -16 q-15 0 -18 16" className="fill-navy-deep" />
        <path d="M88 170 q0 -60 32 -66 q32 6 32 66 Z" className="fill-navy" />
        <path d="M112 104 L120 124 L128 104" className="fill-cyan" />
        {/* Bras levé avec diplôme */}
        <g className="ds-point">
          <path
            d="M148 120 L176 84"
            className="stroke-navy"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <circle cx="178" cy="80" r="7" className="fill-[oklch(0.42_0.06_50)]" />
          <rect
            x="170"
            y="54"
            width="34"
            height="14"
            rx="7"
            transform="rotate(-30 187 61)"
            className="fill-white"
          />
          <rect
            x="182"
            y="52"
            width="4"
            height="18"
            transform="rotate(-30 187 61)"
            className="fill-cyan"
          />
        </g>
        <path d="M92 124 L76 150" className="stroke-navy" strokeWidth="12" strokeLinecap="round" />
      </g>
      <circle cx="44" cy="40" r="4" className="ds-twinkle fill-cyan-glow" />
      <circle cx="206" cy="128" r="3" className="ds-twinkle ds-delay-2 fill-white" />
      <path
        d="M40 110 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z"
        className="ds-twinkle ds-delay-1 fill-cyan"
      />
      <path
        d="M196 20 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5 Z"
        className="ds-twinkle ds-delay-3 fill-cyan-glow"
      />
    </svg>
  );
}
