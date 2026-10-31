# Bouda Krista — Project Context for Claude

## What this is
Luxury mountain lodge website at **bouda-krista.cz** for Bouda Krista in Rokytnice nad Jizerou, Krkonoše. Built with Next.js 15 App Router, deployed on Vercel, Redis for dynamic data.

## Tech stack
- **Framework**: Next.js 15 App Router, TypeScript, Tailwind CSS
- **i18n**: `/cs` and `/en` locales via `[locale]` dynamic segment
- **Database**: Redis (ioredis) via `src/lib/bookings.ts` → `getRedis()`
- **Deployment**: Vercel (auto-deploy on push to `main`)
- **Repo**: `git@github.com:pechoucek/bouda-krista.git`

## Key files
- `src/i18n/translations.ts` — all Czech/English strings
- `src/data/apartments.ts` — apartment details and photos
- `src/data/photos.ts` — gallery/hero photo list
- `src/components/Hero.tsx` — hero carousel (3 photos, auto-advance 6s)
- `src/components/Gallery.tsx` — 3×3 photo grid with lightbox
- `src/components/ApartmentModal.tsx` — apartment detail modal with photo slideshow
- `src/app/[locale]/book/page.tsx` — booking page with calendar, price calc, form
- `src/app/[locale]/admin/page.tsx` — admin panel (access: `/cs/admin?secret=<ADMIN_SECRET>`)
- `src/app/api/price/route.ts` — dynamic price calculation (reads from Redis)
- `src/app/api/admin/prices/route.ts` — GET/POST price config (Redis key: `config:prices`)
- `src/app/api/admin/bookings/route.ts` — booking management API
- `src/app/api/reservation-request/route.ts` — sends booking inquiry email

## Business logic
- **Only renting the whole house** (up to 11 guests). Individual apartments still shown for browsing but price is "on request", no price calculation.
- **Dynamic pricing** stored in Redis (`config:prices`). Admin panel at `/cs/admin?secret=...` lets Helena manage prices and blocked dates.
- **Season logic** (in `src/app/api/price/route.ts`):
  - Christmas: Dec 21–27
  - New Year: Dec 28 – Jan 1
  - Easter: Good Friday – Easter Monday (Anonymous Gregorian algorithm)
  - Winter: Dec 1 – Mar 31
  - Summer: Jul 1 – Aug 31
  - Off-season: rest
- **Weekly rate**: exactly 7 nights in winter/summer/offseason → flat weekly price from admin config
- **Weekend rate**: Friday and Saturday nights use `weekend` price (not `base`)
- **Min nights**: per season, set in admin panel, enforced in calendar and at submit

## Photos
All photos self-hosted in `public/photos/`. Naming convention:
- `top-*` — Top Floor apartment photos
- `top-zentel-*` / `top-zentelFAR*` — Top Floor photos by Lukáš Žentel (show credit)
- `zentel*` / `FAR*` / `DJI_*` — exterior photos by Lukáš Žentel
- Hero carousel: `DJI_0666.jpg`, `DSCF8812.JPG`, `FAR06549.jpg`

When adding photos: commit them to git (`git add public/photos/filename`). Resize large files (>3MB) with `sips -Z 2048 filename` before committing.

## Admin panel
URL: `https://www.bouda-krista.cz/cs/admin?secret=<ADMIN_SECRET>`
- Add/delete blocked dates and manual reservations
- Manage seasonal prices (base/weekend/weekly/min nights)
- Changes take effect immediately for new bookings

## Environment variables (set in Vercel)
- `REDIS_URL` — Upstash Redis connection string
- `ADMIN_SECRET` — password for admin panel and price API writes
- `SMTP_*` — email sending for booking inquiries (Helena gets notified)

## Important rules
- Never export non-route constants from API route files (Next.js build error)
- `"use client"` required for any component using hooks or interactivity
- SSH push: remote is `git@github.com:pechoucek/bouda-krista.git`
- TypeScript must compile clean before pushing: `npx tsc --noEmit`

## Current status (Oct 2026)
- Payments: manual (GoPro production not yet activated). Helena handles payment confirmation.
- Guest registration to Google Sheets: not yet implemented (needs service account credentials).
