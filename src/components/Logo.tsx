import Link from "next/link";

type Props = {
  className?: string;
  href?: string;
};

export default function Logo({ className = "", href = "/" }: Props) {
  const inner = (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bouda Krista"
      className={`h-12 w-auto ${className}`}
    >
      {/* Orchid — scaled to fit 80px tall, centered around x=28 */}
      {/* Basal leaves */}
      <path d="M28,76 C21,70 16,61 18,54 C23,57 27,65 28,72" stroke="white" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M28,76 C35,70 40,61 38,54 C33,57 29,65 28,72" stroke="white" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      {/* Stem */}
      <line x1="28" y1="71" x2="28" y2="5" stroke="white" strokeWidth="0.75" strokeLinecap="round"/>
      {/* Flower 1 */}
      <path d="M28,58 C23,55 15,55 11,58 C12.5,60 19,59 28,59" stroke="white" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28,58 C33,55 41,55 45,58 C43.5,60 37,59 28,59" stroke="white" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M26.5,58 C25.5,54 26.5,51 28,50 C29.5,51 30.5,54 29.5,58" stroke="white" strokeWidth="0.58" fill="none" strokeLinecap="round"/>
      <line x1="28" y1="59" x2="28" y2="65" stroke="white" strokeWidth="0.58" strokeLinecap="round"/>
      <path d="M28,65 C25.5,70 24,73 23,77" stroke="white" strokeWidth="0.48" fill="none" strokeLinecap="round"/>
      {/* Flower 2 */}
      <path d="M28,44 C23,41 16,41 12,44 C13.5,46 20,45 28,45" stroke="white" strokeWidth="0.56" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28,44 C33,41 40,41 44,44 C42.5,46 36,45 28,45" stroke="white" strokeWidth="0.56" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M26.5,44 C25.5,40 26.5,37 28,36 C29.5,37 30.5,40 29.5,44" stroke="white" strokeWidth="0.54" fill="none" strokeLinecap="round"/>
      <line x1="28" y1="45" x2="28" y2="51" stroke="white" strokeWidth="0.54" strokeLinecap="round"/>
      <path d="M28,51 C30,55 31,58 32,62" stroke="white" strokeWidth="0.44" fill="none" strokeLinecap="round"/>
      {/* Flower 3 */}
      <path d="M28,31 C23,28 17,28 13,31 C14.5,33 21,32 28,32" stroke="white" strokeWidth="0.52" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28,31 C33,28 39,28 43,31 C41.5,33 35,32 28,32" stroke="white" strokeWidth="0.52" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M26.5,31 C25.5,27 26.5,24 28,23 C29.5,24 30.5,27 29.5,31" stroke="white" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
      <line x1="28" y1="32" x2="28" y2="38" stroke="white" strokeWidth="0.5" strokeLinecap="round"/>
      <path d="M28,38 C26,42 25,45 24,49" stroke="white" strokeWidth="0.4" fill="none" strokeLinecap="round"/>
      {/* Flower 4 */}
      <path d="M28,19 C24,17 19,17 16,19 C17,20.5 22,20 28,20" stroke="white" strokeWidth="0.47" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28,19 C32,17 37,17 40,19 C39,20.5 34,20 28,20" stroke="white" strokeWidth="0.47" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M27,19 C26,15.5 27,13 28,12 C29,13 30,15.5 29,19" stroke="white" strokeWidth="0.45" fill="none" strokeLinecap="round"/>
      <line x1="28" y1="20" x2="28" y2="25" stroke="white" strokeWidth="0.45" strokeLinecap="round"/>
      <path d="M28,25 C29.5,28.5 30.5,31 31,35" stroke="white" strokeWidth="0.37" fill="none" strokeLinecap="round"/>
      {/* Bud at top */}
      <path d="M28,11 C26.5,8.5 26.5,5.5 28,4 C29.5,5.5 29.5,8.5 28,11" stroke="white" strokeWidth="0.42" fill="none" strokeLinecap="round"/>

      {/* Text: BOUDA / KRISTA stacked, vertically centred beside orchid */}
      <text x="60" y="35" textAnchor="start" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="16" letterSpacing="3" fill="white" opacity="0.95">BOUDA</text>
      <text x="60" y="55" textAnchor="start" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="16" letterSpacing="3" fill="white" opacity="0.95">KRISTA</text>
    </svg>
  );

  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}
