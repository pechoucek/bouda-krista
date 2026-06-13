import Link from "next/link";

type Props = {
  className?: string;
  href?: string;
};

export default function Logo({ className = "", href = "/" }: Props) {
  const inner = (
    <svg
      viewBox="0 0 80 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bouda Krista"
      className={`h-14 w-auto ${className}`}
    >
      {/* Basal leaves */}
      <path d="M40,218 C27,205 18,186 22,168 C32,175 39,194 40,210" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M40,218 C53,205 62,186 58,168 C48,175 41,194 40,210" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M40,212 C30,195 22,177 22,169" stroke="white" strokeWidth="0.32" fill="none" opacity="0.4"/>
      <path d="M40,212 C50,195 58,177 58,169" stroke="white" strokeWidth="0.32" fill="none" opacity="0.4"/>

      {/* Stem */}
      <line x1="40" y1="208" x2="40" y2="14" stroke="white" strokeWidth="0.85" strokeLinecap="round"/>

      {/* f1 */}
      <path d="M40,102 L34,97" stroke="white" strokeWidth="0.45" strokeLinecap="round" opacity="0.5"/>
      <path d="M40,97 C34,93 24,92 18,96 C20,99 28,97 40,97" stroke="white" strokeWidth="0.65" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40,97 C46,93 56,92 62,96 C60,99 52,97 40,97" stroke="white" strokeWidth="0.65" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M37.5,97 C36,92 38,88 40,87 C42,88 44,92 42.5,97" stroke="white" strokeWidth="0.62" fill="none" strokeLinecap="round"/>
      <line x1="40" y1="97" x2="40" y2="106" stroke="white" strokeWidth="0.62" strokeLinecap="round"/>
      <path d="M40,106 C37,113 35,120 34,128" stroke="white" strokeWidth="0.52" fill="none" strokeLinecap="round"/>

      {/* f2 */}
      <path d="M40,82 L46,77" stroke="white" strokeWidth="0.45" strokeLinecap="round" opacity="0.5"/>
      <path d="M40,77 C34,73 24,72 18,76 C20,79 28,77 40,77" stroke="white" strokeWidth="0.62" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40,77 C46,73 56,72 62,76 C60,79 52,77 40,77" stroke="white" strokeWidth="0.62" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M37.5,77 C36,72 38,68 40,67 C42,68 44,72 42.5,77" stroke="white" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
      <line x1="40" y1="77" x2="40" y2="86" stroke="white" strokeWidth="0.6" strokeLinecap="round"/>
      <path d="M40,86 C43,93 45,100 46,107" stroke="white" strokeWidth="0.5" fill="none" strokeLinecap="round"/>

      {/* f3 */}
      <path d="M40,62 L34,57" stroke="white" strokeWidth="0.42" strokeLinecap="round" opacity="0.48"/>
      <path d="M40,57 C34,53 25,52 19,56 C21,59 29,57 40,57" stroke="white" strokeWidth="0.58" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40,57 C46,53 55,52 61,56 C59,59 51,57 40,57" stroke="white" strokeWidth="0.58" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M38,57 C36.5,52 38,49 40,48 C42,49 43.5,52 42,57" stroke="white" strokeWidth="0.56" fill="none" strokeLinecap="round"/>
      <line x1="40" y1="57" x2="40" y2="65" stroke="white" strokeWidth="0.56" strokeLinecap="round"/>
      <path d="M40,65 C37,72 35,78 34,85" stroke="white" strokeWidth="0.47" fill="none" strokeLinecap="round"/>

      {/* f4 */}
      <path d="M40,43 L46,38" stroke="white" strokeWidth="0.4" strokeLinecap="round" opacity="0.46"/>
      <path d="M40,38 C35,34 27,33 21,37 C23,40 31,38 40,38" stroke="white" strokeWidth="0.54" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40,38 C45,34 53,33 59,37 C57,40 49,38 40,38" stroke="white" strokeWidth="0.54" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M38,38 C37,34 38.5,31 40,30 C41.5,31 43,34 42,38" stroke="white" strokeWidth="0.52" fill="none" strokeLinecap="round"/>
      <line x1="40" y1="38" x2="40" y2="46" stroke="white" strokeWidth="0.52" strokeLinecap="round"/>
      <path d="M40,46 C43,52 45,57 46,63" stroke="white" strokeWidth="0.43" fill="none" strokeLinecap="round"/>

      {/* f5 */}
      <path d="M40,26 L34,22" stroke="white" strokeWidth="0.37" strokeLinecap="round" opacity="0.44"/>
      <path d="M40,22 C35,19 29,18 24,21 C26,24 32,22 40,22" stroke="white" strokeWidth="0.48" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40,22 C45,19 51,18 56,21 C54,24 48,22 40,22" stroke="white" strokeWidth="0.48" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M38.5,22 C38,18 39,16 40,15 C41,16 42,18 41.5,22" stroke="white" strokeWidth="0.46" fill="none" strokeLinecap="round"/>
      <line x1="40" y1="22" x2="40" y2="29" stroke="white" strokeWidth="0.46" strokeLinecap="round"/>
      <path d="M40,29 C38,34 37,38 36,43" stroke="white" strokeWidth="0.38" fill="none" strokeLinecap="round" opacity="0.85"/>

      {/* Bud at top */}
      <path d="M40,14 C38,11 38,7 40,5 C42,7 42,11 40,14" stroke="white" strokeWidth="0.44" fill="none" strokeLinecap="round"/>

      {/* BOUDA KRISTA */}
      <text x="40" y="228" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="7.5" letterSpacing="2.5" fill="white" opacity="0.9">BOUDA KRISTA</text>
    </svg>
  );

  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}
