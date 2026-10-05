"use client";

import { useState } from "react";
import { Button, Icon, Tag } from "@/components/ui";

const ASSETS = [
  { key: "Camera", icon: "layers", note: "Bodies, lenses, lighting kits" },
  { key: "Laptop", icon: "grid", note: "Spare machines and tablets" },
  { key: "Bicycle", icon: "arrowRight", note: "Commuters and weekend riders" },
  { key: "Power tools", icon: "key", note: "Drills, saws, sanders" },
  { key: "Electronics", icon: "box", note: "Projectors, consoles, audio" },
  { key: "Equipment", icon: "briefcase", note: "Lab, sports and field gear" },
  { key: "Musical instruments", icon: "play", note: "Keyboards, guitars, amps" },
  { key: "Other", icon: "plus", note: "Anything you can describe" },
];

const STEPS = [
  { n: "01", t: "List an item", d: "Photos, condition, daily rate." },
  { n: "02", t: "A verified renter books", d: "Only students and verified locals." },
  { n: "03", t: "Hand it over", d: "Pickup window and check-in photos." },
  { n: "04", t: "Get paid per day", d: "Released when the item comes back." },
];

export default function LeasingPage() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="tagshape relative overflow-hidden border border-rule bg-raised p-7 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-2xl"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-onaccent hard-sm">
              <Icon name="layers" size={20} />
            </span>
            <span className="eyebrow">Earning product</span>
            <span className="rounded-full border border-rule px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-ink3">
              LISTINGS COMING SOON
            </span>
          </div>
          <h1 className="display mt-6 text-[38px] sm:text-[52px]">
            Asset Leasing<span className="text-accentx">.</span>
          </h1>
          <p className="mt-4 max-w-[48ch] text-[16.5px] font-semibold">
            Rent out your unused items like cameras, bikes, tools and earn daily income.
          </p>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-ink2">
            Two students on the same campus often own one of everything between them. Leasing turns
            the idle half into income, with verified renters on both sides and a record of every
            handover.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Daily rental income", "Insurance coverage", "Verified renters"].map((f) => (
              <Tag key={f} tone="quiet">
                {f}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="tagshape border border-rule bg-raised p-6">
          <div className="eyebrow mb-1.5">Pick a category</div>
          <p className="text-[13px] text-ink2">
            This is the list you will choose from when you create a listing.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ASSETS.map((a) => {
              const on = picked === a.key;
              return (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => setPicked(on ? null : a.key)}
                  aria-pressed={on}
                  className={`tagshape flex items-start gap-3 border px-4 py-3 text-left transition-colors ${
                    on ? "border-accent bg-accent/10" : "border-rule hover:border-ink/30"
                  }`}
                >
                  <span className={`mt-0.5 ${on ? "text-accentx" : "text-ink3"}`}>
                    <Icon name={a.icon} size={17} />
                  </span>
                  <span>
                    <span className="block text-[13.5px] font-semibold">{a.key}</span>
                    <span className="block text-[12px] text-ink3">{a.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 border-t border-rule pt-4">
            <Button variant="outline" disabled iconRight="lock" full>
              {picked ? `List a ${picked.toLowerCase()}` : "List an asset"}
            </Button>
            <p className="mt-2.5 text-[12px] text-ink3">
              Nothing is listed yet. The listing flow switches on with the leasing marketplace — no
              item has been posted, booked or paid out.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="tagshape border border-rule bg-raised p-6">
            <div className="eyebrow mb-4">How it will work</div>
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
            <div className="eyebrow mb-2">Risk, honestly</div>
            <p className="text-[13px] leading-relaxed text-ink2">
              Lending something you own only works if the other side is accountable. Leasing will
              require verified identities, deposit terms and damage cover before it opens. Until
              those exist, this page stays a preview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
