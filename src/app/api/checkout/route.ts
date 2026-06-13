import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/gopay";
import { calculateTotal } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const { checkIn, checkOut, guests, guestName, guestEmail } = await req.json();

  if (!checkIn || !checkOut || !guestName || !guestEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const checkInDate  = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  const { total, breakdown } = calculateTotal(checkInDate, checkOutDate);
  const nights = breakdown.length;
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
  const orderNumber = `LK-${Date.now()}-${guestEmail.slice(0, 4).toUpperCase()}`;

  try {
    const payment = await createPayment({
      amountCzk:        total,
      orderNumber,
      orderDescription: `Bouda Krista · ${checkIn} – ${checkOut} · ${nights} nocí · ${guests} osob`,
      guestName,
      guestEmail,
      returnUrl:  `${baseUrl}/book/success?order=${orderNumber}`,
      notifyUrl:  `${baseUrl}/api/gopay-notify`,
      items: breakdown.map((d) => ({
        name:   d.date,
        amount: d.rate,
        count:  1,
      })),
    });

    return NextResponse.json({ url: payment.gw_url, total, nights });
  } catch (err) {
    console.error("GoPay checkout error:", err);
    return NextResponse.json({ error: "Payment gateway error. Please try again." }, { status: 500 });
  }
}
