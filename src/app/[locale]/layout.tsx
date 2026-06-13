import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/translations";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const meta: Record<Locale, { title: string; description: string }> = {
  cs: {
    title: "Bouda Krista — Luxusní horský úkryt v Krkonoších",
    description:
      "Nově zrekonstruovaná bouda na kopci v Krkonoších. Tři designové apartmány pro až 11 hostů, soukromá sauna, výhledy na hory, uvnitř Krkonošského národního parku.",
  },
  en: {
    title: "Bouda Krista — Luxury Mountain Retreat in Krkonoše",
    description:
      "A newly renovated luxury lodge on a Krkonoše hilltop. Three designer apartments for up to 11 guests, private sauna, mountain views, inside Krkonoše National Park.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = meta[locale as Locale] ?? meta.cs;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `https://bouda-krista.cz/${locale}`,
      languages: {
        cs: "https://bouda-krista.cz/cs",
        en: "https://bouda-krista.cz/en",
      },
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  return <>{children}</>;
}
