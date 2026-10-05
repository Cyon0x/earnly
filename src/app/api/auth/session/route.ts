import { NextResponse } from "next/server";
import { databaseConfigured } from "@/lib/db";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!databaseConfigured) {
    return NextResponse.json({ user: null, database: false });
  }
  try {
    const user = await getSession();
    return NextResponse.json({ user, database: true });
  } catch (error) {
    console.error("[earnly] session lookup failed", error);
    return NextResponse.json({ user: null, database: true, error: "unavailable" });
  }
}
