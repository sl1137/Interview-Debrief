// ===== Core domain types for the Interview Debrief Coach =====

export type InterviewLanguage = "Chinese" | "English" | "Mixed";
export type AnswerLanguage = "Chinese" | "English" | "Bilingual";
export type Severity = "low" | "medium" | "high";
export type PerformanceLevel = "strong" | "okay" | "needs_work" | "missed";
export type AnalysisStatus = "not_started" | "processing" | "completed" | "failed";

// ----- User profile -----

export type UserProfile = {
  name: string;
  targetRoleDirection: string;
  jobSearchStage: string;
  interviewLanguage: InterviewLanguage;
  resumeText: string;
  feedbackStyle: string; // fixed to "Warm but specific" for MVP
};

// ----- Resume ("我的材料") -----

export type ResumeDoc = {
  fileName: string;
  text: string;
  updatedAt: string;
};

// ----- Project Experience Library -----

export type ProjectCard = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Basic information
  projectName: string;
  projectType: string;
  duration: string;
  role: string;
  targetUsers: string;
  projectGoal: string;
  shortDescription: string;

  // Project context
  initialIdeaSource: string;
  realProjectBackground: string;
  whatUserActuallyDid: string;
  methodsUsed: string[];
  toolsUsed: string[];
  deliverables: string[];
  outcome: string;

  // Project constraints
  timeConstraint: string;
  resourceConstraint: string;
  dataConstraint: string;
  whatWasNotDone: string;
  whyItWasNotDone: string;
  howToExplainInInterview: string;

  // Interview preparation
  skillsDemonstrated: string[];
  commonInterviewQuestions: string[];
  recommendedAnswerAngles: string[];
  thingsNotToOverclaim: string[];
  ifChallengedHowToRespond: string;

  // Tags for role relevance
  tags: string[];
};

// ----- Interview session -----

export type SelfReflection = {
  feltHardest?: string;
  questionsUserWantsReviewed?: string;
  emotionalState?: string;
  focusRequest?: string;
};

export type InterviewSession = {
  id: string;
  createdAt: string;
  updatedAt: string;

  interviewTitle: string;
  companyName: string;
  roleTitle: string;
  roleDirection: string;
  interviewRound: string;
  interviewLanguage: InterviewLanguage;
  interviewDate: string;

  jobDescription: string;
  companyContext: string;
  transcriptText: string;
  audioFileUrl?: string;

  relatedProjectIds: string[];

  selfReflection: SelfReflection;

  analysisStatus: AnalysisStatus;
  report?: InterviewDebriefReport;
};

// ----- Report -----

export type InterviewQuestion = {
  id: string;
  interviewerQuestion: string;
  userAnswerSummary: string;
  questionType: string;
  interviewerIntent: string[];
  performanceLevel: PerformanceLevel;
  shouldReviewDeeply: boolean;
};

export type KeyQuestionAnalysis = {
  id: string;
  questionId: string;
  interviewerQuestion: string;
  whatInterviewerWantedToKnow: string[];
  originalAnswerSummary: string;
  mainProblems: string[];
  whyItMatters: string;
  betterAnswerStructure: string[];
  improvedAnswer: {
    language: AnswerLanguage;
    answerText: string;
  };
  naturalPracticeVersion?: {
    language: AnswerLanguage;
    answerText: string;
  };
  relatedProjectContextUsed?: string[];
  followUpQuestions: string[];
};

// Derived "summary view" data sourced from KeyQuestionAnalysis.
export type RewrittenAnswer = {
  id: string;
  questionId: string;
  interviewerQuestion: string;
  language: AnswerLanguage;
  answerText: string;
};

export type SimulatedFollowUp = {
  id: string;
  fromQuestionId: string;
  question: string;
  whyAsked: string;
};

export type WeaknessTag = {
  id: string;
  label: string; // normalized label from DEFAULT_WEAKNESS_LABELS for aggregation
  severity: Severity;
  evidence: string;
  suggestedPractice: string;
};

export type InterviewDebriefReport = {
  id: string;
  interviewSessionId: string;

  overallSummary: {
    mainTopics: string[];
    interviewerLikelyEvaluated: string[];
    overallPerformanceSummary: string;
    topStrengths: string[];
    topIssues: string[];
    nextPriority: string;
  };

  questionList: InterviewQuestion[];
  keyQuestionAnalyses: KeyQuestionAnalysis[];
  rewrittenAnswers: RewrittenAnswer[];
  simulatedFollowUps: SimulatedFollowUp[];
  weaknessTags: WeaknessTag[];

  practicePlan: {
    immediatePracticeTasks: string[];
    beforeNextInterview: string[];
  };
};
