"use client";

import { useState } from "react";
import { useT, type Locale } from "@/i18n/translations";

type Props = { locale: Locale };

export default function Contact({ locale }: Props) {
  const tr = useT(locale);
  const c = tr.contact;

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus]   = useState<"idle" | "sending" | "ok" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, locale }),
      });
      if (res.ok) {
        setStatus("ok");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-28 px-6 bg-stone-warm">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* Left: intro + Instagram */}
        <div>
          <p className="section-subtitle mb-5">{c.subtitle}</p>
          <h2 className="section-title mb-8">{c.title}</h2>
          <p className="font-sans text-forest-700 leading-relaxed mb-10">
            {locale === "cs"
              ? "Máte dotaz ohledně vybavení, dostupnosti nebo okolí? Napište nám a rádi vám pomůžeme."
              : "Questions about the property, availability, or the area? Drop us a message and we'll be happy to help."}
          </p>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/bouda_krista"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-full bg-forest-900 flex items-center justify-center group-hover:bg-forest-700 transition-colors">
              <svg className="w-5 h-5 text-stone-warm" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <p className="font-serif text-forest-900 text-lg leading-none">@bouda_krista</p>
              <p className="font-sans text-xs text-forest-500 tracking-wide mt-0.5">Instagram</p>
            </div>
          </a>
        </div>

        {/* Right: form */}
        <div className="bg-white p-10 shadow-sm">
          {status === "ok" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-forest-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-serif text-xl text-forest-900">{c.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-sans tracking-widest uppercase text-forest-500 mb-2">{c.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={c.namePlaceholder}
                  className="w-full border border-forest-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-forest-700 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-sans tracking-widest uppercase text-forest-500 mb-2">{c.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={c.emailPlaceholder}
                  className="w-full border border-forest-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-forest-700 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-sans tracking-widest uppercase text-forest-500 mb-2">{c.message}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder={c.messagePlaceholder}
                  className="w-full border border-forest-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-forest-700 bg-transparent resize-none"
                />
              </div>
              {status === "error" && (
                <p className="text-red-600 font-sans text-sm">{c.error}</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? c.submitting : c.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
