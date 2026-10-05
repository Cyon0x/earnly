import { EarnlyMark } from "@/components/AppShell";
import { PageShell, Section } from "@/components/PageShell";
import { Icon } from "@/components/ui";

export const metadata = { title: "Contact — Earnly" };

const EMAIL = "Cyon0x@users.noreply.github.com";
const GITHUB = "https://github.com/Cyon0x/earnly";

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="Contact"
      intro="One person builds this in the open. Questions, bug reports and partnership ideas are all welcome."
    >
      <Section title="Where to reach us">
        <div className="mt-1 flex flex-col gap-3">
          <a
            href={`mailto:${EMAIL}`}
            className="tagshape flex items-center gap-3 border border-rule px-4 py-3.5 transition-colors hover:border-ink/30"
          >
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-accent/15 text-accentx">
              <Icon name="mail" size={17} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold">Gmail</span>
              <span className="block break-all text-[12.5px] text-ink3">{EMAIL}</span>
            </span>
          </a>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer noopener"
            className="tagshape flex items-center gap-3 border border-rule px-4 py-3.5 transition-colors hover:border-ink/30"
          >
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-ink/6 text-ink2">
              <Icon name="github" size={17} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold">GitHub</span>
              <span className="block break-all text-[12.5px] text-ink3">{GITHUB}</span>
            </span>
          </a>
        </div>
      </Section>

      <Section title="About the project">
        <p>
          Earnly is a student opportunity and earning platform: verified students find paid tasks,
          jobs and internships, get paid in USDC, and build a record of real work. The source for this
          prototype lives in the repository above.
        </p>
      </Section>

      <div className="flex items-center gap-3 rounded-[16px] border border-dashed border-rule p-5">
        <EarnlyMark size={26} />
        <p className="text-[13px] text-ink2">
          Since this is a prototype, expect the fastest answer by email. Include the page you were on
          and what you expected to happen.
        </p>
      </div>
    </PageShell>
  );
}
