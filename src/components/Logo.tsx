import Link from "next/link";

type Props = {
  className?: string;
  href?: string;
};

export default function Logo({ className = "", href = "/" }: Props) {
  const inner = (
    <svg
      viewBox="0 0 240 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bouda Krista"
      className={`h-12 w-auto ${className}`}
    >
      <defs>
        <filter id="wglow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ── House ───────────────────────────────────────── */}

      {/* Chimney (right of peak) */}
      <rect x="105" y="10" width="5" height="12" stroke="white" strokeWidth="1" fill="none"/>

      {/* Steep gable / upper triangle */}
      <polyline
        points="46,40 93,6 140,40"
        stroke="white" strokeWidth="1.3"
        strokeLinejoin="round" strokeLinecap="round"
      />
      {/* Gable vertical boarding — 3 faint lines suggesting the siding */}
      <line x1="80"  y1="22" x2="73"  y2="40" stroke="white" strokeWidth="0.4" opacity="0.25"/>
      <line x1="93"  y1="15" x2="93"  y2="40" stroke="white" strokeWidth="0.4" opacity="0.25"/>
      <line x1="106" y1="22" x2="113" y2="40" stroke="white" strokeWidth="0.4" opacity="0.25"/>

      {/* Lower rectangle (stone base) */}
      <rect x="46" y="40" width="94" height="22"
        stroke="white" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
      {/* Horizontal line separating gable from base (roof overhang) */}
      <line x1="42" y1="40" x2="144" y2="40" stroke="white" strokeWidth="0.8"/>

      {/* ── Glowing windows ─────────────────────────────── */}

      {/* Gable: top center */}
      <g filter="url(#wglow)">
        <rect x="88" y="16" width="10" height="8" fill="#f5c842" rx="0.5"/>
      </g>
      {/* Gable: middle two */}
      <g filter="url(#wglow)">
        <rect x="71" y="26" width="9" height="8"  fill="#f5c842" rx="0.5"/>
        <rect x="106" y="26" width="9" height="8" fill="#f5c842" rx="0.5"/>
      </g>
      {/* Base: two arched windows (simplified as rect with slightly rounded top) */}
      <g filter="url(#wglow)">
        <rect x="62" y="44" width="13" height="12" fill="#f5c842" rx="2"/>
        <rect x="111" y="44" width="13" height="12" fill="#f5c842" rx="2"/>
      </g>
      {/* Base: door (no glow, just outline) */}
      <rect x="86" y="48" width="14" height="14"
        stroke="white" strokeWidth="0.9" fill="none" rx="1"/>

      {/* ── Tree (right side) ───────────────────────────── */}
      {/* Trunk */}
      <line x1="168" y1="62" x2="168" y2="40" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      {/* Main branches */}
      <line x1="168" y1="40" x2="155" y2="28" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="168" y1="40" x2="180" y2="26" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      {/* Sub-branches left */}
      <line x1="155" y1="28" x2="148" y2="20" stroke="white" strokeWidth="0.7" strokeLinecap="round"/>
      <line x1="155" y1="28" x2="160" y2="19" stroke="white" strokeWidth="0.7" strokeLinecap="round"/>
      {/* Sub-branches right */}
      <line x1="180" y1="26" x2="174" y2="17" stroke="white" strokeWidth="0.7" strokeLinecap="round"/>
      <line x1="180" y1="26" x2="187" y2="18" stroke="white" strokeWidth="0.7" strokeLinecap="round"/>
      {/* Tiny tip branches */}
      <line x1="148" y1="20" x2="144" y2="14" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="160" y1="19" x2="157" y2="13" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="174" y1="17" x2="171" y2="11" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="187" y1="18" x2="191" y2="12" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="168" y1="38" x2="163" y2="30" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.6"/>

      {/* ── Text ─────────────────────────────────────────── */}
      <text
        x="93" y="72"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="13" letterSpacing="5"
        fill="white" fontWeight="400"
      >
        BOUDA KRISTA
      </text>
    </svg>
  );

  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}
