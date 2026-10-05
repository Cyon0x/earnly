import Link from "next/link";
import type { ReactNode } from "react";
import { EarnlyMark } from "@/components/AppShell";
import { SiteFooter } from "@/components/landing/SiteFooter";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-rule bg-ground/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-5 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <EarnlyMark size={26} />
            <span className="display-tight text-[19px]">Earnly</span>
          </Link>
          <nav className="ml-auto flex items-center gap-5 text-[13px] font-semibold text-ink2">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <Link href="/signin" className="hover:text-ink">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[820px] px-5 py-14">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display mt-3 text-[36px] sm:text-[46px]">{title}</h1>
        {intro ? (
          <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-ink2">{intro}</p>
        ) : null}
        <div className="mt-10 flex flex-col gap-8">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="tagshape border border-rule bg-raised p-6">
      <h2 className="display-tight text-[20px]">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-[14px] leading-relaxed text-ink2">{children}</div>
    </section>
  );
}
