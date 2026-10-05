"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { findOpportunity } from "@/lib/data";
import { Button, Icon, Money, SectionHeading, Tag } from "@/components/ui";

export default function PaymentsPage() {
  const { txns, student } = useApp();
  const [notice, setNotice] = useState<string | null>(null);

  const available = txns
    .filter((t) => t.kind === "earning" && t.status === "Paid")
    .reduce((s, t) => s + t.amount, 0);
  const pending = txns.filter((t) => t.kind === "pending").reduce((s, t) => s + t.amount, 0);
  const withdrawn = Math.abs(
    txns.filter((t) => t.kind === "withdrawal").reduce((s, t) => s + t.amount, 0)
  );
  const total = student.earnedTotal;

  return (
    <div className="mx-auto max-w-[1180px]">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Payments</span>
          <h1 className="display mt-2 text-[36px] sm:text-[46px]">Your balance</h1>
          <p className="mt-3 max-w-[58ch] text-[14.5px] leading-relaxed text-ink2">
            Earnly settles in USDC. Money moves into your balance when work is approved, and it is
            yours until you choose to move it out.
          </p>
        </div>
        <Tag tone="quiet">Demo balances — no real funds</Tag>
      </header>

      {/* balance */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="tagshape relative overflow-hidden border border-rule bg-raised p-6 sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/12 blur-3xl"
          />
          <div className="relative">
            <div className="eyebrow">Available now</div>
            <div className="mt-3 flex items-end gap-2">
              <span className="display text-[52px] sm:text-[68px]">
                {available.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span className="mb-2 text-[16px] font-bold text-accentx">USDC</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-5">
              <div>
                <div className="eyebrow mb-1">Pending</div>
                <Money amount={pending} className="text-[18px] text-ink2" />
              </div>
              <div>
                <div className="eyebrow mb-1">Total earned</div>
                <Money amount={total} className="text-[18px]" />
              </div>
              <div>
                <div className="eyebrow mb-1">Withdrawn</div>
                <Money amount={-withdrawn} className="text-[18px] text-ink2" />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => setNotice("Withdrawals open with the off-ramp. Not yet.")}>
                Withdraw
              </Button>
              <Button
                variant="outline"
                onClick={() => setNotice("Bank and mobile money payouts arrive with the off-ramp.")}
              >
                Payout methods
              </Button>
            </div>
            {notice ? (
              <p className="mt-3 inline-flex items-center gap-2 text-[12.5px] text-ink3">
                <Icon name="clock" size={14} />
                {notice}
              </p>
            ) : null}
          </div>
        </div>

        {/* wallet */}
        <div className="tagshape border border-rule bg-raised p-6">
          <div className="eyebrow mb-3">Payout wallet</div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink/8 text-ink2">
              <Icon name="wallet" size={19} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-[14px] font-bold">Demo wallet</div>
              <div className="figure truncate text-[12px] text-ink3">demo1…9f4c</div>
            </div>
          </div>
          <p className="mt-4 text-[12.5px] leading-relaxed text-ink3">
            The wallet layer is kept behind one interface so the real chain can be attached without
            touching the screens. Nothing here is signed, broadcast or stored on a chain.
          </p>
          <Button variant="outline" full className="mt-4" onClick={() => setNotice("Wallet connect is not enabled in the prototype.")}>
            Connect wallet
          </Button>
        </div>
      </section>

      {/* transactions */}
      <section className="mt-9">
        <SectionHeading eyebrow="Ledger" title="Transactions" />
        <div className="tagshape overflow-hidden border border-rule bg-raised">
          <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr] gap-4 border-b border-rule px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-ink3 sm:grid">
            <span>For</span>
            <span>Date</span>
            <span>Reference</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="divide-y divide-[color:var(--rule)]">
            {txns.map((t) => {
              const o = t.opportunityId ? findOpportunity(t.opportunityId) : undefined;
              return (
                <div
                  key={t.id}
                  className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-[1.6fr_1fr_1fr_1fr] sm:items-center sm:gap-4"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold">{t.label}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-ink3 sm:hidden">
                      <span>{t.date}</span>
                      {t.reference ? <span className="figure">{t.reference}</span> : null}
                    </div>
                  </div>
                  <div className="hidden text-[13px] text-ink2 sm:block">{t.date}</div>
                  <div className="figure hidden truncate text-[12px] text-ink3 sm:block">
                    {t.reference ?? "—"}
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        t.status === "Pending"
                          ? "bg-ink/10 text-ink2"
                          : t.kind === "withdrawal"
                            ? "bg-ink/10 text-ink2"
                            : "bg-positive/15 text-positive"
                      }`}
                    >
                      {t.status}
                    </span>
                    <Money
                      amount={t.amount}
                      currency=""
                      className={`text-[14px] ${t.kind === "pending" ? "text-ink2" : ""}`}
                    />
                  </div>
                  {o ? (
                    <div className="col-span-full text-[11.5px] text-ink3">
                      {t.chain} · {o.title}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-ink3">
          References beginning with <span className="figure">demo-ref</span> are placeholders that
          show where a real transaction reference will sit. Earnly has not broadcast any
          transaction.
        </p>
      </section>

      {/* off-ramp teaser */}
      <section className="tagshape mt-9 flex flex-wrap items-center justify-between gap-5 border border-rule bg-raised p-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="eyebrow">Off-ramp</span>
            <span className="rounded-full border border-rule px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-ink3">
              COMING SOON
            </span>
          </div>
          <h2 className="display-tight text-[22px]">USDC to your bank or mobile money</h2>
          <p className="mt-2 max-w-[52ch] text-[13.5px] text-ink2">
            The flow is designed: USDC, then local currency, then a bank account or mobile money
            wallet. It is not switched on yet.
          </p>
        </div>
        <Link
          href="/app/offramp"
          className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2.5 text-[13.5px] font-semibold text-ink2 transition-colors hover:text-ink"
        >
          See the plan
          <Icon name="arrowRight" size={16} />
        </Link>
      </section>
    </div>
  );
}
