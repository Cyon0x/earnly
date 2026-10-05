import { Browse } from "@/components/Browse";

export const metadata = { title: "Jobs — Earnly" };

export default function JobsPage() {
  return (
    <Browse
      kind="job"
      title="Jobs"
      intro="Part-time and campus roles with a fixed weekly pattern, so you can plan a semester around them. Shift times are stated up front."
    />
  );
}
