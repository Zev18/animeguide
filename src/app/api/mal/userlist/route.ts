import { animeListSort, animeStatus, getMalList } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const malId = req.nextUrl.searchParams.get("malId");
  const limitStr = req.nextUrl.searchParams.get("limit");
  const offsetStr = req.nextUrl.searchParams.get("offset");
  const statusStr = req.nextUrl.searchParams.get("status");
  const sortStr = req.nextUrl.searchParams.get("sort");

  const limit = limitStr ? parseInt(limitStr, 10) : undefined;
  const offset = offsetStr ? parseInt(offsetStr, 10) : undefined;

  const status = statusStr !== null ? (statusStr as animeStatus) : undefined;
  const sort = sortStr !== null ? (sortStr as animeListSort) : undefined;

  try {
    const animes = await getMalList(malId!, limit, offset, status, sort);
    return NextResponse.json(animes);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
