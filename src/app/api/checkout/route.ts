import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/gopay";
import { calculateTotal } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const { checkIn, checkOut, apartment, apartmentName, guestName, guestEmail } = await req.json();

  if (!checkIn || !checkOut || !guestName || !guestEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const checkInDate  = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  const { total, nights } = calculateTotal(checkInDate, checkOutDate, apartment ?? "whole");
  const baseUrl     = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
  const orderNumber = `BK-${Date.now()}-${guestEmail.slice(0, 4).toUpperCase()}`;
  const aptName     = apartmentName ?? "Whole House";

  try {
    const payment = await createPayment({
      amountCzk:        total,
      orderNumber,
      orderDescription: `Bouda Krista · ${aptName} · ${checkIn} – ${checkOut} · ${nights} nocí`,
      guestName,
      guestEmail,
      returnUrl:  `${baseUrl}/book/success?order=${orderNumber}`,
      notifyUrl:  `${baseUrl}/api/gopay-notify`,
      items: [
        {
          name:   `${aptName} – ${nights} noc${nights > 1 ? "í" : ""}`,
          amount: Math.round(total / nights),
          count:  nights,
        },
      ],
    });

    return NextResponse.json({ url: payment.gw_url, total, nights });
  } catch (err) {
    console.error("GoPay checkout error:", err);
    return NextResponse.json({ error: "Payment gateway error. Please try again." }, { status: 500 });
  }
}
