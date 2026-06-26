// Option lists & enums used across forms. Keep these stable so long-term
// tracking can aggregate consistently.

export const ROLE_DIRECTIONS = [
  "Product Growth",
  "Marketing",
  "GTM",
  "Content",
  "UX",
  "Product Design",
  "Social Media Marketing",
  "Creator Marketing",
  "Startup Generalist",
  "Other",
] as const;

export const JOB_SEARCH_STAGES = [
  "Internship",
  "Full-time",
  "Coffee chat",
  "Case interview",
  "Portfolio review",
  "Other",
] as const;

export const INTERVIEW_LANGUAGES = ["Chinese", "English", "Mixed"] as const;

export const PROJECT_TYPES = [
  "Course project",
  "Internship project",
  "Work project",
  "Personal project",
  "Hackathon",
  "Startup project",
  "Other",
] as const;

export const METHODS = [
  "User interviews",
  "Survey",
  "Competitive analysis",
  "Market research",
  "SEO research",
  "Keyword research",
  "Content strategy",
  "UX research",
  "Wireframing",
  "Prototyping",
  "Usability testing",
  "Data analysis",
  "AI-assisted research",
  "Other",
] as const;

export const PROJECT_TAGS = [
  "UX",
  "Growth",
  "Marketing",
  "Content",
  "Product Thinking",
  "Research",
  "Strategy",
  "AI",
] as const;

export const INTERVIEW_ROUNDS = [
  "HR screen",
  "Hiring manager",
  "Founder chat",
  "Technical interview",
  "Case interview",
  "Portfolio review",
  "Coffee chat",
  "Other",
] as const;

export const QUESTION_TYPES = [
  "Self introduction",
  "Project storytelling",
  "User research",
  "Growth strategy",
  "Marketing strategy",
  "SEO",
  "Content strategy",
  "GTM",
  "Data metrics",
  "Role motivation",
  "Behavioral",
  "Reflection",
  "Candidate questions",
] as const;

// Normalized weakness labels — long-term tracking aggregates on these exact
// strings, so the analyzer must pick from this list rather than free text.
export const DEFAULT_WEAKNESS_LABELS = [
  "Answer structure is unclear",
  "Missing project context",
  "Missing role relevance",
  "Weak understanding of interviewer intent",
  "Weak industry concept knowledge",
  "Weak marketing/growth vocabulary",
  "Weak data/metrics awareness",
  "Overly vague answer",
  "Answer too long",
  "Answer too short",
  "Did not explain decision-making logic",
  "Did not explain constraints",
  "Did not show reflection",
  "English expression needs improvement",
  "Nervousness affected clarity",
  "Weak candidate questions",
] as const;

// Chinese labels for performance levels shown on the report.
export const PERFORMANCE_LABELS: Record<string, { text: string; tone: string }> = {
  strong: { text: "表现不错", tone: "low" },
  okay: { text: "基本可以", tone: "medium" },
  needs_work: { text: "需要打磨", tone: "high" },
  missed: { text: "几乎没答到", tone: "high" },
};

export const SEVERITY_LABELS: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
};
