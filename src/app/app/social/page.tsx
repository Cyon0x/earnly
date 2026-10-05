import { ComingSoon } from "@/components/ComingSoon";
import { COMING_SOON } from "@/lib/data";

export const metadata = { title: "Social — Earnly" };

export default function SocialPage() {
  const c = COMING_SOON.social;
  return <ComingSoon title={c.title} tagline={c.tagline} body={c.body} items={c.items} icon="users" />;
}
