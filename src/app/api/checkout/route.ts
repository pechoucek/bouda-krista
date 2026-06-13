import { NextRequest, NextResponse } from "next/server";
import { differenceInCalendarDays, format } from "date-fns";
import { createPayment } from "@/lib/gopay";

export async function POST(req: NextRequest) {
  const { checkIn, checkOut, guests, guestName, guestEmail } = await req.json();

  if (!checkIn || !checkOut || !guestName || !guestEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  if (nights < 1) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  const nightlyRate = parseInt(process.env.NIGHTLY_RATE_CZK ?? "8000", 10);
  const totalCzk    = nights * nightlyRate;
  const baseUrl     = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

  // Unique order number: timestamp + first 4 chars of email
  const orderNumber = `LK-${Date.now()}-${guestEmail.slice(0, 4).toUpperCase()}`;

  try {
    const payment = await createPayment({
      amountCzk:        totalCzk,
      orderNumber,
      orderDescription: `Lodge Krista · ${checkIn} – ${checkOut} · ${nights} nocí · ${guests} osob`,
      guestName,
      guestEmail,
      returnUrl:  `${baseUrl}/book/success?order=${orderNumber}`,
      notifyUrl:  `${baseUrl}/api/gopay-notify`,
      items: [
        {
          name:   `Lodge Krista – ${nights} noc${nights > 1 ? "í" : ""}`,
          amount: nightlyRate,
          count:  nights,
        },
      ],
    });

    return NextResponse.json({ url: payment.gw_url });
  } catch (err) {
    console.error("GoPay checkout error:", err);
    return NextResponse.json({ error: "Payment gateway error. Please try again." }, { status: 500 });
  }
}
