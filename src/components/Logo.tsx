import Link from "next/link";

type Props = {
  className?: string;
  href?: string;
};

export default function Logo({ className = "", href = "/" }: Props) {
  const inner = (
    <svg
      viewBox="0 0 200 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bouda Krista"
      className={`h-12 w-auto ${className}`}
    >
      <defs>
        {/* Warm glow for windows */}
        <filter id="window-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Subtle ambient glow on the whole house */}
        <filter id="house-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── House silhouette ─────────────────────────────── */}
      <g filter="url(#house-glow)">
        {/* Chimney */}
        <rect x="85" y="4" width="6" height="10" stroke="white" strokeWidth="1.2" fill="none" strokeLinejoin="round" />

        {/* Roof */}
        <polyline
          points="62,28 100,6 138,28"
          stroke="white"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Walls */}
        <rect
          x="68" y="28" width="64" height="18"
          stroke="white"
          strokeWidth="1.4"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Door (centered, touches bottom) */}
        <rect
          x="93" y="34" width="14" height="12"
          stroke="white"
          strokeWidth="1.1"
          fill="none"
          strokeLinejoin="round"
        />
      </g>

      {/* ── Glowing windows ──────────────────────────────── */}
      {/* Left window */}
      <g filter="url(#window-glow)">
        <rect x="74" y="32" width="11" height="9" fill="#f5c842" opacity="0.95" rx="0.5" />
        {/* Inner cross */}
        <line x1="79.5" y1="32" x2="79.5" y2="41" stroke="#e8a020" strokeWidth="0.7" opacity="0.6" />
        <line x1="74"   y1="36.5" x2="85" y2="36.5" stroke="#e8a020" strokeWidth="0.7" opacity="0.6" />
      </g>

      {/* Right window */}
      <g filter="url(#window-glow)">
        <rect x="115" y="32" width="11" height="9" fill="#f5c842" opacity="0.95" rx="0.5" />
        {/* Inner cross */}
        <line x1="120.5" y1="32"   x2="120.5" y2="41"   stroke="#e8a020" strokeWidth="0.7" opacity="0.6" />
        <line x1="115"   y1="36.5" x2="126"   y2="36.5" stroke="#e8a020" strokeWidth="0.7" opacity="0.6" />
      </g>

      {/* ── Text ─────────────────────────────────────────── */}
      <text
        x="100"
        y="57"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="14"
        letterSpacing="5"
        fill="white"
        fontWeight="400"
      >
        BOUDA KRISTA
      </text>

      {/* Decorative gold rules */}
      <line x1="24" y1="63" x2="72" y2="63" stroke="#c9a84c" strokeWidth="0.5" opacity="0.7" />
      <line x1="128" y1="63" x2="176" y2="63" stroke="#c9a84c" strokeWidth="0.5" opacity="0.7" />

      <text
        x="100"
        y="72"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="6"
        letterSpacing="3"
        fill="rgba(245,240,232,0.5)"
      >
        ROKYTNICE NAD JIZEROU
      </text>
    </svg>
  );

  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}
