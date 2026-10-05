export type OpportunityKind = "task" | "job" | "internship";

export type WorkMode = "Remote" | "On campus" | "Local" | "Hybrid";

export type PayUnit = "fixed" | "per hour" | "per week" | "per month";

export type Category =
  | "Web Development"
  | "Design"
  | "Writing"
  | "Video"
  | "Social Media"
  | "Marketing"
  | "Research"
  | "Tutoring"
  | "Photography"
  | "Event Assistance"
  | "Delivery"
  | "Cleaning"
  | "Moving"
  | "Pet Care"
  | "Babysitting"
  | "Errands"
  | "Other";

export type PosterKind = "Business" | "Student" | "Startup" | "University" | "NGO";

export interface Opportunity {
  id: string;
  kind: OpportunityKind;
  title: string;
  org: string;
  orgKind: PosterKind;
  category: Category;
  summary: string;
  description: string;
  pay: { amount: number; unit: PayUnit };
  mode: WorkMode;
  location: string;
  skills: string[];
  requirements?: string[];
  duration?: string;
  paid?: boolean;
  postedDaysAgo: number;
  deadlineDays: number;
  /** Deterministic demo match score (see lib/ai.ts). */
  match: number;
  matchReasons: string[];
  urgent?: boolean;
  /** Filled in for AI Finder results: where the listing was discovered. */
  source?: { name: string; kind: string; url: string; discoveredAgo: string };
}

export type AppStage =
  | "Applied"
  | "Accepted"
  | "In progress"
  | "Submitted"
  | "Completed"
  | "Paid";

export const APP_STAGES: AppStage[] = [
  "Applied",
  "Accepted",
  "In progress",
  "Submitted",
  "Completed",
  "Paid",
];

export interface Application {
  id: string;
  opportunityId: string;
  stage: AppStage;
  updatedDaysAgo: number;
  note?: string;
  /** Demo-only escrow placeholder. No real chain transaction exists. */
  demoEscrow?: boolean;
}

export interface Txn {
  id: string;
  label: string;
  amount: number;
  kind: "earning" | "withdrawal" | "pending";
  status: "Paid" | "Pending" | "Settled";
  date: string;
  opportunityId?: string;
  /** Demo reference, clearly not a real chain hash. */
  reference?: string;
  chain?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  opportunity: string;
  ago: string;
}

export interface Notif {
  id: string;
  kind:
    | "application"
    | "match"
    | "payment"
    | "deadline"
    | "review"
    | "verification"
    | "ai";
  title: string;
  body: string;
  ago: string;
  unread: boolean;
}

export type VerificationState = "required" | "pending" | "verified" | "failed";

export interface Student {
  name: string;
  avatar: string;
  university: string;
  course: string;
  gradYear: number;
  studentEmail: string;
  studentId: string;
  location: string;
  bio: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  completedCount: number;
  completionRate: number;
  earnedTotal: number;
}

export interface AiPrefs {
  skills: string[];
  kinds: string[];
  tasks: string[];
  radius: string;
  minPay: number;
  payType: "any" | "hourly" | "fixed";
  availability: string[];
}

export interface AiResult extends Opportunity {
  why: string[];
  skillsMatched: string[];
}
