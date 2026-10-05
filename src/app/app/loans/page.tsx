"use client";

import { useState } from "react";
import { Button, Icon, Tag } from "@/components/ui";

const REQUIREMENTS = [
  { t: "A registered business", d: "Sole trader or small shop, trading for at least six months." },
  { t: "Eligible inventory", d: "Stock that can be described, counted and, where needed, insured." },
  { t: "Basic sales records", d: "Receipts, a ledger or platform statements showing turnover." },
  { t: "A repayment plan", d: "Weekly or monthly, sized to the season you are buying for." },
];

const STEPS = [
  { n: "01", t: "Describe your business", d: "Category, location, how long you have traded." },
  { n: "02", t: "Add your inventory", d: "What you hold, what it is worth, what sells." },
  { n: "03", t: "See indicative terms", d: "Amount range, rate and schedule before applying." },
  { n: "04", t: "Decide", d: "No obligation until you accept a written offer." },
];

export default function LoansPage() {
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (t: string) =>
    setChecked((c) => (c.includes(t) ? c.filter((x) => x !== t) : [...c, t]));

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="tagshape relative overflow-hidden border border-rule bg-raised p-7 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/15 blur-2xl"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-onaccent hard-sm">
              <Icon name="chart" size={20} />
            </span>
            <span className="eyebrow">Earning product</span>
            <span className="rounded-full border border-rule px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-ink3">
              COMING SOON
            </span>
          </div>
          <h1 className="display mt-6 text-[38px] sm:text-[52px]">
            Inventory Loans<span className="text-accentx">.</span>
          </h1>
          <p className="mt-4 max-w-[48ch] text-[16.5px] font-semibold">
            Small retailers can get loans against their inventory to expand business.
          </p>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-ink2">
            A retailer with stock on the shelf can use eligible inventory to support financing,
            rather than selling the stock they need for the season ahead. Terms are shown before
            anything is agreed.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Quick disbursal", "Competitive rates", "Business growth"].map((f) => (
              <Tag key={f} tone="quiet">
                {f}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="tagshape border border-rule bg-raised p-6">
          <div className="eyebrow mb-1.5">What a lender would look at</div>
          <p className="text-[13px] text-ink2">
            Tick what you already have. This checklist is not an application and nothing is sent.
          </p>
          <ul className="mt-4 space-y-2">
            {REQUIREMENTS.map((r) => {
              const on = checked.includes(r.t);
              return (
                <li key={r.t}>
                  <button
                    type="button"
                    onClick={() => toggle(r.t)}
                    aria-pressed={on}
                    className={`flex w-full items-start gap-3 border px-4 py-3 text-left transition-colors ${
                      on ? "border-accent bg-accent/10" : "tagshape border-rule hover:border-ink/30"
                    } ${on ? "tagshape" : ""}`}
                  >
                    <span className={`mt-0.5 ${on ? "text-accentx" : "text-ink3"}`}>
                      <Icon name={on ? "check" : "plus"} size={16} />
                    </span>
                    <span>
                      <span className="block text-[13.5px] font-semibold">{r.t}</span>
                      <span className="block text-[12.5px] text-ink2">{r.d}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 border-t border-rule pt-4">
            <Button variant="outline" disabled iconRight="lock" full>
              Explore Inventory Loans
            </Button>
            <p className="mt-2.5 text-[12px] text-ink3">
              Not switched on. No application is submitted, no credit decision is made and no money
              moves on this page.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="tagshape border border-rule bg-raised p-6">
            <div className="eyebrow mb-4">The designed flow</div>
            <ol className="space-y-3">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-3">
                  <span className="figure mt-0.5 text-[12px] text-ink3">{s.n}</span>
                  <span>
                    <span className="block text-[13.5px] font-semibold">{s.t}</span>
                    <span className="block text-[12.5px] text-ink2">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="tagshape border border-dashed border-rule p-6">
            <div className="eyebrow mb-2">Why it is marked coming soon</div>
            <p className="text-[13px] leading-relaxed text-ink2">
              Lending is regulated, and a prototype should not look like a credit product it is not.
              This needs a licensed partner, a real scoring model and written terms before a single
              loan is issued.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
