import Link from "next/link";
import { PageShell, Section } from "@/components/PageShell";

export const metadata = { title: "About — Earnly" };

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="About Earnly"
      intro="Earnly is a verified student opportunity and earning platform. Students discover paid work, build a record of it, and access financial tools that fit how they actually earn."
    >
      <Section title="The problem we are pointed at">
        <p>
          Students finish three or four years of study with a transcript and almost nothing that
          shows what they can do. The work they did along the way — tutoring, freelancing, a summer
          shift, a weekend repair job — is invisible to the person reading their first CV.
        </p>
        <p>
          At the same time, small businesses and neighbours need small, quick, trustworthy work done.
          They do not have a way to find a verified student, and they have no reason to trust one.
        </p>
      </Section>

      <Section title="The loop">
        <p>
          Verify → Discover → Apply → Work → Get paid → Build reputation → Gain experience. Every
          part of the product exists to keep that loop turning, and to make the output of it portable
          for the student.
        </p>
        <p>
          Payments are denominated in USDC so that a student in Lagos, Nairobi, São Paulo or Manila
          is paid the same way. Off-ramp to local currency is on the roadmap.
        </p>
      </Section>

      <Section title="Who it is for">
        <p>
          Students and young people anywhere, and the people who need something done. The university
          catalogue covers more than 240 institutions across seven regions, and students can add
          their own if theirs is missing.
        </p>
      </Section>

      <Section title="What exists today">
        <p>
          Accounts and profiles, student verification, university and skill data, the opportunity
          marketplace (paid tasks, jobs and internships), the AI opportunity finder, and the payment
          interface. Asset Leasing, Inventory Loans and the Digital Pawn Shop are previews — their
          pages state plainly that nothing is processed yet.
        </p>
        <p>
          Earnly is a working prototype. Where something is mocked or switching on later, the
          interface says so rather than implying otherwise.
        </p>
      </Section>

      <p className="text-[13.5px] text-ink2">
        Questions?{" "}
        <Link href="/contact" className="font-semibold text-accentx underline underline-offset-4">
          Contact us
        </Link>
        .
      </p>
    </PageShell>
  );
}
