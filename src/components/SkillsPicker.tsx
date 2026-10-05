"use client";

import { useMemo, useState } from "react";
import { Icon } from "./ui";
import { MAX_SKILLS, searchSkills, sanitizeSkill } from "@/lib/skills";

interface Props {
  value: string[];
  onChange: (skills: string[]) => void;
  /** Hide skills the student already selected elsewhere (onboarding vs AI wizard). */
  suggestions?: string[];
}

export function SkillsPicker({ value, onChange, suggestions = [] }: Props) {
  const [query, setQuery] = useState("");
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const groups = useMemo(() => searchSkills(query, value), [query, value]);
  const selected = value;

  const toggle = (skill: string) => {
    const exists = value.some((s) => s.toLowerCase() === skill.toLowerCase());
    if (exists) {
      onChange(value.filter((s) => s.toLowerCase() !== skill.toLowerCase()));
      return;
    }
    if (value.length >= MAX_SKILLS) {
      setError(`That is the limit — ${MAX_SKILLS} skills. Remove one to add another.`);
      return;
    }
    setError(null);
    onChange([...value, skill]);
  };

  const addCustom = () => {
    const skill = sanitizeSkill(custom);
    if (!skill) {
      setError("Use letters and numbers, up to 40 characters.");
      return;
    }
    if (value.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setError(`“${skill}” is already on your profile.`);
      return;
    }
    if (value.length >= MAX_SKILLS) {
      setError(`That is the limit — ${MAX_SKILLS} skills.`);
      return;
    }
    setError(null);
    onChange([...value, skill]);
    setCustom("");
  };

  const quick = suggestions.filter(
    (s) => !selected.some((x) => x.toLowerCase() === s.toLowerCase())
  );

  return (
    <div>
      {/* selected */}
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">Your skills · {selected.length}</span>
        {selected.length ? (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[12px] font-semibold text-ink3 underline underline-offset-4 hover:text-ink"
          >
            Clear all
          </button>
        ) : null}
      </div>
      <div className="mt-2.5 flex min-h-[52px] flex-wrap gap-2 rounded-[16px] border border-dashed border-rule p-3">
        {selected.length === 0 ? (
          <span className="px-1 py-1.5 text-[13px] text-ink3">
            Nothing yet. Search below, or add a skill of your own.
          </span>
        ) : (
          selected.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggle(skill)}
              aria-label={`Remove ${skill}`}
              className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[13px] font-semibold text-onaccent"
            >
              <Icon name="check" size={13} />
              {skill}
              <span className="opacity-60 transition-opacity group-hover:opacity-100">
                <Icon name="x" size={12} />
              </span>
            </button>
          ))
        )}
      </div>

      {quick.length ? (
        <div className="mt-4">
          <div className="eyebrow mb-2">Suggested</div>
          <div className="flex flex-wrap gap-2">
            {quick.slice(0, 10).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className="rounded-full border border-rule px-3 py-1.5 text-[12.5px] font-semibold text-ink2 hover:border-accent hover:text-ink"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* search */}
      <div className="relative mt-5">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink3">
          <Icon name="search" size={16} />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills — coding, design, writing, tutoring…"
          aria-label="Search skills"
          className="w-full rounded-full border border-rule bg-transparent py-3 pl-11 pr-4 text-[14px] outline-none placeholder:text-ink3 focus:border-accent"
        />
      </div>

      {/* browse */}
      <div className="mt-3 max-h-[320px] overflow-y-auto overscroll-contain pr-1">
        {groups.length === 0 ? (
          <p className="px-1 py-4 text-[13px] text-ink3">
            Nothing matches “{query}”. Add it as a custom skill below.
          </p>
        ) : (
          groups.map((group, gi) => (
            <div key={group.group} className={gi ? "mt-4" : ""}>
              <div className="eyebrow mb-2 px-1">{group.group}</div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const on = selected.some((s) => s.toLowerCase() === skill.toLowerCase());
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggle(skill)}
                      aria-pressed={on}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                        on
                          ? "border-accent bg-accent/15 text-ink"
                          : "border-rule text-ink2 hover:border-ink/30 hover:text-ink"
                      }`}
                    >
                      {on ? <Icon name="check" size={12} /> : null}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* custom */}
      <div className="mt-5 border-t border-rule pt-4">
        <div className="eyebrow mb-2">Can’t find your skill?</div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder="e.g. Drone Photography"
            aria-label="Add your own skill"
            className="w-full rounded-full border border-rule bg-transparent px-4 py-2.5 text-[13.5px] outline-none placeholder:text-ink3 focus:border-accent"
          />
          <button
            type="button"
            onClick={addCustom}
            className="flex-none rounded-full border border-accent bg-accent/10 px-4 py-2.5 text-[13px] font-semibold text-ink"
          >
            + Add your own skill
          </button>
        </div>
        {error ? <p className="mt-2 text-[12.5px] text-negative">{error}</p> : null}
        {!error && !showAll ? (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-2 text-[12px] text-ink3 hover:text-ink2"
          >
            Custom skills are saved to your profile and shown to posters.
          </button>
        ) : null}
      </div>
    </div>
  );
}
