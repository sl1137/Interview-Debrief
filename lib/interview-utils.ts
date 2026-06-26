import type { InterviewSession } from "./types";
import { uid, nowISO } from "./store";

export function emptySession(): InterviewSession {
  const ts = nowISO();
  return {
    id: uid("session"),
    createdAt: ts,
    updatedAt: ts,
    interviewTitle: "",
    companyName: "",
    roleTitle: "",
    roleDirection: "Product Growth",
    interviewRound: "Hiring manager",
    interviewLanguage: "Chinese",
    interviewDate: ts.slice(0, 10),
    jobDescription: "",
    companyContext: "",
    transcriptText: "",
    relatedProjectIds: [],
    selfReflection: {},
    analysisStatus: "not_started",
  };
}
