import { OpportunityDetail } from "@/components/OpportunityDetail";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OpportunityDetail id={id} />;
}
