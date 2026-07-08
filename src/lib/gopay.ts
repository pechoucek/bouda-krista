/**
 * Minimal GoPay REST API client.
 * Docs: https://doc.gopay.com
 */

const SANDBOX_URL    = "https://gw.sandbox.gopay.com/api";
const PRODUCTION_URL = "https://gate.gopay.cz/api";

function baseUrl() {
  return process.env.GOPAY_SANDBOX === "true" ? SANDBOX_URL : PRODUCTION_URL;
}

// ── OAuth token (cached per process lifecycle) ─────────────────────────────

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(
    `${process.env.GOPAY_CLIENT_ID}:${process.env.GOPAY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${baseUrl()}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: "grant_type=client_credentials&scope=payment-all",
  });

  if (!res.ok) {
    throw new Error(`GoPay OAuth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 30_000, // 30s buffer
  };
  return cachedToken.value;
}

// ── Create payment ─────────────────────────────────────────────────────────

export type CreatePaymentParams = {
  amountCzk: number;        // e.g. 8000 for 8 000 Kč
  orderNumber: string;      // unique order ID
  orderDescription: string; // shown on GoPay checkout
  guestName: string;
  guestEmail: string;
  returnUrl: string;        // redirect after payment
  notifyUrl: string;        // server-side callback
  items: { name: string; amount: number; count: number }[];
};

export async function createPayment(params: CreatePaymentParams) {
  const token = await getAccessToken();

  const body = {
    payer: {
      contact: {
        first_name: params.guestName.split(" ")[0] ?? params.guestName,
        last_name:  params.guestName.split(" ").slice(1).join(" ") || undefined,
        email:      params.guestEmail,
      },
    },
    target: {
      type: "ACCOUNT",
      go_id: Number(process.env.GOPAY_GO_ID),
    },
    amount:            params.amountCzk * 100, // GoPay uses haléře (hundredths)
    currency:          "CZK",
    order_number:      params.orderNumber,
    order_description: params.orderDescription,
    items:             params.items.map((i) => ({
      type:   "ITEM",
      name:   i.name,
      amount: i.amount * 100,
      count:  i.count,
    })),
    payment_instrument: "PAYMENT_CARD", // default; guest can change on GoPay page
    lang:               "CS",
    callback: {
      return_url:       params.returnUrl,
      notification_url: params.notifyUrl,
    },
  };

  console.error("GoPay createPayment body:", JSON.stringify(body));

  const res = await fetch(`${baseUrl()}/payments/payment`, {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept:         "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`GoPay createPayment failed: ${res.status} ${await res.text()}`);
  }

  return res.json() as Promise<{
    id: number;
    gw_url: string;   // redirect URL for the guest
    state: string;
  }>;
}

// ── Get payment status ─────────────────────────────────────────────────────

export async function getPaymentStatus(paymentId: string) {
  const token = await getAccessToken();

  const res = await fetch(`${baseUrl()}/payments/payment/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`GoPay getPayment failed: ${res.status}`);
  }

  return res.json() as Promise<{
    id: number;
    state: string; // PAID | CREATED | PAYMENT_METHOD_CHOSEN | AUTHORIZED | CANCELED | TIMEOUTED | REFUNDED | PARTIALLY_REFUNDED
    amount: number;
    currency: string;
    order_number: string;
    payer: { contact: { email: string; first_name: string; last_name: string } };
    order_description: string;
  }>;
}
