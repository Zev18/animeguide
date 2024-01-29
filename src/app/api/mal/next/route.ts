import { NextRequest, NextResponse } from "next/server";

const headers: HeadersInit = {
  "Content-Type": "application.json",
  "X-MAL-CLIENT-ID": process.env.NEXT_PUBLIC_MAL_CLIENT_ID!,
};

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  try {
    if (!url) throw new Error("Invalid URL");
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Error searching animes");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
