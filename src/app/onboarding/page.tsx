"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EarnlyMark } from "@/components/AppShell";
import { SkillsPicker } from "@/components/SkillsPicker";
import { UniversityPicker } from "@/components/UniversityPicker";
import { Button, Icon, Progress, Tag } from "@/components/ui";
import { DEFAULT_PREFS } from "@/lib/ai";
import { useApp } from "@/lib/store";
import type { AiPrefs } from "@/lib/types";
import type { University } from "@/lib/universities";

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
  const { ready, signedIn, verification, onboarded, student, user, completeOnboarding, save } =
    useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(student.name);
  const [course, setCourse] = useState(student.course === "Add your course" ? "" : student.course);
  const [year, setYear] = useState(
    student.university === "Add your university" ? "" : String(student.gradYear)
  );
  const [university, setUniversity] = useState<University | null>(null);
  const [skills, setSkills] = useState<string[]>(student.skills);
  const [kinds, setKinds] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [radius, setRadius] = useState("Anywhere");
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  // Resume where the student left off, using what the account already has.
  useEffect(() => {
    if (restored || !user?.profile) return;
    const p = user.profile;
    // One-shot hydration from the account; the fields below start empty.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p.full_name) setName(p.full_name);
    if (p.course) setCourse(p.course);
    if (p.grad_year) setYear(String(p.grad_year));
    if (p.university_name && p.university_country) {
      setUniversity({
        id: p.university_id ?? "custom",
        name: p.university_name,
        country: p.university_country,
        city: p.university_city ?? "",
        region: "Africa",
      });
    }
    if (p.availability?.length) setAvailability(p.availability);
    if (p.looking_for?.length) setKinds(p.looking_for);
    if (p.work_area) setRadius(p.work_area);
    if (typeof p.onboarding_step === "number" && p.onboarding_step > 0) {
      setStep(Math.min(p.onboarding_step, 3));
    }
    setRestored(true);
  }, [user, restored]);

  useEffect(() => {
    if (!ready) return;
    if (!signedIn) router.replace("/signin");
    else if (verification !== "verified") router.replace("/verify");
    else if (onboarded) router.replace("/app");
  }, [ready, signedIn, verification, onboarded, router]);

  const steps = useMemo(
    () => [
      { t: "About you", d: "Confirm the basics from your student record." },
      { t: "Your skills", d: "Pick everything you could be paid for. Add your own if it is missing." },
      { t: "What you are looking for", d: "This drives what the AI finder searches for." },
      { t: "Availability and location", d: "So we only show work you can actually get to." },
    ],
    []
  );

  const persist = (nextStep: number, patch: Record<string, unknown> = {}) => {
    void save({ onboardingStep: nextStep, ...patch }, { quiet: true });
  };

  const goTo = (next: number) => {
    if (next > 0 && !university) {
      setError("Choose your university — search the list or add it manually.");
      setStep(0);
      return;
    }
    if (next > 1 && skills.length === 0) {
      setError("Pick at least one skill so we can match work to you.");
      setStep(1);
      return;
    }
    setError(null);
    setStep(next);
    persist(next);
  };

  const finish = async () => {
    if (!university) {
      setError("Choose your university — search the list or add it manually.");
      setStep(0);
      return;
    }
    if (skills.length === 0) {
      setError("Pick at least one skill so we can match work to you.");
      setStep(1);
      return;
    }
    const prefs: AiPrefs = {
      ...DEFAULT_PREFS,
      skills,
      kinds,
      availability,
      radius,
    };
    const ok = await completeOnboarding(prefs, {
      fullName: name,
      course,
      gradYear: year || undefined,
      university: {
        id: university.id,
        name: university.name,
        country: university.country,
        city: university.city,
        custom: university.id.startsWith("c-"),
      },
      lookingFor: kinds,
      availability,
      workArea: radius,
    });
    if (!ok) {
      setError("We could not save your answers. Check your connection and try again.");
      return;
    }
    setError(null);
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
              <div className="sm:col-span-2">
                <UniversityPicker
                  value={university}
                  onChange={setUniversity}
                  required
                  hint="240+ universities worldwide, or add your own."
                />
              </div>
              <Field label="Course or field of study">
                <input
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Graduation year">
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  inputMode="numeric"
                  placeholder="2028"
                  className={inputCls}
                />
              </Field>
              <Field label="Student email" className="sm:col-span-2">
                <input
                  value={student.studentEmail}
                  readOnly
                  className={`${inputCls} opacity-70`}
                />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <SkillsPicker value={skills} onChange={setSkills} suggestions={DEFAULT_PREFS.skills} />
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

        {error ? (
          <p role="alert" className="mt-6 flex items-center gap-2 text-[12.5px] text-negative">
            <Icon name="x" size={14} />
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-between border-t border-rule pt-5">
          <Button variant="ghost" onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => goTo(step + 1)} iconRight="arrowRight">
              Continue
            </Button>
          ) : (
            <Button onClick={() => void finish()} iconRight="arrowRight">
              Go to my dashboard
            </Button>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] text-ink3">Answers save as you go.</span>
        <Tag tone="quiet">{user ? "Saved to your account" : "Demo"}</Tag>
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
