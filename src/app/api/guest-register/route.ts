import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export type GuestRecord = {
  id: string;
  submittedAt: string;
  apartment: string;
  checkIn: string;
  checkOut: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  documentNumber: string;
  address: string;
  nights: number;
};

async function appendToSheet(rows: string[][]) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Kniha hostů!A:K",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: rows },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { apartment, checkIn, checkOut, guests } = body;

  if (!checkIn || !checkOut || !Array.isArray(guests) || guests.length === 0) {
    return NextResponse.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  }

  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  );
  const submittedAt = new Date().toLocaleString("cs-CZ", { timeZone: "Europe/Prague" });

  const rows: string[][] = guests
    .filter((g) => g.firstName && g.lastName && g.birthDate && g.documentNumber && g.address)
    .map((g) => [
      submittedAt,
      apartment ?? "",
      checkIn,
      checkOut,
      String(nights),
      g.firstName,
      g.lastName,
      g.birthDate,
      g.nationality ?? "",
      g.documentNumber,
      g.address,
    ]);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  }

  try {
    await appendToSheet(rows);
  } catch (err) {
    console.error("Sheets error:", err);
    return NextResponse.json({ error: "Nepodařilo se uložit záznamy. Zkuste to prosím znovu." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
