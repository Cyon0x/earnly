import { Browse } from "@/components/Browse";

export const metadata = { title: "Tasks — Earnly" };

export default function TasksPage() {
  return (
    <Browse
      kind="task"
      title="Paid tasks"
      intro="Short, paid pieces of work posted by businesses, staff and other students. Most finish in a day; some run for a few weeks. Every one is posted by a verified account."
    />
  );
}
