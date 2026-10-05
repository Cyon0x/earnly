import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { googleAuthUrl, googleConfigured, googleRedirectUri, pkcePair } from "@/lib/auth";
import { randomBytes } from "node:crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const site = process.env.APP_URL || origin;
  if (!googleConfigured()) {
    return NextResponse.redirect(`${site}/signin?error=not_configured`);
  }
  const { verifier, challenge } = pkcePair();
  const state = randomBytes(16).toString("base64url");
  const store = await cookies();
  store.set("earnly_oauth", JSON.stringify({ state, verifier }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  const url = googleAuthUrl({ redirectUri: googleRedirectUri(origin), state, challenge });
  return NextResponse.redirect(url);
}
