import type { ProjectCard } from "./types";

// Seeded into the library on first run so the app is never empty.
export const sampleProjectCard: ProjectCard = {
  id: "project-mini-knowledge",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",

  projectName: "Mini Knowledge",
  projectType: "Course project",
  duration: "4 weeks",
  role: "UX/Product team member",
  targetUsers: "Students interested in fragmented learning",
  projectGoal: "Help users learn small knowledge pieces in a lightweight way",
  shortDescription:
    "A course project exploring an AI-assisted fragmented learning tool.",

  initialIdeaSource:
    "The team started from the initial idea of fragmented learning rather than a full user research process.",
  realProjectBackground:
    "This was a 4-week course group project with limited time for discovery.",
  whatUserActuallyDid:
    "Participated in product thinking, feature discussion, prototype planning, and presentation preparation.",
  methodsUsed: ["Competitive analysis", "Prototyping", "AI-assisted research"],
  toolsUsed: ["Figma", "ChatGPT"],
  deliverables: ["Prototype", "Presentation", "Case study"],
  outcome: "Completed as a course project. No real launch data.",

  timeConstraint: "4 weeks",
  resourceConstraint: "No real product team or engineering launch",
  dataConstraint: "No large-scale user data",
  whatWasNotDone:
    "No full discovery phase, no large user research sample, no A/B testing",
  whyItWasNotDone: "The project timeline and course format were limited.",
  howToExplainInInterview:
    "Because it was a 4-week course project, we started from an initial concept rather than a full discovery phase. Within that constraint, I focused on clarifying the use case, reviewing comparable products, and thinking through how the user flow could support lightweight learning.",

  skillsDemonstrated: [
    "Product thinking",
    "UX thinking",
    "Learning experience design",
    "AI product thinking",
  ],
  commonInterviewQuestions: [
    "How did you identify user needs?",
    "How did you validate the idea?",
    "What was your role?",
    "What would you do differently?",
  ],
  recommendedAnswerAngles: [
    "Be transparent about the 4-week course constraint.",
    "Explain how the team moved from initial idea to use case.",
    "Emphasize what you would do differently with more time.",
  ],
  thingsNotToOverclaim: [
    "Do not claim it was launched.",
    "Do not claim there was full user research if there was not.",
    "Do not claim strong product-market validation.",
  ],
  ifChallengedHowToRespond:
    "I would acknowledge that the project did not include a full research cycle. Then I would explain what lightweight validation we used and what I would do next if the project continued.",

  tags: ["UX", "Product Thinking", "AI", "Research"],
};
