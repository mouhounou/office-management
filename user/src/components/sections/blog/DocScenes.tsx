/**
 * Petites scènes animées (SVG + CSS, voir « Scènes des documents » dans
 * styles.css) qui illustrent chaque document téléchargeable. Couleurs de la
 * charte uniquement : cyan, navy, blanc.
 */

const svgProps = {
  viewBox: "0 0 240 150",
  className: "doc-scene h-full w-full",
  "aria-hidden": true,
} as const;

/** Brochure à trois volets qui s'ouvre et se referme. */
export function BrochureScene() {
  return (
    <svg {...svgProps}>
      <ellipse cx="120" cy="134" rx="62" ry="6" className="fill-navy-deep/40" />
      <g className="ds-float">
        <rect x="92" y="34" width="56" height="88" rx="4" className="fill-white" />
        <rect x="100" y="46" width="40" height="18" rx="3" className="fill-cyan" />
        <rect x="100" y="72" width="40" height="4" rx="2" className="fill-navy/20" />
        <rect x="100" y="81" width="30" height="4" rx="2" className="fill-navy/20" />
        <rect x="100" y="90" width="36" height="4" rx="2" className="fill-navy/20" />
        <g className="ds-flap-left">
          <rect x="36" y="34" width="56" height="88" rx="4" className="fill-cyan-glow" />
          <circle cx="64" cy="66" r="12" className="fill-white/70" />
          <rect x="46" y="88" width="36" height="4" rx="2" className="fill-white/70" />
        </g>
        <g className="ds-flap-right">
          <rect x="148" y="34" width="56" height="88" rx="4" className="fill-navy" />
          <rect x="158" y="48" width="36" height="4" rx="2" className="fill-cyan" />
          <rect x="158" y="57" width="26" height="4" rx="2" className="fill-white/50" />
          <rect x="158" y="96" width="36" height="14" rx="7" className="fill-cyan" />
        </g>
      </g>
      <circle cx="200" cy="26" r="3" className="ds-twinkle fill-cyan-glow" />
      <circle cx="40" cy="22" r="2" className="ds-twinkle ds-delay-1 fill-white" />
    </svg>
  );
}

/** Catalogue ouvert dont les pages tournent, toque qui flotte au-dessus. */
export function CatalogueScene() {
  return (
    <svg {...svgProps}>
      <ellipse cx="120" cy="136" rx="70" ry="6" className="fill-navy-deep/40" />
      <path d="M120 58 L52 46 L52 124 L120 134 Z" className="fill-white" />
      <path d="M120 58 L188 46 L188 124 L120 134 Z" className="fill-white/90" />
      <rect x="62" y="64" width="44" height="4" rx="2" className="fill-navy/20" />
      <rect x="62" y="74" width="38" height="4" rx="2" className="fill-navy/20" />
      <rect x="62" y="84" width="42" height="4" rx="2" className="fill-navy/20" />
      <rect x="134" y="64" width="40" height="22" rx="3" className="fill-cyan/80" />
      <rect x="134" y="92" width="36" height="4" rx="2" className="fill-navy/20" />
      <path d="M120 58 L188 46 L188 124 L120 134 Z" className="ds-page fill-cyan-glow/80" />
      <path d="M120 58 L188 46 L188 124 L120 134 Z" className="ds-page ds-delay-2 fill-white" />
      <g className="ds-float">
        <path d="M120 14 L150 26 L120 38 L90 26 Z" className="fill-navy" />
        <rect x="108" y="30" width="24" height="10" rx="2" className="fill-navy" />
        <path d="M146 27 L146 42" className="stroke-cyan" strokeWidth="2" />
        <circle cx="146" cy="44" r="3" className="fill-cyan" />
      </g>
    </svg>
  );
}

