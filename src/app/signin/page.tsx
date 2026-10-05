"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EarnlyMark } from "@/components/AppShell";
import { Button, Icon, Tag } from "@/components/ui";
import { useApp } from "@/lib/store";

type Mode = "signup" | "signin";

const ERROR_COPY: Record<string, string> = {
  cancelled: "Google sign-in was cancelled. Nothing was changed.",
  google_failed: "Unable to sign in with Google. Please try again.",
  state_mismatch: "That sign-in link expired or was already used. Please try again.",
  not_configured: "Google sign-in is not configured on this deployment yet.",
  no_database: "Accounts are not configured on this deployment yet.",
};

export default function SignInPage() {
  const router = useRouter();
  const { ready, signedIn, verification, onboarded, signIn, refresh, database } = useApp();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"google" | "email" | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (code) setError(ERROR_COPY[code] ?? "Something went wrong signing you in. Please try again.");
  }, []);

  useEffect(() => {
    if (!ready || !signedIn) return;
    if (verification !== "verified") router.replace("/verify");
    else if (!onboarded) router.replace("/onboarding");
    else router.replace("/app");
  }, [ready, signedIn, verification, onboarded, router]);

  /** Real Google OAuth. The demo path is only used when no database is wired. */
  const startGoogle = () => {
    setError(null);
    if (!database) {
      setBusy("google");
      setTimeout(() => {
        setBusy(null);
        signIn("google");
        router.push("/verify");
      }, 450);
      return;
    }
    setBusy("google");
    // OAuth must be a full document navigation, not a client-side route change.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/api/auth/google";
  };

  const submitEmail = async () => {
    setError(null);
    if (!email.includes("@")) return setError("Enter an email address we can reach you at.");
    if (password.length < 8) return setError("Use at least 8 characters for your password.");
    if (!database) {
      signIn("email");
      router.push("/verify");
      return;
    }
    setBusy("email");
    try {
      const res = await fetch("/api/auth/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, email, password }),
      });
      const data = (await res.json()) as { next?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "We could not sign you in. Please try again.");
        setBusy(null);
        return;
      }
      // Pull the new session into the store before routing: the guards on
      // /verify and /onboarding read this context, and a stale snapshot would
      // bounce the student straight back to /signin.
      await refresh();
      router.replace(data.next ?? "/app");
    } catch {
      setError("Network problem — please try again.");
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1.05fr]">
      {/* form side */}
      <div className="flex min-h-screen flex-col px-5 py-8 sm:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <EarnlyMark size={28} />
          <span className="display-tight text-[20px]">Earnly</span>
        </Link>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          <span className="eyebrow">{mode === "signup" ? "Create an account" : "Welcome back"}</span>
          <h1 className="display mt-3 text-[34px] sm:text-[40px]">
            {mode === "signup" ? "Start earning" : "Sign back in"}
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-ink2">
            {mode === "signup"
              ? "Use your student email if you have one. Every account goes through student verification before it can apply for work."
              : "Use the same method you signed up with. Your verification and profile come with you."}
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <button
              type="button"
              onClick={startGoogle}
              disabled={busy !== null}
              aria-busy={busy === "google"}
              className="flex items-center justify-center gap-3 rounded-full border border-rule bg-raised px-5 py-3.5 text-[14.5px] font-semibold transition-colors hover:border-ink/30 disabled:opacity-70"
            >
              <GoogleMark />
              {busy === "google" ? "Connecting…" : "Continue with Google"}
            </button>
            <p className="text-center text-[11.5px] text-ink3">
              {database
                ? "You will be sent to Google and returned here. We only receive your name, email and photo."
                : "Demo mode — no Google account is contacted on this deployment."}
            </p>
          </div>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-[color:var(--rule)]" />
            <span className="text-[12px] text-ink3">or with email</span>
            <span className="h-px flex-1 bg-[color:var(--rule)]" />
          </div>

          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              void submitEmail();
            }}
          >
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold">
                {mode === "signup" ? "Student email" : "Email"}
              </span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@student.university.edu"
                className="w-full rounded-full border border-rule bg-transparent px-4 py-3 text-[14px] outline-none placeholder:text-ink3 focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold">Password</span>
              <input
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-full border border-rule bg-transparent px-4 py-3 text-[14px] outline-none placeholder:text-ink3 focus:border-accent"
              />
            </label>
            {error ? (
              <p role="alert" className="flex items-start gap-2 text-[12.5px] text-negative">
                <span className="mt-0.5 flex-none">
                  <Icon name="x" size={14} />
                </span>
                {error}
              </p>
            ) : null}
            <Button type="submit" size="lg" full className="mt-1" disabled={busy !== null}>
              {busy === "email"
                ? "Please wait…"
                : mode === "signup"
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[13px] text-ink2">
            {mode === "signup" ? "Already have an account?" : "New to Earnly?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setError(null);
              }}
              className="font-semibold text-accentx underline underline-offset-4"
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>

          <p className="mt-4 text-center text-[11.5px] leading-relaxed text-ink3">
            {database
              ? "Passwords are hashed on our server. We never store them in the browser."
              : "Prototype authentication — no credentials are stored or sent anywhere."}
          </p>
        </div>
      </div>

      {/* side panel */}
      <aside className="relative hidden overflow-hidden border-l border-rule lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/hero-campus.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover grayscale-[.4]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[#0B1020] opacity-[.68]" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <Tag tone="quiet" className="mb-5 self-start !text-white/70">
            Students only
          </Tag>
          <h2 className="display max-w-[16ch] text-[40px] leading-[1] text-white">
            The work you do now should count later.
          </h2>
          <p className="mt-5 max-w-[44ch] text-[14.5px] leading-relaxed text-white/75">
            Every task you finish on Earnly leaves a rating, a review and a line of experience.
            That is the difference between a CV and a record.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { k: "Verified students", v: "2,480" },
              { k: "Paid in USDC", v: "184k" },
              { k: "Countries reached", v: "60+" },
            ].map((s) => (
              <div key={s.k} className="rounded-[16px] border border-white/15 bg-white/[.06] px-4 py-3">
                <div className="figure text-[18px] font-bold text-white">{s.v}</div>
                <div className="mt-0.5 text-[11px] text-white/60">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

/** The official four-colour Google G, drawn inline so it never 404s. */
function GoogleMark() {
  return (
    <svg width="19" height="19" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.7 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.3 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.4-4.6 7l7.7 6c4.5-4.2 6.6-10.3 6.6-17.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.2 0 11.5-2 15.4-5.6l-7.7-6c-2.1 1.4-4.8 2.3-7.7 2.3-6.3 0-11.6-3.8-13.5-9.1l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}
