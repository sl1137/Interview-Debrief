import type { InterviewSession, ProjectCard, Severity } from "./types";
import { completeness, missingKeyFields } from "./project-utils";

export function completedSessions(sessions: InterviewSession[]): InterviewSession[] {
  return sessions
    .filter((s) => s.analysisStatus === "completed" && s.report)
    .sort((a, b) => (a.interviewDate < b.interviewDate ? 1 : -1));
}

const SEVERITY_RANK: Record<Severity, number> = { low: 1, medium: 2, high: 3 };

export type WeaknessAgg = {
  label: string;
  count: number;
  maxSeverity: Severity;
  latestEvidence: string;
  suggestedPractice: string;
};

// Aggregate normalized weakness labels across all completed debriefs.
export function aggregateWeaknesses(sessions: InterviewSession[]): WeaknessAgg[] {
  const map = new Map<string, WeaknessAgg>();
  for (const s of completedSessions(sessions)) {
    for (const w of s.report!.weaknessTags) {
      const cur = map.get(w.label);
      if (!cur) {
        map.set(w.label, {
          label: w.label,
          count: 1,
          maxSeverity: w.severity,
          latestEvidence: w.evidence,
          suggestedPractice: w.suggestedPractice,
        });
      } else {
        cur.count += 1;
        if (SEVERITY_RANK[w.severity] > SEVERITY_RANK[cur.maxSeverity]) {
          cur.maxSeverity = w.severity;
        }
      }
    }
  }
  return [...map.values()].sort(
    (a, b) =>
      b.count - a.count || SEVERITY_RANK[b.maxSeverity] - SEVERITY_RANK[a.maxSeverity]
  );
}

export type Counted = { label: string; count: number };

export function aggregateQuestionTypes(sessions: InterviewSession[]): Counted[] {
  const map = new Map<string, number>();
  for (const s of completedSessions(sessions)) {
    for (const q of s.report!.questionList) {
      map.set(q.questionType, (map.get(q.questionType) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function aggregateRoleDirections(sessions: InterviewSession[]): Counted[] {
  const map = new Map<string, number>();
  for (const s of completedSessions(sessions)) {
    const key = s.roleDirection || "未填写";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function projectsNeedingContext(projects: ProjectCard[]): ProjectCard[] {
  return projects.filter((p) => completeness(p) < 70 || missingKeyFields(p));
}

// Suggested next practice tasks: pull immediate tasks from the most recent reports.
export function suggestedPractice(sessions: InterviewSession[], limit = 4): string[] {
  const out: string[] = [];
  for (const s of completedSessions(sessions)) {
    for (const t of s.report!.practicePlan.immediatePracticeTasks) {
      if (!out.includes(t)) out.push(t);
      if (out.length >= limit) return out;
    }
  }
  return out;
}

// A warm, plain-language insight about the most recurring weakness.
export function growthInsight(sessions: InterviewSession[]): string | null {
  const done = completedSessions(sessions);
  if (done.length < 2) return null;
  const top = aggregateWeaknesses(sessions)[0];
  if (!top || top.count < 2) return null;
  return `在你最近的 ${done.length} 场面试里,最常出现的问题是「${top.label}」(出现了 ${top.count} 次)。这通常不是因为你经历不够,而是表达方式让你的回答显得比实际更弱。下一步可以重点练这一项。`;
}