/** Fiche d'inscription remplie par un stylo, cases qui se cochent. */
export function FormScene() {
  return (
    <svg {...svgProps}>
      <ellipse cx="112" cy="138" rx="56" ry="6" className="fill-navy-deep/40" />
      <rect x="66" y="16" width="92" height="118" rx="6" className="fill-white" />
      <rect x="78" y="28" width="44" height="6" rx="3" className="fill-navy" />
      {[48, 70, 92].map((y, i) => (
        <g key={y}>
          <rect
            x="78"
            y={y}
            width="12"
            height="12"
            rx="3"
            className="fill-none stroke-navy/30"
            strokeWidth="2"
          />
          <path
            d={`M80.5 ${y + 6} l3 3 l5 -6`}
            className={`ds-check ds-delay-${i} fill-none stroke-cyan`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="96" y={y + 2} width="48" height="3" rx="1.5" className="fill-navy/15" />
          <rect x="96" y={y + 8} width="34" height="3" rx="1.5" className="fill-navy/15" />
        </g>
      ))}
      <rect x="96" y="116" width="50" height="3" rx="1.5" className="fill-navy/15" />
      <path
        d="M96 114 q6 -6 12 0 t12 0 t12 0"
        className="ds-sign fill-none stroke-cyan"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g className="ds-pen">
        <path d="M150 74 L184 40 L192 48 L158 82 Z" className="fill-navy" />
        <path d="M150 74 L158 82 L146 86 Z" className="fill-cyan" />
        <path d="M184 40 L192 48 L196 44 L188 36 Z" className="fill-cyan-glow" />
      </g>
    </svg>
  );
}

/** Grille tarifaire : barres qui montent, pièces qui sautillent. */
export function PricingScene() {
  return (
    <svg {...svgProps}>
      <ellipse cx="120" cy="136" rx="76" ry="6" className="fill-navy-deep/40" />
      <rect x="44" y="20" width="152" height="112" rx="8" className="fill-white" />
      <rect x="44" y="20" width="152" height="20" rx="8" className="fill-navy" />
      <circle cx="58" cy="30" r="3" className="fill-cyan" />
      <circle cx="68" cy="30" r="3" className="fill-white/50" />
      {[
        { x: 64, h: 40 },
        { x: 92, h: 62 },
        { x: 120, h: 50 },
        { x: 148, h: 76 },
      ].map((bar, i) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={122 - bar.h}
          width="18"
          height={bar.h}
          rx="3"
          className={`ds-bar ds-delay-${i} ${i % 2 ? "fill-cyan" : "fill-navy/70"}`}
        />
      ))}
      <g className="ds-coin">
        <circle cx="204" cy="40" r="14" className="fill-cyan-glow" />
        <text
          x="204"
          y="45"
          textAnchor="middle"
          className="fill-navy font-display text-[13px] font-extrabold"
        >
          F
        </text>
      </g>
      <circle cx="30" cy="112" r="9" className="ds-coin ds-delay-2 fill-cyan" />
    </svg>
  );
}

/** Règlement intérieur : presse-papiers dont les règles se cochent une à une. */
export function RulesScene() {
  return (
    <svg {...svgProps}>
      <ellipse cx="120" cy="138" rx="56" ry="6" className="fill-navy-deep/40" />
      <rect x="74" y="20" width="92" height="114" rx="8" className="fill-navy" />
      <rect x="82" y="30" width="76" height="98" rx="4" className="fill-white" />
      <rect x="102" y="14" width="36" height="14" rx="5" className="fill-cyan" />
      {[44, 66, 88, 110].map((y, i) => (
        <g key={y}>
          <circle cx="96" cy={y} r="6" className="fill-cyan/15" />
          <path
            d={`M93 ${y} l2.5 2.5 l4.5 -5`}
            className={`ds-check ds-delay-${i} fill-none stroke-cyan`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="108" y={y - 2} width="40" height="4" rx="2" className="fill-navy/20" />
        </g>
      ))}
      <g className="ds-float ds-delay-1">
        <path
          d="M188 50 l16 6 v14 c0 10 -7 16 -16 20 c-9 -4 -16 -10 -16 -20 v-14 Z"
          className="fill-cyan"
        />
        <path
          d="M181 70 l5 5 l9 -10"
          className="fill-none stroke-white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** Présentation institutionnelle : un personnage présente un graphique. */
export function PresentationScene() {
  return (
    <svg {...svgProps}>
      <ellipse cx="120" cy="138" rx="84" ry="6" className="fill-navy-deep/40" />
      {/* Tableau */}
      <rect x="92" y="14" width="118" height="80" rx="6" className="fill-white" />
      <rect x="148" y="94" width="6" height="40" className="fill-white/60" />
      <polyline
        points="104,78 128,62 148,70 170,44 196,30"
        className="ds-line fill-none stroke-cyan"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="196" cy="30" r="5" className="ds-twinkle fill-cyan-glow" />
      <rect x="104" y="24" width="30" height="5" rx="2.5" className="fill-navy/30" />
      {/* Personnage */}
      <g className="ds-float">
        <circle cx="54" cy="42" r="13" className="fill-[oklch(0.42_0.06_50)]" />
        <path d="M41 40 q13 -16 26 0 q-2 -12 -13 -12 q-11 0 -13 12" className="fill-navy-deep" />
        <path d="M34 108 q0 -42 20 -46 q20 4 20 46 Z" className="fill-cyan" />
        <rect x="40" y="106" width="9" height="28" rx="4" className="fill-navy" />
        <rect x="59" y="106" width="9" height="28" rx="4" className="fill-navy" />
        <g className="ds-point">
          <path d="M66 70 L96 52" className="stroke-cyan" strokeWidth="8" strokeLinecap="round" />
          <circle cx="98" cy="51" r="5" className="fill-[oklch(0.42_0.06_50)]" />
          <path d="M100 50 L122 40" className="stroke-navy" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
