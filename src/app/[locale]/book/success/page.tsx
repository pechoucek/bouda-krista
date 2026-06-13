import Link from "next/link";
import { useT, type Locale } from "@/i18n/translations";

type Props = { params: Promise<{ locale: string }> };

export default async function SuccessPage({ params }: Props) {
  const { locale } = await params;
  const tr = useT(locale as Locale);

  return (
    <div className="min-h-screen bg-stone-warm flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-forest-700 flex items-center justify-center mb-8">
        <svg className="w-8 h-8 text-stone-warm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="section-subtitle mb-4">{tr.success.badge}</p>
      <h1 className="section-title mb-6">{tr.success.title}</h1>
      <p className="font-sans text-forest-600 max-w-md mb-10 leading-relaxed">
        {tr.success.desc}
      </p>
      <Link href={`/${locale}`} className="btn-outline">
        {tr.success.backHome}
      </Link>
    </div>
  );
}
