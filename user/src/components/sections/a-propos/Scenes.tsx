/**
 * Scènes animées de la page À propos (classes ds-* de styles.css, coupées si
 * le visiteur demande moins de mouvement).
 */

const skin = "fill-[oklch(0.42_0.06_50)]";

/** Poignée de main sur un contrat signé, sceau de confiance qui pulse. */
export function HandshakeScene() {
  return (
    <svg viewBox="0 0 260 200" className="doc-scene h-full w-full" aria-hidden>
      <ellipse cx="130" cy="186" rx="80" ry="7" className="fill-navy-deep/50" />
      {/* Contrat */}
      <g className="ds-float ds-delay-1">
        <rect x="76" y="112" width="108" height="66" rx="6" className="fill-white" />
        <rect x="88" y="124" width="54" height="5" rx="2.5" className="fill-navy/30" />
        <rect x="88" y="135" width="80" height="4" rx="2" className="fill-navy/15" />
        <path
          d="M90 162 q8 -10 16 0 t16 0 t16 0"
          className="ds-sign fill-none stroke-cyan"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
      {/* Poignée de main : deux manches qui se rejoignent, mains jointes */}
      <g className="ds-shake">
        <rect x="0" y="56" width="104" height="30" rx="12" className="fill-navy" />
        <rect x="156" y="56" width="104" height="30" rx="12" className="fill-cyan" />
        <rect x="92" y="54" width="10" height="34" rx="3" className="fill-white/80" />
        <rect x="158" y="54" width="10" height="34" rx="3" className="fill-white/80" />
        <rect x="98" y="52" width="64" height="38" rx="18" className={skin} />
        <path
          d="M114 60 v22 M124 58 v26 M134 58 v26 M144 60 v22"
          className="stroke-navy-deep/30"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M100 72 q14 -14 30 -4"
          className="fill-none stroke-navy-deep/40"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
      {/* Sceau */}
      <g className="ds-twinkle">
        <circle cx="214" cy="146" r="18" className="fill-cyan" />
        <path
          d="M206 146 l6 6 l10 -12"
          className="fill-none stroke-white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <circle cx="40" cy="30" r="3" className="ds-twinkle ds-delay-2 fill-cyan-glow" />
      <circle cx="226" cy="24" r="2.5" className="ds-twinkle ds-delay-1 fill-white" />
    </svg>
  );
}
