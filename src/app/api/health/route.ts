import { NextResponse } from "next/server";
import { db, databaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!databaseConfigured) {
    return NextResponse.json({ ok: false, database: false }, { status: 503 });
  }
  try {
    await db()`select 1`;
    return NextResponse.json({ ok: true, database: true });
  } catch (error) {
    console.error("[earnly] health check failed", error);
    return NextResponse.json({ ok: false, database: true }, { status: 500 });
  }
}
