import Link from "next/link";

type Props = {
  variant?: "light" | "dark"; // light = gold+white on dark bg, dark = forest on light bg
  className?: string;
  href?: string;
};

export default function Logo({ variant = "light", className = "", href = "/" }: Props) {
  const gold   = "#c9a84c";
  const text   = variant === "light" ? "#f5f0e8" : "#1a311a";
  const sub    = variant === "light" ? "rgba(245,240,232,0.55)" : "rgba(26,49,26,0.5)";

  const inner = (
    <svg
      viewBox="0 0 220 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bouda Krista"
      className={`h-12 w-auto ${className}`}
    >
      {/* ── Mountain peaks ─────────────────────────────── */}
      {/* Left peak */}
      <polyline
        points="18,46 62,8 86,34"
        stroke={gold}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Centre peak (tallest) */}
      <polyline
        points="86,34 110,4 134,34"
        stroke={gold}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Right peak */}
      <polyline
        points="134,34 158,8 202,46"
        stroke={gold}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Ground / base line */}
      <line x1="18" y1="46" x2="202" y2="46" stroke={gold} strokeWidth="0.6" opacity="0.45" />

      {/* ── Chalet silhouette ──────────────────────────── */}
      {/* Roof */}
      <polyline
        points="90,46 110,32 130,46"
        stroke={gold}
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Walls */}
      <rect x="93" y="40" width="34" height="6" stroke={gold} strokeWidth="1.2" fill="none" />

      {/* ── "BOUDA KRISTA" ─────────────────────────────── */}
      <text
        x="110"
        y="63"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="15"
        letterSpacing="5"
        fill={text}
        fontWeight="400"
      >
        BOUDA KRISTA
      </text>

      {/* ── Decorative rule + subtitle ─────────────────── */}
      <line x1="28" y1="68" x2="80" y2="68" stroke={gold} strokeWidth="0.5" opacity="0.6" />
      <line x1="140" y1="68" x2="192" y2="68" stroke={gold} strokeWidth="0.5" opacity="0.6" />

      <text
        x="110"
        y="78"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="6.5"
        letterSpacing="3.5"
        fill={sub}
        fontWeight="400"
      >
        ROKYTNICE NAD JIZEROU
      </text>
    </svg>
  );

  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}
