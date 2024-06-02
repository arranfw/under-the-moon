import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json("Unauthorized", {
      status: 401,
    });
  }

  await fetch(`http://${process.env.VERCEL_URL}/connections`);
  return NextResponse.json({ ok: true });
}
