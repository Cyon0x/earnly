"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { OPPORTUNITIES } from "@/lib/data";
import { Icon, Modal } from "./ui";

const NAV = [
  { href: "/app", label: "Dashboard", icon: "grid" },
  { href: "/app/tasks", label: "Tasks", icon: "layers" },
  { href: "/app/jobs", label: "Jobs", icon: "briefcase" },
  { href: "/app/internships", label: "Internships", icon: "cap" },
  { href: "/app/work", label: "My work", icon: "check" },
  { href: "/app/payments", label: "Payments", icon: "wallet" },
  { href: "/app/profile", label: "Profile", icon: "user" },
];

const SOON = [
  { href: "/app/marketplace", label: "Marketplace", icon: "cart" },
  { href: "/app/scholarships", label: "Scholarships", icon: "cap" },
  { href: "/app/social", label: "Social", icon: "users" },
  { href: "/app/offramp", label: "Off-ramp", icon: "bank" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    ready,
    signedIn,
    verification,
    onboarded,
    student,
    notifications,
    markAllRead,
    theme,
    setTheme,
    signOut,
  } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!signedIn) router.replace("/signin");
    else if (verification !== "verified") router.replace("/verify");
    else if (!onboarded) router.replace("/onboarding");
  }, [ready, signedIn, verification, onboarded, router]);

  const unread = notifications.filter((n) => n.unread).length;

  if (!ready || !signedIn || verification !== "verified" || !onboarded) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex items-center gap-3 text-ink3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="text-[13px]">Opening Earnly…</span>
        </div>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      {/* ---------------------------------------------------------- sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-rule p-5 lg:flex">
        <Link href="/app" className="mb-8 flex items-center gap-2.5">
          <EarnlyMark />
          <span className="display-tight text-[19px]">Earnly</span>
        </Link>

        <nav
          className="flex flex-col gap-1"
          aria-label="Main"
          onClick={() => setNotifOpen(false)}
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`tagshape flex items-center gap-3 px-3 py-2.5 text-[13.5px] font-semibold transition-colors ${
                isActive(n.href)
                  ? "bg-accent text-onaccent"
                  : "text-ink2 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <Icon name={n.icon} size={17} />
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="eyebrow mt-8 mb-2 px-3">Coming soon</div>
        <nav
          className="flex flex-col gap-1"
          aria-label="Coming soon"
          onClick={() => setNotifOpen(false)}
        >
          {SOON.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 rounded-full px-3 py-2 text-[13px] transition-colors ${
                isActive(n.href) ? "text-ink" : "text-ink3 hover:text-ink2"
              }`}
            >
              <Icon name={n.icon} size={16} />
              <span className="flex-1">{n.label}</span>
              <span className="rounded-full border border-rule px-1.5 py-0.5 text-[9px] font-bold tracking-wide">
                SOON
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-rule pt-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={student.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-bold">{student.name}</div>
              <div className="truncate text-[11.5px] text-ink3">{student.university}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex-1 rounded-full border border-rule px-3 py-2 text-[12px] text-ink2 transition-colors hover:text-ink"
            >
              {theme === "dark" ? "Light theme" : "Dark theme"}
            </button>
            <button
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="rounded-full border border-rule px-3 py-2 text-[12px] text-ink2 transition-colors hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------------------------------------------------- column */}
      <div className="flex min-h-screen flex-col">
        {/* top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-rule bg-ground/90 px-4 py-3 backdrop-blur lg:px-8">
          <Link href="/app" className="flex items-center gap-2 lg:hidden">
            <EarnlyMark />
            <span className="display-tight text-[17px]">Earnly</span>
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className="ml-auto flex items-center gap-2 rounded-full border border-rule px-3.5 py-2 text-[13px] text-ink3 transition-colors hover:border-ink/30 hover:text-ink2 lg:ml-0 lg:w-[300px]"
          >
            <Icon name="search" size={16} />
            <span className="hidden lg:inline">Search tasks, jobs, internships</span>
            <span className="lg:hidden">Search</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/app/ai"
              className="hidden items-center gap-2 rounded-full bg-accent px-3.5 py-2 text-[13px] font-bold text-onaccent hard-sm sm:flex"
            >
              <Icon name="ai" size={15} filled />
              Find with AI
            </Link>
            <div className="relative">
              <button
                aria-label="Notifications"
                aria-expanded={notifOpen}
                onClick={() => {
                  setNotifOpen((v) => !v);
                  if (!notifOpen) markAllRead();
                }}
                className="relative grid h-9 w-9 place-items-center rounded-full border border-rule text-ink2 transition-colors hover:text-ink"
              >
                <Icon name="bell" size={17} />
                {unread > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#C8361C] px-1 text-[9.5px] font-bold text-white">
                    {unread}
                  </span>
                ) : null}
              </button>
              {notifOpen ? (
                <div className="settle absolute right-0 top-11 z-40 w-[min(88vw,360px)] rounded-[18px] border border-rule bg-raised p-2 shadow-2xl">
                  <div className="px-2 py-1.5 text-[12px] font-bold text-ink3">Notifications</div>
                  <div className="max-h-[340px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="rounded-xl px-2 py-2.5 hover:bg-ink/5">
                        <div className="text-[13px] font-bold">{n.title}</div>
                        <div className="mt-0.5 text-[12.5px] leading-snug text-ink2">{n.body}</div>
                        <div className="mt-1 text-[11px] text-ink3">{n.ago} ago</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <Link href="/app/profile" className="lg:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={student.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 pb-28 pt-5 lg:px-8 lg:pb-16 lg:pt-8">{children}</main>

        {/* mobile nav */}
        <nav
          aria-label="Main"
          className="fixed bottom-0 left-0 right-0 z-30 border-t border-rule bg-ground/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden"
        >
          <div className="flex items-center justify-between">
            {NAV.slice(0, 4).map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10.5px] font-semibold ${
                  isActive(n.href) ? "text-accentx" : "text-ink3"
                }`}
              >
                <Icon name={n.icon} size={19} />
                {n.label === "Internships" ? "Interns" : n.label}
              </Link>
            ))}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10.5px] font-semibold text-ink3"
            >
              <Icon name="grid" size={19} />
              More
            </button>
          </div>
        </nav>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} label="More">
        <div className="mb-4 flex items-center justify-between">
          <span className="display-tight text-[18px]">More</span>
          <button onClick={() => setMenuOpen(false)} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="grid gap-1">
          {[...NAV.slice(4), ...SOON].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              className="tagshape flex items-center gap-3 border border-rule px-4 py-3 text-[14px] font-semibold"
            >
              <Icon name={n.icon} size={18} />
              {n.label}
            </Link>
          ))}
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="mt-4 w-full rounded-full border border-rule px-4 py-3 text-[13px] text-ink2"
        >
          Switch to {theme === "dark" ? "light" : "dark"} theme
        </button>
      </Modal>
    </div>
  );
}

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return OPPORTUNITIES.filter((o) =>
      [o.title, o.org, o.category, ...o.skills].join(" ").toLowerCase().includes(t)
    ).slice(0, 6);
  }, [q]);

  const close = () => {
    setQ("");
    onClose();
  };

  return (
    <Modal open={open} onClose={close} label="Search" wide>
      <div className="flex items-center gap-3 border-b border-rule pb-3">
        <Icon name="search" size={19} className="text-ink3" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by role, skill or who posted it"
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink3"
        />
        <button onClick={close} aria-label="Close search">
          <Icon name="x" size={18} className="text-ink3" />
        </button>
      </div>
      <div className="pt-3">
        {q.trim() === "" ? (
          <p className="px-1 py-6 text-center text-[13.5px] text-ink3">
            Try “React”, “photography”, “remote” or “tutoring”.
          </p>
        ) : results.length === 0 ? (
          <p className="px-1 py-6 text-center text-[13.5px] text-ink3">
            Nothing matches “{q}” yet. Try a skill instead.
          </p>
        ) : (
          <div className="divide-y divide-[color:var(--rule)]">
            {results.map((o) => (
              <Link
                key={o.id}
                href={
                  o.kind === "task"
                    ? `/app/tasks/${o.id}`
                    : o.kind === "job"
                      ? `/app/jobs/${o.id}`
                      : `/app/internships/${o.id}`
                }
                onClick={close}
                className="flex items-center gap-3 py-3"
              >
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-ink/6 text-ink2">
                  <Icon
                    name={o.kind === "task" ? "layers" : o.kind === "job" ? "briefcase" : "cap"}
                    size={16}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-bold">{o.title}</span>
                  <span className="block truncate text-[12px] text-ink3">
                    {o.org} · {o.mode}
                  </span>
                </span>
                <span className="figure flex-none text-[13px]">{o.pay.amount} USDC</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

export function EarnlyMark({ size = 26 }: { size?: number }) {
  return (
    <span
      className="grid flex-none place-items-center bg-accent text-onaccent"
      style={{
        width: size,
        height: size,
        borderRadius: "2px 9px 9px 9px",
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 17.5L12 4l7 13.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.6 13.4h6.8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}
