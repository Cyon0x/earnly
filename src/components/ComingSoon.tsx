"use client";

import { useState } from "react";
import { Button, Icon, Tag } from "./ui";

export function ComingSoon({
  title,
  tagline,
  body,
  items,
  icon = "layers",
  accentWord,
}: {
  title: string;
  tagline: string;
  body: string;
  items: string[];
  icon?: string;
  accentWord?: string;
}) {
  const [noted, setNoted] = useState(false);

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="tagshape relative overflow-hidden border border-rule bg-raised p-7 sm:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-2xl"
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-onaccent hard-sm">
              <Icon name={icon} size={20} />
            </span>
            <span className="eyebrow">Coming soon</span>
          </div>

          <h1 className="display mt-6 text-[42px] sm:text-[64px]">
            {title}
            {accentWord ? <span className="text-accentx">.</span> : null}
          </h1>
          <p className="mt-4 max-w-[46ch] text-[17px] font-semibold text-ink">{tagline}</p>
          <p className="mt-3 max-w-[62ch] text-[14.5px] leading-relaxed text-ink2">{body}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {items.map((i) => (
              <Tag key={i} tone="quiet">
                {i}
              </Tag>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-rule pt-6">
            <Button
              variant={noted ? "outline" : "primary"}
              onClick={() => setNoted(true)}
              iconRight={noted ? undefined : "bell"}
            >
              {noted ? "On the list" : "Tell me when it opens"}
            </Button>
            <span className="text-[12.5px] text-ink3">
              Not built yet — signing up here only marks your interest in this demo.
            </span>
          </div>
        </div>
      </div>

      <div className="tagshape mt-5 border border-dashed border-rule p-5">
        <div className="eyebrow mb-2">What exists today</div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink2">
          {["Verified students", "Paid tasks", "Jobs", "Internships", "Payments", "AI finder"].map(
            (x) => (
              <span key={x} className="inline-flex items-center gap-1.5">
                <span className="text-positive">
                  <Icon name="check" size={14} />
                </span>
                {x}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
