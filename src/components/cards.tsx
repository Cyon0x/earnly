"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { deadlineIn, postedAgo } from "@/lib/format";
import type { Opportunity, Review } from "@/lib/types";
import { Icon, MatchPill, Money, Stars, Tag, VerifiedBadge } from "./ui";

const KIND_PATH: Record<Opportunity["kind"], string> = {
  task: "/app/tasks",
  job: "/app/jobs",
  internship: "/app/internships",
};

export function payLabel(o: Opportunity) {
  const unit: Record<Opportunity["pay"]["unit"], string> = {
    fixed: "fixed",
    "per hour": "/hour",
    "per week": "/week",
    "per month": "/month",
  };
  return unit[o.pay.unit];
}

export function SaveButton({ id, className = "" }: { id: string; className?: string }) {
  const { saved, toggleSaved } = useApp();
  const on = saved.includes(id);
  return (
    <button
      aria-label={on ? "Remove from saved" : "Save opportunity"}
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(id);
      }}
      className={`grid h-9 w-9 place-items-center rounded-full border transition-colors ${
        on ? "border-accent bg-accent/15 text-accentx" : "border-rule text-ink3 hover:text-ink"
      } ${className}`}
    >
      <Icon name="bookmark" size={16} filled={on} />
    </button>
  );
}

export function OpportunityCard({
  o,
  why,
  sourceLabel,
  compact = false,
}: {
  o: Opportunity;
  why?: string[];
  sourceLabel?: string;
  compact?: boolean;
}) {
  const { applications } = useApp();
  const applied = applications.some((a) => a.opportunityId === o.id);
  const href = `${KIND_PATH[o.kind]}/${o.id}`;

  return (
    <Link
      href={href}
      className="tagshape group relative block border border-rule bg-raised p-4 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:hard-sm sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="eyebrow">{o.category}</span>
            {o.urgent ? (
              <span className="rounded-full bg-negative/15 px-2 py-0.5 text-[10.5px] font-bold text-negative">
                Urgent
              </span>
            ) : null}
            {sourceLabel ? (
              <span className="rounded-full border border-rule px-2 py-0.5 text-[10.5px] text-ink3">
                {sourceLabel}
              </span>
            ) : null}
          </div>
          <h3 className="text-[17px] font-bold leading-snug tracking-[-.01em]">{o.title}</h3>
        </div>
        <div className="flex flex-none items-center gap-2">
          <MatchPill value={o.match} />
          <SaveButton id={o.id} />
        </div>
      </div>

      {!compact ? (
        <p className="mt-2 line-clamp-2 max-w-[52ch] text-[13.5px] text-ink2">{o.summary}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-ink2">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="pin" size={14} />
          {o.mode === "Remote" ? "Remote" : o.location}
        </span>
        <span className="text-ink3">·</span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="clock" size={14} />
          {postedAgo(o.postedDaysAgo)}
        </span>
      </div>

      {why && why.length ? (
        <ul className="mt-3 space-y-1 border-t border-rule pt-3">
          {why.map((w) => (
            <li key={w} className="flex gap-2 text-[12.5px] text-ink2">
              <span className="mt-[3px] text-accentx">
                <Icon name="check" size={13} />
              </span>
              {w}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {o.skills.slice(0, 3).map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
        <div className="text-right">
          <Money amount={o.pay.amount} className="text-[16px]" />
          <div className="text-[11.5px] text-ink3">{payLabel(o)}</div>
        </div>
      </div>

      {applied ? (
        <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-positive">
          <Icon name="check" size={14} />
          Applied
        </div>
      ) : null}
    </Link>
  );
}

export function RowCard({ o }: { o: Opportunity }) {
  const href = `${KIND_PATH[o.kind]}/${o.id}`;
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border-b border-rule py-3.5 transition-colors hover:bg-ink/[.03]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[15px] font-bold">{o.title}</h3>
          <MatchPill value={o.match} size="sm" />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[12.5px] text-ink2">
          <span>{o.org}</span>
          <span className="text-ink3">·</span>
          <span>{o.mode === "Remote" ? "Remote" : o.location}</span>
          <span className="text-ink3">·</span>
          <span>{deadlineIn(o.deadlineDays)}</span>
        </div>
      </div>
      <Money amount={o.pay.amount} className="flex-none text-[14px]" />
      <span className="flex-none text-ink3 transition-transform group-hover:translate-x-0.5">
        <Icon name="chevron" size={16} />
      </span>
    </Link>
  );
}

export function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="tagshape border border-rule bg-raised p-4">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={r.avatar} alt="" className="h-9 w-9 flex-none rounded-full object-cover" />
        <div className="min-w-0">
          <div className="truncate text-[14px] font-bold">{r.author}</div>
          <div className="text-[12px] text-ink3">
            {r.opportunity} · {r.ago}
          </div>
        </div>
        <span className="ml-auto flex-none">
          <Stars value={r.rating} />
        </span>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink2">{r.text}</p>
    </article>
  );
}

export function StudentChip({
  name,
  school,
  earned,
  tasks,
}: {
  name: string;
  school: string;
  earned: number;
  tasks: number;
}) {
  return (
    <div className="tagshape border border-rule bg-raised/90 p-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <VerifiedBadge label="" />
        <span className="text-[13px] font-bold">{name}</span>
      </div>
      <div className="mt-1.5 text-[11.5px] text-ink3">{school}</div>
      <div className="mt-2 flex items-center gap-3 text-[12px]">
        <Money amount={earned} currency="" className="text-positive" />
        <span className="text-ink3">{tasks} tasks</span>
      </div>
    </div>
  );
}
