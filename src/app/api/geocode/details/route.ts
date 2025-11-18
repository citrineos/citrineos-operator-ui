import { NextResponse } from "next/server";
import { getPlaceDetails } from "@lib/server/clients/map/address";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) return NextResponse.json({ error: "Missing placeId" }, { status: 400 });

  try {
    const details = await getPlaceDetails(placeId);
    return NextResponse.json(details);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
