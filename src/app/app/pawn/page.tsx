"use client";

import { useState } from "react";
import { Button, Icon, Tag } from "@/components/ui";

const ITEMS = ["Watch", "Laptop", "Camera", "Phone", "Jewellery", "Games console", "Other"];
const CONDITION = ["Like new", "Good", "Fair", "Needs repair"];

const STEPS = [
  { n: "01", t: "Select an item", d: "Category, brand and model." },
  { n: "02", t: "Provide item information", d: "Condition, age, accessories, proof of ownership." },
  { n: "03", t: "Receive estimated valuation", d: "A range based on recent comparable sales." },
  { n: "04", t: "Review available terms", d: "Amount, fee, redemption window, storage." },
];

export default function PawnPage() {
  const [item, setItem] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const complete = Boolean(item && condition);

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="tagshape relative overflow-hidden border border-rule bg-raised p-7 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-accent/15 blur-2xl"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-onaccent hard-sm">
              <Icon name="lock" size={20} />
            </span>
            <span className="eyebrow">Earning product</span>
            <span className="rounded-full border border-rule px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-ink3">
              COMING SOON
            </span>
          </div>
          <h1 className="display mt-6 text-[38px] sm:text-[52px]">
            Digital Pawn Shop<span className="text-accentx">.</span>
          </h1>
          <p className="mt-4 max-w-[48ch] text-[16.5px] font-semibold">
            Pledge valuable items digitally and get instant cash with flexible terms.
          </p>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-ink2">
            Describe the item once, see an estimated valuation and read the terms before anything
            changes hands. Valuations and offers are not calculated in this prototype.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Instant valuation", "Secure storage", "Easy redemption"].map((f) => (
              <Tag key={f} tone="quiet">
                {f}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_1fr]">
        <div className="tagshape border border-rule bg-raised p-6">
          <div className="eyebrow mb-3">Step 1 · Select an item</div>
          <div className="flex flex-wrap gap-2">
            {ITEMS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setItem(item === i ? null : i)}
                aria-pressed={item === i}
                className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  item === i
                    ? "border-accent bg-accent text-onaccent"
                    : "border-rule text-ink2 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {i}
              </button>
            ))}
          </div>

          <div className="eyebrow mb-3 mt-6">Step 2 · Condition</div>
          <div className="flex flex-wrap gap-2">
            {CONDITION.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCondition(condition === c ? null : c)}
                aria-pressed={condition === c}
                className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  condition === c
                    ? "border-accent bg-accent/15 text-ink"
                    : "border-rule text-ink2 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-6 border-t border-rule pt-4">
            <Button variant="outline" disabled={!complete} iconRight={complete ? "lock" : undefined} full>
              Get an estimated valuation
            </Button>
            <p className="mt-2.5 text-[12px] leading-relaxed text-ink3">
              {complete
                ? "Valuation is not live. No price is generated, no item is pledged and no cash is advanced."
                : "Choose an item and a condition to see how the flow will read."}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="tagshape border border-rule bg-raised p-6">
            <div className="eyebrow mb-4">The full flow</div>
            <ol className="space-y-3">
              {STEPS.map((s, i) => (
                <li key={s.n} className="flex gap-3">
                  <span
                    className={`figure mt-0.5 text-[12px] ${i < 2 ? "text-accentx" : "text-ink3"}`}
                  >
                    {s.n}
                  </span>
                  <span>
                    <span className="block text-[13.5px] font-semibold">{s.t}</span>
                    <span className="block text-[12.5px] text-ink2">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="tagshape border border-dashed border-rule p-6">
            <div className="eyebrow mb-2">Where it stands</div>
            <p className="text-[13px] leading-relaxed text-ink2">
              Steps 1 and 2 are interactive so you can see the shape of the product. Steps 3 and 4
              need a valuation engine, a storage partner and lending terms — none of which exist
              yet, so they stay switched off.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
