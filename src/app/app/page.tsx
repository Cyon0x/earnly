"use client";

import Link from "next/link";
import { useMemo } from "react";
import { OpportunityCard, RowCard } from "@/components/cards";
import {
  Button,
  Icon,
  MatchPill,
  Money,
  Progress,
  SectionHeading,
  StageBadge,
  VerifiedBadge,
} from "@/components/ui";
import { OPPORTUNITIES, findOpportunity } from "@/lib/data";
import { useApp } from "@/lib/store";
import { APP_STAGES } from "@/lib/types";

export default function DashboardPage() {
  const { student, applications, txns, verification } = useApp();

  const matched = useMemo(
    () => [...OPPORTUNITIES].sort((a, b) => b.match - a.match).slice(0, 4),
    []
  );
  const hero = matched[0];

  const active = applications.filter((a) =>
    ["Accepted", "In progress", "Submitted"].includes(a.stage)
  );
  const available = txns
    .filter((t) => t.kind === "earning" && t.status === "Paid")
    .reduce((s, t) => s + t.amount, 0);
  const pending = txns.filter((t) => t.kind === "pending").reduce((s, t) => s + t.amount, 0);

  const profileStrength = 82;

  return (
    <div className="mx-auto max-w-[1180px]">
      {/* ------------------------------------------------------------- hero */}
      <section className="tagshape relative overflow-hidden border border-rule bg-raised">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/12 blur-3xl"
        />
        <div className="relative grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">Open now · {matched.length} stalls this week</span>
              {verification === "verified" ? <VerifiedBadge /> : null}
            </div>
            <h1 className="display mt-4 text-[38px] leading-[.95] sm:text-[54px]">
              Work worth
              <br />
              doing, today.
            </h1>
            <p className="mt-4 max-w-[46ch] text-[14.5px] leading-relaxed text-ink2">
              {student.name.split(" ")[0]}, there are {matched.length} listings matched to your skills
              and your timetable. {active.length} of your jobs are moving right now.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button href="/app/ai" iconRight="arrowRight">
                Find opportunities with AI
              </Button>
              <Button href="/app/tasks" variant="outline">
                Browse tasks
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
              <span className="text-ink2">
                Available{" "}
                <Money amount={available} className="text-[15px] text-ink" />
              </span>
              <span className="text-ink2">
                Pending <Money amount={pending} className="text-[15px] text-ink2" />
              </span>
            </div>
          </div>

          {/* the tag: the highest-match listing, hung like a price tag */}
          <Link
            href={`/app/tasks/${hero.id}`}
            className="tagshape-r group block border border-accent/40 bg-accent/[.07] p-5 transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="eyebrow text-accentx">Best match today</span>
              <MatchPill value={hero.match} />
            </div>
            <h2 className="mt-3 text-[20px] font-bold leading-snug">{hero.title}</h2>
            <p className="mt-1.5 text-[13px] text-ink2">{hero.org}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <Money amount={hero.pay.amount} className="text-[22px]" />
                <div className="text-[11.5px] text-ink3">
                  {hero.pay.unit === "fixed" ? "fixed budget" : hero.pay.unit}
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accentx">
                View
                <Icon name="arrowRight" size={15} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ----------------------------------------------------------- match */}
      <section className="mt-10">
        <SectionHeading
          eyebrow="Matched to you"
          title="Open stalls near you"
          action={
            <Link
              href="/app/tasks"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink2 hover:text-ink"
            >
              All opportunities
              <Icon name="arrowRight" size={15} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {matched.map((o) => (
            <OpportunityCard key={o.id} o={o} why={o.matchReasons.slice(0, 2)} />
          ))}
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* ------------------------------------------------------- work */}
        <section>
          <SectionHeading
            eyebrow="Your work"
            title="In flight"
            action={
              <Link
                href="/app/work"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink2 hover:text-ink"
              >
                My work
                <Icon name="arrowRight" size={15} />
              </Link>
            }
          />
          {active.length === 0 ? (
            <p className="text-[13.5px] text-ink3">Nothing in flight. Apply to something above.</p>
          ) : (
            <div className="tagshape divide-y divide-[color:var(--rule)] border border-rule bg-raised px-4">
              {active.map((a) => {
                const o = findOpportunity(a.opportunityId);
                if (!o) return null;
                const step = APP_STAGES.indexOf(a.stage);
                return (
                  <Link
                    key={a.id}
                    href="/app/work"
                    className="block py-4 transition-colors hover:bg-ink/[.03]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-[15px] font-bold">{o.title}</div>
                        <div className="mt-0.5 text-[12.5px] text-ink3">{o.org}</div>
                      </div>
                      <StageBadge stage={a.stage} />
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      {APP_STAGES.map((s, i) => (
                        <span
                          key={s}
                          title={s}
                          className={`h-1 flex-1 rounded-full ${
                            i <= step ? "bg-accent" : "bg-ink/12"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between text-[11.5px] text-ink3">
                      <span>{a.note ?? "Awaiting the next step"}</span>
                      <Money amount={o.pay.amount} currency="" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8">
            <SectionHeading eyebrow="Money" title="Recent payments" />
            <div className="tagshape divide-y divide-[color:var(--rule)] border border-rule bg-raised px-4">
              {txns.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-semibold">{t.label}</div>
                    <div className="text-[11.5px] text-ink3">
                      {t.date} · {t.status}
                    </div>
                  </div>
                  <Money
                    amount={t.amount}
                    currency=""
                    className={`flex-none text-[14px] ${
                      t.kind === "pending" ? "text-ink3" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11.5px] text-ink3">
              Demo figures. No on-chain transaction has been made.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------- sidebar */}
        <aside className="flex flex-col gap-6">
          {/* AI band */}
          <section className="tagshape relative overflow-hidden border border-rule bg-ink p-5 text-ground">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-onaccent">
                <Icon name="ai" size={16} filled />
              </span>
              <span className="text-[12px] font-bold uppercase tracking-[.14em] opacity-70">
                AI opportunity finder
              </span>
            </div>
            <h2 className="display-tight mt-4 text-[24px] leading-[1.05]">
              Let AI search for small jobs for you.
            </h2>
            <p className="mt-2.5 text-[13px] leading-relaxed opacity-80">
              Tell us what you can do, where you want to work and what you are looking for. We will
              find relevant opportunities across the web.
            </p>
            <Link
              href="/app/ai"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-[14px] font-bold text-onaccent"
            >
              Find opportunities with AI
              <Icon name="arrowRight" size={16} />
            </Link>
          </section>

          {/* profile strength */}
          <section className="tagshape border border-rule bg-raised p-5">
            <SectionHeading eyebrow="Reputation" title="Your profile" />
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={student.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <div className="text-[15px] font-bold">{student.name}</div>
                <div className="text-[12px] text-ink3">
                  {student.course} · {student.gradYear}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={profileStrength} label="Profile strength" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { k: "Rating", v: student.rating.toFixed(1) },
                { k: "Completed", v: String(student.completedCount) },
                { k: "On time", v: `${student.completionRate}%` },
              ].map((s) => (
                <div key={s.k} className="tagshape border border-rule px-2 py-3">
                  <div className="figure text-[17px] font-bold">{s.v}</div>
                  <div className="mt-0.5 text-[11px] text-ink3">{s.k}</div>
                </div>
              ))}
            </div>
            <Button href="/app/profile" variant="outline" size="sm" full className="mt-4">
              Strengthen your profile
            </Button>
          </section>

          {/* saved */}
          <section className="tagshape border border-rule bg-raised p-5">
            <SectionHeading eyebrow="Shortlist" title="Saved" />
            <SavedList />
          </section>
        </aside>
      </div>
    </div>
  );
}

function SavedList() {
  const { saved } = useApp();
  const items = saved.map(findOpportunity).filter(Boolean);
  if (items.length === 0)
    return (
      <p className="text-[13px] text-ink3">
        Nothing saved yet. Bookmark a listing to keep it here.
      </p>
    );
  return (
    <div>
      {items.slice(0, 3).map((o) => o && <RowCard key={o.id} o={o} />)}
    </div>
  );
}
