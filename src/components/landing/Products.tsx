import Link from "next/link";
import { Icon } from "@/components/ui";

const ASSET_TYPES = [
  "Camera",
  "Laptop",
  "Bicycle",
  "Power tools",
  "Electronics",
  "Equipment",
  "Musical instruments",
  "Other",
];

const PAWN_STEPS = [
  { n: "01", t: "Select an item", d: "Pick the category and describe what you are pledging." },
  { n: "02", t: "Item information", d: "Condition, age and proof of ownership, entered once." },
  { n: "03", t: "Estimated valuation", d: "See a range before you commit to anything." },
  { n: "04", t: "Review the terms", d: "Compare offers and redemption windows side by side." },
];

/**
 * The three earning products that sit alongside the work marketplace.
 * Nothing here pretends to be live: each panel links to its dashboard page,
 * which states plainly what exists today and what does not.
 */
export function EarningProducts() {
  return (
    <section id="products" className="border-t border-rule">
      <div className="mx-auto max-w-[1240px] px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Beyond the marketplace</span>
            <h2 className="display mt-3 max-w-[26ch] text-[32px] sm:text-[44px]">
              Earn from what you already own.
            </h2>
          </div>
          <p className="max-w-[46ch] text-[14px] leading-relaxed text-ink2">
            Not every student wants a shift. Some have equipment, stock or an item they would
            rather turn into cash. These three products are being built for exactly that.
          </p>
        </div>

        {/* ------------------------------------------------ asset leasing */}
        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
          <article className="tagshape flex flex-col justify-between border border-rule bg-raised p-6 sm:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-accentx">
                  <Icon name="layers" size={13} />
                  Asset Leasing
                </span>
                <span className="rounded-full border border-rule px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-ink3">
                  LISTINGS COMING SOON
                </span>
              </div>
              <h3 className="display-tight mt-4 max-w-[22ch] text-[26px] sm:text-[30px]">
                Rent out your unused items. Earn while you sleep.
              </h3>
              <p className="mt-3 max-w-[54ch] text-[14px] leading-relaxed text-ink2">
                The camera in your drawer, the bike you ride twice a term, the drill your flatmate
                borrows anyway. List an item, set the daily rate, and let verified students and
                neighbours rent it.
              </p>
              <ol className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-semibold text-ink2">
                {["List an item", "A verified renter books it", "You get paid per day"].map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    {i > 0 ? <span className="text-ink3">→</span> : null}
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-2">
                {ASSET_TYPES.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-rule px-3 py-1.5 text-[12px] font-medium text-ink2"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-7 grid gap-3 border-t border-rule pt-5 sm:grid-cols-3">
              {[
                { icon: "wallet", t: "Daily rental income" },
                { icon: "shield", t: "Insurance coverage" },
                { icon: "badge", t: "Verified renters only" },
              ].map((f) => (
                <span key={f.t} className="inline-flex items-center gap-2 text-[12.5px] text-ink2">
                  <span className="text-accentx">
                    <Icon name={f.icon} size={15} />
                  </span>
                  {f.t}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/app/leasing"
                className="inline-flex items-center gap-2 rounded-full border border-ink px-5 py-3 text-[13.5px] font-semibold transition-colors hover:bg-ink hover:text-ground"
              >
                <Icon name="plus" size={15} />
                List an asset
                <span className="text-[11px] font-bold tracking-wide opacity-70">
                  SEE THE PLAN
                </span>
              </Link>
            </div>
          </article>

          {/* -------------------------------------------- inventory loans */}
          <article className="tagshape flex flex-col border border-rule bg-raised p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-ink/6 px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-ink2">
                <Icon name="chart" size={13} />
                Inventory Loans
              </span>
              <span className="rounded-full border border-rule px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-ink3">
                COMING SOON
              </span>
            </div>
            <h3 className="display-tight mt-4 max-w-[20ch] text-[26px]">
              Small retailers can borrow against their stock.
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-ink2">
              If you run a shop or sell on the side, eligible inventory can support working capital
              for the season ahead — without selling the stock you need.
            </p>
            <dl className="mt-6 space-y-3">
              {[
                { t: "Quick disbursal", d: "Decisions in days, not months." },
                { t: "Competitive rates", d: "Shown up front, before you apply." },
                { t: "Business growth", d: "Stock up for the season that pays." },
              ].map((f) => (
                <div key={f.t} className="flex gap-3 border-b border-rule pb-3 last:border-0">
                  <span className="mt-0.5 flex-none text-accentx">
                    <Icon name="check" size={15} />
                  </span>
                  <div>
                    <dt className="text-[13.5px] font-semibold">{f.t}</dt>
                    <dd className="text-[12.5px] text-ink3">{f.d}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <div className="mt-auto pt-6">
              <Link
                href="/app/loans"
                className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-accentx underline underline-offset-4"
              >
                Explore Inventory Loans
                <Icon name="arrowRight" size={15} />
              </Link>
            </div>
          </article>
        </div>

        {/* ---------------------------------------------- digital pawn shop */}
        <article className="tagshape-b mt-4 border border-rule bg-raised p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-ink/6 px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-ink2">
                  <Icon name="lock" size={13} />
                  Digital Pawn Shop
                </span>
                <span className="rounded-full border border-rule px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-ink3">
                  COMING SOON
                </span>
              </div>
              <h3 className="display-tight mt-4 max-w-[20ch] text-[26px] sm:text-[30px]">
                Pledge an item digitally. Get cash on terms you can read.
              </h3>
              <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink2">
                Valuables do not have to mean a trip across town. Describe the item, see an
                estimated valuation, review the terms, and decide — all before anything changes
                hands.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: "chart", t: "Instant valuation" },
                  { icon: "shield", t: "Secure storage" },
                  { icon: "wallet", t: "Easy redemption" },
                ].map((f) => (
                  <span
                    key={f.t}
                    className="tagshape inline-flex items-center gap-2 border border-rule px-3 py-2.5 text-[12.5px] text-ink2"
                  >
                    <span className="text-accentx">
                      <Icon name={f.icon} size={15} />
                    </span>
                    {f.t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="eyebrow mb-3">How it will work</div>
              <ol className="grid gap-2 sm:grid-cols-2">
                {PAWN_STEPS.map((s) => (
                  <li key={s.n} className="tagshape border border-dashed border-rule p-4">
                    <span className="figure text-[12px] text-ink3">{s.n}</span>
                    <div className="mt-1.5 text-[14px] font-bold">{s.t}</div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink2">{s.d}</p>
                  </li>
                ))}
              </ol>
              <Link
                href="/app/pawn"
                className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-accentx underline underline-offset-4"
              >
                See how valuations will work
                <Icon name="arrowRight" size={15} />
              </Link>
            </div>
          </div>
        </article>

        <p className="mt-5 text-[12.5px] leading-relaxed text-ink3">
          Launched products: paid tasks, jobs, internships and the AI finder. Asset Leasing,
          Inventory Loans and the Digital Pawn Shop are previews — no listings, loans, pledges or
          payments are processed for them yet.
        </p>
      </div>
    </section>
  );
}
