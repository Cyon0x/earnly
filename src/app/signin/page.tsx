"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EarnlyMark } from "@/components/AppShell";
import { Button, Icon, Tag } from "@/components/ui";
import { useApp } from "@/lib/store";

type Mode = "signup" | "signin";

export default function SignInPage() {
  const router = useRouter();
  const { ready, signedIn, verification, onboarded, signIn } = useApp();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !signedIn) return;
    if (verification !== "verified") router.replace("/verify");
    else if (!onboarded) router.replace("/onboarding");
    else router.replace("/app");
  }, [ready, signedIn, verification, onboarded, router]);

  const proceed = (method: "google" | "email") => {
    if (method === "email" && !email.includes("@")) {
      setError("Enter an email address we can reach you at.");
      return;
    }
    if (method === "email" && password.length < 6) {
      setError("Use at least six characters for the demo password.");
      return;
    }
    setError(null);
    signIn(method);
    router.push("/verify");
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
              onClick={() => {
                setBusy("google");
                setTimeout(() => {
                  setBusy(null);
                  proceed("google");
                }, 550);
              }}
              className="flex items-center justify-center gap-3 rounded-full border border-rule bg-raised px-5 py-3.5 text-[14.5px] font-semibold transition-colors hover:border-ink/30"
            >
              <Icon name="google" size={19} />
              {busy === "google" ? "Connecting…" : "Continue with Google"}
            </button>
            <p className="text-center text-[11.5px] text-ink3">
              Demo only — no Google account is contacted.
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
              proceed("email");
            }}
          >
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold">
                {mode === "signup" ? "Student email" : "Email"}
              </span>
              <input
                type="email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least six characters"
                className="w-full rounded-full border border-rule bg-transparent px-4 py-3 text-[14px] outline-none placeholder:text-ink3 focus:border-accent"
              />
            </label>
            {error ? (
              <p className="flex items-center gap-2 text-[12.5px] text-negative">
                <Icon name="x" size={14} />
                {error}
              </p>
            ) : null}
            <Button type="submit" size="lg" full className="mt-1">
              {mode === "signup" ? "Create account" : "Sign in"}
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
            Prototype authentication. No real credentials are stored or sent anywhere.
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
              { k: "Open now", v: "312" },
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
