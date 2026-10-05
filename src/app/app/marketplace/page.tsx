import { ComingSoon } from "@/components/ComingSoon";
import { COMING_SOON } from "@/lib/data";

export const metadata = { title: "Marketplace — Earnly" };

export default function MarketplacePage() {
  const c = COMING_SOON.marketplace;
  return (
    <ComingSoon title={c.title} tagline={c.tagline} body={c.body} items={c.items} icon="cart" />
  );
}
