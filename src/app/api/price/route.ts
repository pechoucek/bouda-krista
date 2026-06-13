import { NextRequest, NextResponse } from "next/server";
import { calculateTotal } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const { checkIn, checkOut, apartment } = await req.json();

  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "Missing dates" }, { status: 400 });
  }

  const result = calculateTotal(new Date(checkIn), new Date(checkOut), apartment ?? "whole");
  return NextResponse.json(result);
}
