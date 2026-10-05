import { ComingSoon } from "@/components/ComingSoon";
import { COMING_SOON } from "@/lib/data";

export const metadata = { title: "Off-ramp — Earnly" };

export default function OffRampPage() {
  const c = COMING_SOON.offramp;
  return (
    <div className="mx-auto max-w-[900px]">
      <ComingSoon title={c.title} tagline={c.tagline} body={c.body} items={c.items} icon="bank" />
      <div className="tagshape mt-5 border border-rule bg-raised p-6">
        <div className="eyebrow mb-4">The designed flow</div>
        <div className="flex flex-wrap items-center gap-2">
          {["USDC balance", "Quote in local currency", "Bank account or mobile money", "Receipt"].map(
            (s, i, arr) => (
              <span key={s} className="flex items-center gap-2">
                <span className="tagshape border border-rule px-3.5 py-2 text-[13px] font-semibold">
                  {s}
                </span>
                {i < arr.length - 1 ? (
                  <span className="text-ink3" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </span>
            )
          )}
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-ink3">
          Every step is disabled in this prototype. No quote is fetched and no fiat payment is
          initiated.
        </p>
      </div>
    </div>
  );
}
