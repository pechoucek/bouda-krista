import { NextRequest, NextResponse } from "next/server";
import { calculateTotal, getPeriodMinNights } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const { checkIn, checkOut, apartment } = await req.json();

  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "Missing dates" }, { status: 400 });
  }

  const aptId = apartment ?? "whole";
  const result = calculateTotal(new Date(checkIn), new Date(checkOut), aptId);
  const minNights = getPeriodMinNights(new Date(checkIn), aptId);
  return NextResponse.json({ ...result, minNights });
}
