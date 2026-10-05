/**
 * The skill library students pick from. Grouped so the selector stays
 * scannable as it grows, and deliberately wider than "tech" — these are the
 * things students actually get paid for.
 */
export interface SkillGroup {
  group: string;
  skills: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    group: "Technology",
    skills: [
      "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Node.js", "Python",
      "Java", "C++", "C#", "PHP", "SQL", "Solidity", "Rust", "Go", "HTML", "CSS",
      "Tailwind CSS", "Git", "GitHub", "API Development", "Backend Development",
      "Frontend Development", "Full Stack Development", "Mobile App Development", "WordPress",
      "Web Development", "QA Testing", "Software Testing", "Cybersecurity", "Network Security",
      "Cloud Computing", "DevOps", "Data Analysis", "Data Science", "Machine Learning",
      "Artificial Intelligence", "Prompt Engineering", "Technical Support", "Excel",
      "Google Sheets", "Automation", "No-code",
    ],
  },
  {
    group: "Design",
    skills: [
      "Graphic Design", "UI Design", "UX Design", "UI/UX", "Figma", "Adobe Photoshop",
      "Adobe Illustrator", "Adobe Premiere Pro", "Canva", "Motion Design", "Brand Design",
      "Logo Design", "Illustration", "Presentation Design", "Product Design", "Prototyping",
      "3D Design", "Print Design",
    ],
  },
  {
    group: "Writing & communication",
    skills: [
      "Writing", "Copywriting", "Technical Writing", "Blog Writing", "Article Writing", "Editing",
      "Proofreading", "Research", "Content Writing", "Script Writing", "Creative Writing",
      "Translation", "Transcription", "Journalism", "Public Speaking", "Communication",
    ],
  },
  {
    group: "Marketing & growth",
    skills: [
      "Digital Marketing", "Social Media Management", "Social Media Marketing", "SEO",
      "Email Marketing", "Content Marketing", "Community Management", "Community Growth",
      "Influencer Marketing", "Brand Strategy", "Growth Marketing", "Lead Generation", "Sales",
      "Business Development", "Customer Support", "Customer Service", "Market Research",
    ],
  },
  {
    group: "Media & creative",
    skills: [
      "Photography", "Videography", "Video Editing", "Short-form Video", "YouTube", "Podcasting",
      "Voiceover", "Animation", "Music Production", "Audio Editing", "Event Photography",
      "Event Videography", "Drone Photography", "Photo Editing",
    ],
  },
  {
    group: "Business & professional",
    skills: [
      "Accounting", "Bookkeeping", "Financial Analysis", "Business Analysis", "Project Management",
      "Product Management", "Operations", "Virtual Assistance", "Data Entry",
      "Administrative Support", "Recruiting", "Human Resources", "Entrepreneurship", "Notion",
      "Spreadsheets", "Event Planning",
    ],
  },
  {
    group: "Education",
    skills: [
      "Tutoring", "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
      "Language Teaching", "English Teaching", "Academic Research", "Exam Preparation", "Mentoring",
    ],
  },
  {
    group: "Practical & local",
    skills: [
      "Fashion Design", "Sewing", "Hair Styling", "Makeup", "Cooking", "Baking", "Fitness Training",
      "Personal Training", "Crafts", "Jewelry Making", "Repair", "Electronics", "Carpentry",
      "Cleaning", "Moving", "Delivery", "Errands", "Pet Care", "Babysitting", "Dog Walking",
      "Driving", "Gardening",
    ],
  },
];

export const ALL_SKILLS: string[] = [...new Set(SKILL_GROUPS.flatMap((g) => g.skills))].sort((a, b) =>
  a.localeCompare(b)
);

export const MAX_SKILLS = 40;
export const MAX_SKILL_LENGTH = 40;

export function sanitizeSkill(raw: string): string | null {
  const skill = raw.replace(/\s+/g, " ").trim();
  if (!skill || skill.length > MAX_SKILL_LENGTH) return null;
  if (!/^[\p{L}\p{N}][\p{L}\p{N}\s.+#/&'’()-]*$/u.test(skill)) return null;
  return skill === skill.toLowerCase() && skill.length > 3
    ? skill.replace(/\b\p{L}/gu, (c) => c.toUpperCase())
    : skill;
}

/** Case-insensitive duplicate check, so "React" and "react" cannot both exist. */
export function mergeSkills(existing: string[], incoming: string[]): string[] {
  const seen = new Set(existing.map((s) => s.toLowerCase()));
  const out = [...existing];
  for (const raw of incoming) {
    const skill = sanitizeSkill(raw);
    if (!skill) continue;
    const key = skill.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(skill);
    if (out.length >= MAX_SKILLS) break;
  }
  return out;
}

export function searchSkills(query: string, selected: string[] = [], limit = 60): SkillGroup[] {
  const q = query.trim().toLowerCase();
  const chosen = new Set(selected.map((s) => s.toLowerCase()));
  const matches = (s: string) => (q ? s.toLowerCase().includes(q) : true);
  if (q) {
    const flat = ALL_SKILLS.filter(matches).slice(0, limit);
    return flat.length ? [{ group: "Matches", skills: flat }] : [];
  }
  return SKILL_GROUPS.map((g) => ({
    group: g.group,
    skills: g.skills.filter((s) => !chosen.has(s.toLowerCase())).slice(0, limit),
  })).filter((g) => g.skills.length);
}
