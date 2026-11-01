import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import GuestbookForm from "@/components/GuestbookForm";
import { isValidKey } from "@/lib/guestbook";
import type { Locale } from "@/i18n/translations";

// Hidden page: not indexed, and it returns "not found" unless the key in the link is correct
export const metadata: Metadata = {
  title: "Domovní kniha — Bouda Krista",
  robots: { index: false, follow: false },
};

export default async function GuestbookPage({
  params,
}: {
  params: Promise<{ locale: Locale; key: string }>;
}) {
  const { locale, key } = await params;
  if (!isValidKey(key)) notFound();

  return (
    <>
      <Nav locale={locale} alwaysDark />
      <main className="min-h-screen bg-white pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <GuestbookForm locale={locale} accessKey={key} />
        </div>
      </main>
    </>
  );
}
