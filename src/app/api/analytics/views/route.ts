import { NextResponse } from "next/server";

import type { Database } from "../../../../../database.types";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);

  return NextResponse.json({}, { status: 200 });
}
