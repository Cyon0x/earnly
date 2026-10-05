import { PageShell, Section } from "@/components/PageShell";

export const metadata = { title: "Privacy Policy — Earnly" };

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="Plain language, and only what we actually do. This policy describes the Earnly prototype as built today."
    >
      <Section title="What we store">
        <p>
          When you create an account we store your email address and, if you sign in with Google, the
          name, email and profile photo Google shares with us. Your provider identity is stored as an
          account link so you can sign in again without creating a second account.
        </p>
        <p>
          Your profile stores what you enter: name, course, graduation year, university, student
          email, student ID number, location, bio, skills, availability and the preferences that
          drive the AI finder.
        </p>
      </Section>

      <Section title="What we do not store">
        <p>
          Student ID card photographs are not uploaded or retained in this prototype — the
          verification screen says so, and the check is simulated. Passwords are stored only as a
          salted scrypt hash; we never keep the password itself.
        </p>
      </Section>

      <Section title="Where it lives">
        <p>
          Data is held in a Neon Postgres database in the EU (London) region and served through
          Vercel. Sign-in with Google means Google processes your Google account data under its own
          privacy policy. We do not sell data, and we do not run advertising trackers.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          We set one strictly necessary cookie: a signed, HttpOnly session cookie that keeps you
          signed in. During Google sign-in we set a short-lived cookie to protect against request
          forgery. There are no analytics or advertising cookies.
        </p>
      </Section>

      <Section title="Your choices">
        <p>
          You can sign out at any time, and you can edit or clear your skills, university and profile
          in the app. To have your account and profile deleted, write to us — we will action requests
          manually while the product is a prototype.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          As features switch on — payments, leasing, loans, pawn, off-ramp — this policy will be
          updated before those features handle your data.
        </p>
      </Section>
    </PageShell>
  );
}
