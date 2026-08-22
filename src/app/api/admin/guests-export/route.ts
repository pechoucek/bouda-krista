import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/bookings";
import * as XLSX from "xlsx";
import type { GuestRecord } from "@/app/api/guest-register/route";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = await getRedis();
  const raw = await redis.lrange("guests", 0, -1);
  const records: GuestRecord[] = raw.map((r: string) => JSON.parse(r)).reverse();

  const rows = records.map((r) => ({
    "Datum přijetí záznamu": new Date(r.submittedAt).toLocaleString("cs-CZ"),
    "Apartmán": r.apartment,
    "Příjezd": r.checkIn,
    "Odjezd": r.checkOut,
    "Počet nocí": r.nights,
    "Jméno": r.firstName,
    "Příjmení": r.lastName,
    "Datum narození": r.birthDate,
    "Státní příslušnost": r.nationality,
    "Číslo dokladu": r.documentNumber,
    "Adresa trvalého bydliště": r.address,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Kniha hostů");

  // Column widths
  ws["!cols"] = [
    { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
    { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 16 }, { wch: 30 },
  ];

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="kniha-hostu-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
