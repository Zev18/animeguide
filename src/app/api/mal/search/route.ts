import { searchAnime } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 5;
  const offset = Number(req.nextUrl.searchParams.get("offset"));
  const fields = req.nextUrl.searchParams.get("fields") || "";
  try {
    const results = await searchAnime(query!, limit, offset, fields);
    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
