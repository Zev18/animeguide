import { getAnimeDetails } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  try {
    const anime = await getAnimeDetails(parseInt(id!));
    return NextResponse.json(anime);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
