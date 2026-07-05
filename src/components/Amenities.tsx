import { useT, type Locale } from "@/i18n/translations";

const icons = [
  // fireplace — keep
  <svg key="fire" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
  // sauna — three steam wisps over a bench line
  <svg key="sauna" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14c0-2 1.5-3 1.5-5s-1.5-3-1.5-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14c0-2 1.5-3.5 1.5-6s-1.5-3.5-1.5-6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 14c0-2 1.5-3 1.5-5s-1.5-3-1.5-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 18h14" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 21h16" /></svg>,
  // wifi — keep
  <svg key="wifi" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>,
  // kitchen — crossed spoon & fork
  <svg key="kitchen" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><g transform="rotate(-45 12 12)"><ellipse cx="12" cy="5" rx="2.5" ry="3" strokeWidth={1.5} /><line x1="12" y1="8" x2="12" y2="21" strokeLinecap="round" strokeWidth={1.5} /></g><g transform="rotate(45 12 12)"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 2v5M12 2v5M14 2v5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 7q2 2 4 0M12 9v12" /></g></svg>,
  // parking — classic P sign
  <svg key="parking" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7h4a3 3 0 010 6H9" /></svg>,
  // terrace — Acapulco egg chair
  <svg key="terrace" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><ellipse cx="12" cy="9" rx="8" ry="7" strokeWidth={1.5} /><line x1="12" y1="15" x2="5" y2="4" strokeWidth={0.9} strokeLinecap="round" /><line x1="12" y1="15" x2="7.5" y2="2.5" strokeWidth={0.9} strokeLinecap="round" /><line x1="12" y1="15" x2="10.5" y2="2" strokeWidth={0.9} strokeLinecap="round" /><line x1="12" y1="15" x2="13.5" y2="2" strokeWidth={0.9} strokeLinecap="round" /><line x1="12" y1="15" x2="16.5" y2="2.5" strokeWidth={0.9} strokeLinecap="round" /><line x1="12" y1="15" x2="19" y2="4" strokeWidth={0.9} strokeLinecap="round" /><circle cx="12" cy="14" r="1.2" strokeWidth={1.2} /><path strokeLinecap="round" strokeWidth={1.5} d="M7 15.5L5 22M17 15.5L19 22M12 16v6" /></svg>,
  // washer — front-loader with circular door
  <svg key="washer" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" strokeWidth={1.5} /><circle cx="12" cy="13" r="5" strokeWidth={1.5} /><circle cx="12" cy="13" r="2.5" strokeWidth={1.5} /><circle cx="6" cy="5" r="1" fill="currentColor" strokeWidth={0} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5h6" /></svg>,
  // national park — KRNAP gentian flower (Gentiana asclepiadea)
  <svg key="park" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 22c0 0 1-7 3-11" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 11c1-2 5-3 7-1s0 6-4 6-5-3-3-5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16c1-2 5-3 7-1s0 6-4 6-5-3-3-5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 11Q10 10 9 7" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16Q8 16 7 19" /></svg>,
  // self check-in key — keep
  <svg key="key" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
];

type Props = { locale: Locale };

export default function Amenities({ locale }: Props) {
  const tr = useT(locale);

  return (
    <section id="amenities" className="py-24 bg-forest-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-subtitle text-gold mb-4">{tr.amenities.subtitle}</p>
          <h2 className="section-title text-stone-warm">{tr.amenities.title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-forest-800">
          {tr.amenities.items.map((item, i) => (
            <div key={item.label} className="bg-forest-950 p-10 flex gap-6 hover:bg-forest-900 transition-colors group">
              <div className="text-gold mt-1 flex-shrink-0 group-hover:scale-110 transition-transform">
                {icons[i]}
              </div>
              <div>
                <h3 className="font-serif text-xl text-stone-warm mb-2">{item.label}</h3>
                <p className="font-sans text-sm text-stone-warm/60 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
