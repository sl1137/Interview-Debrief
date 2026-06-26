import type { ProjectCard } from "./types";
import { uid, nowISO } from "./store";

export function emptyProject(): ProjectCard {
  const ts = nowISO();
  return {
    id: uid("project"),
    createdAt: ts,
    updatedAt: ts,
    projectName: "",
    projectType: "Course project",
    duration: "",
    role: "",
    targetUsers: "",
    projectGoal: "",
    shortDescription: "",
    initialIdeaSource: "",
    realProjectBackground: "",
    whatUserActuallyDid: "",
    methodsUsed: [],
    toolsUsed: [],
    deliverables: [],
    outcome: "",
    timeConstraint: "",
    resourceConstraint: "",
    dataConstraint: "",
    whatWasNotDone: "",
    whyItWasNotDone: "",
    howToExplainInInterview: "",
    skillsDemonstrated: [],
    commonInterviewQuestions: [],
    recommendedAnswerAngles: [],
    thingsNotToOverclaim: [],
    ifChallengedHowToRespond: "",
    tags: [],
  };
}

// Fields that matter most for fair AI feedback — completeness is measured
// against these, with constraint fields weighted because they prevent unfair
// criticism.
const KEY_FIELDS: Array<keyof ProjectCard> = [
  "projectName",
  "projectType",
  "duration",
  "role",
  "projectGoal",
  "shortDescription",
  "whatUserActuallyDid",
  "outcome",
  "timeConstraint",
  "whatWasNotDone",
  "howToExplainInInterview",
  "skillsDemonstrated",
  "recommendedAnswerAngles",
];

export function completeness(p: ProjectCard): number {
  let filled = 0;
  for (const f of KEY_FIELDS) {
    const v = p[f];
    if (Array.isArray(v) ? v.length > 0 : String(v ?? "").trim().length > 0) {
      filled += 1;
    }
  }
  return Math.round((filled / KEY_FIELDS.length) * 100);
}

export function missingKeyFields(p: ProjectCard): boolean {
  return !p.howToExplainInInterview?.trim() || !p.whatWasNotDone?.trim();
}
