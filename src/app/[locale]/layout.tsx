import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/translations";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const meta: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  cs: {
    title: "Bouda Krista — Ubytování Rokytnice nad Jizerou | Krkonoše",
    description:
      "Luxusní ubytování v Krkonoších pro rodiny a skupiny. Tři designové apartmány pro až 11 hostů, soukromá sauna a výhledy na hory v Rokytnici nad Jizerou. Ideální pro zimní i letní pobyty.",
    keywords: [
      // Czech search terms
      "ubytování Krkonoše",
      "ubytování Rokytnice nad Jizerou",
      "apartmány Krkonoše",
      "bouda Krkonoše",
      "chalupa Krkonoše",
      "pronájem chaty Krkonoše",
      "skupinové ubytování Krkonoše",
      "rodinné ubytování Krkonoše",
      "lyžařské ubytování Rokytnice",
      "Krkonošský národní park ubytování",
      "sauna Krkonoše",
      "celý dům pronájem Krkonoše",
      "luxusní ubytování hory Česká republika",
      // Polish search terms (large tourist segment in Krkonoše)
      "noclegi Karkonosze Czechy",
      "apartamenty Karkonosze",
      "wynajem domku Karkonosze",
      "nocleg Rokytnica nad Jizerou",
      "Karkonosze noclegi dla grup",
      "apartamenty górskie Czechy",
      "wynajem całego domu Karkonosze",
    ],
  },
  en: {
    title: "Bouda Krista — Mountain Lodge Rokytnice nad Jizerou | Krkonoše",
    description:
      "Luxury mountain lodge in Krkonoše National Park, Czech Republic. Three designer apartments sleeping up to 11 guests, private sauna and panoramic mountain views near Rokytnice nad Jizerou.",
    keywords: [
      "Krkonoše accommodation",
      "Rokytnice nad Jizerou rental",
      "Giant Mountains lodge",
      "Czech mountain retreat",
      "luxury mountain cabin Czech Republic",
      "Krkonoše National Park accommodation",
      "group accommodation Krkonoše",
      "family lodge Czech mountains",
      "ski chalet Rokytnice",
      "whole house rental Krkonoše",
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = meta[locale as Locale] ?? meta.cs;
  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: `https://bouda-krista.cz/${locale}`,
      languages: {
        cs: "https://bouda-krista.cz/cs",
        en: "https://bouda-krista.cz/en",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `https://bouda-krista.cz/${locale}`,
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      alternateLocale: locale === "cs" ? "en_US" : "cs_CZ",
      images: ["https://a0.muscache.com/im/pictures/hosting/Hosting-1681755602554370759/original/daa6a02b-06de-4b6d-8abb-cfbd6ab77c33.jpeg?im_w=1440"],
      type: "website",
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
