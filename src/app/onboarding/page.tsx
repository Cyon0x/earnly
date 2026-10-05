"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EarnlyMark } from "@/components/AppShell";
import { Button, Icon, Progress, Tag } from "@/components/ui";
import { DEFAULT_PREFS } from "@/lib/ai";
import { SKILL_OPTIONS } from "@/lib/data";
import { useApp } from "@/lib/store";
import type { AiPrefs } from "@/lib/types";

const LOOKING = [
  "Small paid tasks",
  "Freelance gigs",
  "Part-time work",
  "Internships",
  "Remote work",
  "Local work",
  "One-time jobs",
  "Recurring work",
];

const AVAILABILITY = ["Today", "Weekdays", "Weekends", "Evenings", "Flexible"];
const LOCATION = ["Campus", "Nearby", "City", "Remote", "Anywhere"];

export default function OnboardingPage() {
  const router = useRouter();
  const { ready, signedIn, verification, onboarded, student, completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(student.name);
  const [course, setCourse] = useState(student.course);
  const [year, setYear] = useState(String(student.gradYear));
  const [skills, setSkills] = useState<string[]>(student.skills);
  const [kinds, setKinds] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [radius, setRadius] = useState("Anywhere");

  useEffect(() => {
    if (!ready) return;
    if (!signedIn) router.replace("/signin");
    else if (verification !== "verified") router.replace("/verify");
    else if (onboarded) router.replace("/app");
  }, [ready, signedIn, verification, onboarded, router]);

  const steps = [
    { t: "About you", d: "Confirm the basics from your student record." },
    { t: "Your skills", d: "Pick everything you could be paid for. Add your own if it is missing." },
    { t: "What you are looking for", d: "This drives what the AI finder searches for." },
    { t: "Availability and location", d: "So we only show work you can actually get to." },
  ];

  const finish = () => {
    const prefs: AiPrefs = {
      ...DEFAULT_PREFS,
      skills,
      kinds,
      availability,
      radius,
    };
    completeOnboarding(prefs);
    router.push("/app");
  };

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="mx-auto min-h-screen max-w-[820px] px-5 py-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <EarnlyMark size={26} />
          <span className="display-tight text-[19px]">Earnly</span>
        </Link>
        <span className="text-[12.5px] text-ink3">
          Step {step + 1} of {steps.length} · Setup
        </span>
      </div>

      <div className="mt-6">
        <Progress value={Math.round(((step + 1) / steps.length) * 100)} />
      </div>

      <div className="tagshape mt-8 border border-rule bg-raised p-6 sm:p-8">
        <span className="eyebrow">{steps[step].t}</span>
        <h1 className="display mt-3 text-[30px] sm:text-[36px]">
          {step === 0
            ? "Let’s get your profile right"
            : step === 1
              ? "What can you do?"
              : step === 2
                ? "What are you looking for?"
                : "When and where can you work?"}
        </h1>
        <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-ink2">{steps[step].d}</p>

        <div className="mt-7">
          {step === 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" className="sm:col-span-2">
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </Field>
              <Field label="School">
                <input value={student.university} readOnly className={`${inputCls} opacity-70`} />
              </Field>
              <Field label="Course">
                <input value={course} onChange={(e) => setCourse(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Graduation year">
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  inputMode="numeric"
                  className={inputCls}
                />
              </Field>
              <Field label="Student email">
                <input value={student.studentEmail} readOnly className={`${inputCls} opacity-70`} />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((s) => {
                const on = skills.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggle(skills, setSkills, s)}
                    aria-pressed={on}
                    className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                      on
                        ? "border-accent bg-accent text-onaccent"
                        : "border-rule text-ink2 hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-wrap gap-2">
              {LOOKING.map((s) => {
                const on = kinds.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggle(kinds, setKinds, s)}
                    aria-pressed={on}
                    className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                      on
                        ? "border-accent bg-accent text-onaccent"
                        : "border-rule text-ink2 hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-6">
              <div>
                <div className="eyebrow mb-3">Availability</div>
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY.map((s) => {
                    const on = availability.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggle(availability, setAvailability, s)}
                        aria-pressed={on}
                        className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                          on
                            ? "border-accent bg-accent text-onaccent"
                            : "border-rule text-ink2 hover:border-ink/30 hover:text-ink"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="eyebrow mb-3">Where you can work</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {LOCATION.map((l) => (
                    <button
                      key={l}
                      onClick={() => setRadius(l)}
                      className={`tagshape flex items-center justify-between border px-4 py-3 text-left text-[13.5px] font-semibold transition-colors ${
                        radius === l
                          ? "border-accent bg-accent/10"
                          : "border-rule text-ink2 hover:border-ink/30"
                      }`}
                    >
                      {l}
                      {radius === l ? (
                        <span className="text-accentx">
                          <Icon name="check" size={16} />
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-rule pt-5">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} iconRight="arrowRight">
              Continue
            </Button>
          ) : (
            <Button onClick={finish} iconRight="arrowRight">
              Go to my dashboard
            </Button>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] text-ink3">Already set up?</span>
        <button
          onClick={finish}
          className="text-[12.5px] font-semibold text-ink2 underline underline-offset-4 hover:text-ink"
        >
          Use these answers and go straight to the dashboard
        </button>
        <Tag tone="quiet">Demo</Tag>
      </div>
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
