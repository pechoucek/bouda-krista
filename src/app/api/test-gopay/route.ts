import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, createPayment } from "@/lib/gopay";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const info = {
    sandbox:   process.env.GOPAY_SANDBOX,
    goId:      process.env.GOPAY_GO_ID,
    clientId:  process.env.GOPAY_CLIENT_ID,
    secretSet: !!process.env.GOPAY_CLIENT_SECRET,
    baseUrl:   process.env.NEXT_PUBLIC_URL,
  };

  // Step 1: get token
  let token: string;
  try {
    token = await getAccessToken();
  } catch (err) {
    return NextResponse.json({ step: "oauth", error: String(err), info });
  }

  // Step 2: create a minimal test payment (1 Kč)
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "https://www.bouda-krista.cz";
  try {
    const payment = await createPayment({
      amountCzk:        1,
      orderNumber:      `TEST-${Date.now()}`,
      orderDescription: "Bouda Krista · test platby",
      guestName:        "Test Host",
      guestEmail:       "test@bouda-krista.cz",
      returnUrl:        `${baseUrl}/cs`,
      notifyUrl:        `${baseUrl}/api/gopay-notify`,
      items:            [{ name: "Test", amount: 1, count: 1 }],
    });
    return NextResponse.json({ ok: true, info, tokenOk: true, payment });
  } catch (err) {
    return NextResponse.json({ step: "createPayment", error: String(err), info, tokenOk: true });
  }
}
