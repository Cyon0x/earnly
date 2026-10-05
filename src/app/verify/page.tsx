"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EarnlyMark } from "@/components/AppShell";
import { Button, Icon, Progress, Tag, VerifiedBadge } from "@/components/ui";
import { useApp } from "@/lib/store";

const SCHOOLS = [
  "University of Lagos",
  "University of Ibadan",
  "Obafemi Awolowo University",
  "Ahmadu Bello University",
  "University of Nigeria, Nsukka",
  "Covenant University",
  "Other",
];

export default function VerifyPage() {
  const router = useRouter();
  const { ready, signedIn, verification, submitVerification, approveVerification, failVerification, resetVerification, onboarded, student } = useApp();
  const [form, setForm] = useState({
    name: student.name,
    school: student.university,
    studentEmail: student.studentEmail,
    studentId: student.studentId,
    course: student.course,
    year: String(student.gradYear),
  });
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!signedIn) router.replace("/signin");
  }, [ready, signedIn, router]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const complete = () => router.push(onboarded ? "/app" : "/onboarding");

  return (
    <div className="mx-auto min-h-screen max-w-[960px] px-5 py-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <EarnlyMark size={26} />
          <span className="display-tight text-[19px]">Earnly</span>
        </Link>
        <span className="text-[12.5px] text-ink3">Step 2 of 4 · Student verification</span>
      </div>

      <div className="mt-6">
        <Progress value={verification === "verified" ? 75 : 50} />
      </div>

      {/* ------------------------------------------------------- required */}
      {verification === "required" ? (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div className="tagshape border border-rule bg-raised p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 text-accentx">
                <Icon name="shield" size={18} />
              </span>
              <span className="eyebrow">Verified students only</span>
            </div>
            <h1 className="display mt-4 text-[30px] sm:text-[36px]">Confirm you are a student</h1>
            <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-ink2">
              Earnly is student-only, so we check every account before it can apply for work. It
              takes a minute. Your ID document is used for this check and then discarded — posters
              only ever see the badge.
            </p>

            <form
              className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                submitVerification();
              }}
            >
              <Field label="Full name" className="sm:col-span-2">
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="School or university">
                <select
                  value={form.school}
                  onChange={(e) => set("school", e.target.value)}
                  className={inputCls}
                >
                  {SCHOOLS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Course or field of study">
                <input
                  required
                  value={form.course}
                  onChange={(e) => set("course", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Student email">
                <input
                  required
                  type="email"
                  value={form.studentEmail}
                  onChange={(e) => set("studentEmail", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Student ID number">
                <input
                  required
                  value={form.studentId}
                  onChange={(e) => set("studentId", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Graduation year">
                <input
                  required
                  inputMode="numeric"
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Student ID card (optional)">
                <label className="flex cursor-pointer items-center gap-3 rounded-full border border-dashed border-rule px-4 py-2.5 text-[13px] text-ink3 hover:text-ink">
                  <Icon name="plus" size={16} />
                  {fileName ?? "Upload a photo"}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
              </Field>

              <div className="sm:col-span-2">
                <Button type="submit" size="lg" full iconRight="arrowRight">
                  Submit for verification
                </Button>
                <p className="mt-2.5 text-center text-[11.5px] text-ink3">
                  Nothing is uploaded in this prototype. The check is simulated on the next screen.
                </p>
              </div>
            </form>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="tagshape border border-rule bg-raised p-5">
              <div className="eyebrow mb-3">What we check</div>
              <ul className="space-y-2.5">
                {[
                  "Your name matches a student record",
                  "The email domain belongs to the school",
                  "Your course and graduation year line up",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-[13px] text-ink2">
                    <span className="mt-0.5 flex-none text-accentx">
                      <Icon name="check" size={14} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="tagshape border border-rule bg-raised p-5">
              <div className="eyebrow mb-2">Why it is worth it</div>
              <p className="text-[13px] leading-relaxed text-ink2">
                Poster trust is the whole product. A verified badge is why a bakery is willing to
                send a student 150 USDC for a landing page.
              </p>
              <div className="mt-3">
                <VerifiedBadge />
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {/* -------------------------------------------------------- pending */}
      {verification === "pending" ? (
        <div className="mx-auto mt-8 max-w-[620px]">
          <div className="tagshape border border-rule bg-raised p-7 text-center sm:p-9">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accentx">
              <Icon name="clock" size={26} />
            </span>
            <h1 className="display mt-5 text-[28px]">Verification in review</h1>
            <p className="mx-auto mt-3 max-w-[46ch] text-[14px] leading-relaxed text-ink2">
              We are checking your student record. This usually takes a few minutes. You will get a
              notification the moment it is approved, and you can start browsing while you wait.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => {
                  approveVerification();
                }}
              >
                Simulate approved
              </Button>
              <Button variant="outline" onClick={failVerification}>
                Simulate a problem
              </Button>
            </div>
            <p className="mt-4 text-[11.5px] text-ink3">
              Those two buttons exist because this is a prototype. A real deployment would wait on
              the verification provider.
            </p>
          </div>
        </div>
      ) : null}

      {/* --------------------------------------------------------- verified */}
      {verification === "verified" ? (
        <div className="mx-auto mt-8 max-w-[620px]">
          <div className="tagshape border border-rule bg-raised p-7 text-center sm:p-9">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-positive/20 text-positive">
              <Icon name="check" size={28} />
            </span>
            <h1 className="display mt-5 text-[28px]">You are verified</h1>
            <p className="mx-auto mt-3 max-w-[46ch] text-[14px] leading-relaxed text-ink2">
              Your student record is confirmed and the badge is on your profile. Next: tell us what
              you can do so we can match work to you.
            </p>
            <div className="mt-5 flex justify-center">
              <VerifiedBadge />
            </div>
            <Button size="lg" className="mt-7" full onClick={complete} iconRight="arrowRight">
              Continue to onboarding
            </Button>
          </div>
        </div>
      ) : null}

      {/* ----------------------------------------------------------- failed */}
      {verification === "failed" ? (
        <div className="mx-auto mt-8 max-w-[620px]">
          <div className="tagshape border border-negative/40 bg-raised p-7 sm:p-9">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-negative/15 text-negative">
              <Icon name="x" size={24} />
            </span>
            <h1 className="display mt-5 text-[28px]">We could not confirm your record</h1>
            <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink2">
              The name and student number we received did not match a record at the school you
              chose. This is usually a typo, or a school that has not shared its student list yet.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Check the spelling of your name exactly as the school has it",
                "Make sure the student number has no spaces",
                "Try your student email instead of your personal one",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[13.5px] text-ink2">
                  <span className="mt-0.5 flex-none text-accentx">
                    <Icon name="arrowRight" size={14} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={resetVerification}>Try again</Button>
              <Button variant="ghost">Contact support</Button>
            </div>
            <div className="mt-5 border-t border-rule pt-4">
              <Tag tone="quiet">Your account is paused until this is resolved</Tag>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const inputCls =
  "w-full rounded-full border border-rule bg-transparent px-4 py-3 text-[14px] outline-none placeholder:text-ink3 focus:border-accent";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-semibold">{label}</span>
      {children}
    </label>
  );
}
