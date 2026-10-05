import { ComingSoon } from "@/components/ComingSoon";
import { COMING_SOON } from "@/lib/data";

export const metadata = { title: "Scholarships — Earnly" };

export default function ScholarshipsPage() {
  const c = COMING_SOON.scholarships;
  return (
    <ComingSoon title={c.title} tagline={c.tagline} body={c.body} items={c.items} icon="cap" />
  );
}
