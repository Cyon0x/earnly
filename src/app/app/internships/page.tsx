import { Browse } from "@/components/Browse";

export const metadata = { title: "Internships — Earnly" };

export default function InternshipsPage() {
  return (
    <Browse
      kind="internship"
      title="Internships"
      intro="Three to six months inside a company, with a mentor and real work. These are the placements that turn into a graduate offer or a portfolio you can defend in an interview."
    />
  );
}
