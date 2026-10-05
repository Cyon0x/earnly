import { PageShell, Section } from "@/components/PageShell";

export const metadata = { title: "Terms of Service — Earnly" };

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      intro="These terms cover your use of the Earnly prototype."
    >
      <Section title="Prototype status">
        <p>
          Earnly is a prototype. Features may change, break or be removed. Balances shown in the
          payment screens are demonstration figures, no blockchain transaction is broadcast, and no
          real money moves through the application today.
        </p>
      </Section>

      <Section title="Eligibility">
        <p>
          Earnly is intended for students and young people. Accounts go through student verification
          before they can apply for work, and you agree to provide accurate information about your
          institution and studies.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>
          Do not use Earnly to impersonate anyone, to post unlawful work, to harass other users, or
          to attempt to access accounts or data that are not yours. We may suspend accounts that do.
        </p>
      </Section>

      <Section title="Financial products">
        <p>
          Asset Leasing, Inventory Loans and the Digital Pawn Shop are previews and are not live.
          Nothing on those pages is an offer of credit, a valuation, a pledge or financial advice,
          and no application submitted there is processed.
        </p>
      </Section>

      <Section title="Work and payment">
        <p>
          When paid work is completed, the intended settlement currency is USDC. Until settlement is
          formally switched on, the payment screens are illustrative only. Off-ramp to local currency
          is not available.
        </p>
      </Section>

      <Section title="Content you provide">
        <p>
          You keep ownership of what you write. You grant us permission to store and display it so
          the product can function — for example, showing your skills on your profile to a poster.
        </p>
      </Section>

      <Section title="Contact">
        <p>Questions about these terms are welcome at the address on our contact page.</p>
      </Section>
    </PageShell>
  );
}
