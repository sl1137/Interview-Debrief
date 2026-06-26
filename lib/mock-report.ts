import type {
  InterviewSession,
  ProjectCard,
  InterviewDebriefReport,
  InterviewQuestion,
  KeyQuestionAnalysis,
  WeaknessTag,
  RewrittenAnswer,
  SimulatedFollowUp,
  AnswerLanguage,
  PerformanceLevel,
} from "./types";
import { uid } from "./store";

// ---- small helpers --------------------------------------------------------

function answerLang(session: InterviewSession): AnswerLanguage {
  if (session.interviewLanguage === "English") return "English";
  if (session.interviewLanguage === "Mixed") return "Bilingual";
  return "Chinese";
}

const TYPE_KEYWORDS: Array<[string, string[]]> = [
  ["Self introduction", ["introduce", "自我介绍", "tell me about yourself", "介绍一下"]],
  ["User research", ["user need", "user research", "用户需求", "用户研究", "需求"]],
  ["Growth strategy", ["growth", "增长", "acquisition", "retention", "拉新", "留存"]],
  ["Marketing strategy", ["marketing", "营销", "campaign", "投放"]],
  ["SEO", ["seo", "keyword", "关键词", "search intent", "搜索"]],
  ["Content strategy", ["content", "内容", "文案"]],
  ["GTM", ["go to market", "gtm", "launch", "上线", "冷启动"]],
  ["Data metrics", ["metric", "数据", "指标", "conversion", "转化", "kpi"]],
  ["Role motivation", ["why this role", "why us", "为什么", "动机", "为什么想"]],
  ["Behavioral", ["conflict", "challenge", "team", "团队", "冲突", "困难"]],
  ["Reflection", ["differently", "what would you", "复盘", "改进", "反思"]],
  ["Project storytelling", ["project", "项目", "tell me about a", "讲一个"]],
  ["Candidate questions", ["any questions for", "你有什么问题", "想问"]],
];

function guessType(text: string): string {
  const t = text.toLowerCase();
  for (const [type, keys] of TYPE_KEYWORDS) {
    if (keys.some((k) => t.includes(k))) return type;
  }
  return "Project storytelling";
}

function intentForType(type: string): string[] {
  const map: Record<string, string[]> = {
    "User research": [
      "判断你是否理解用户需求需要有依据,而不是凭直觉",
      "评估你的产品思维:从想法到验证的过程",
      "看你能否诚实地说明项目的边界与取舍",
    ],
    "Growth strategy": [
      "考察你是否有结构化的增长思路(漏斗 / 渠道 / 指标)",
      "看你能否把策略和具体数据指标挂钩",
      "判断你是否理解不同阶段的增长重点",
    ],
    "Project storytelling": [
      "判断你能否清楚讲明白一个项目的来龙去脉",
      "评估你在项目里真实承担的角色和决策",
      "看你能否把项目和这个岗位联系起来",
    ],
    "Role motivation": [
      "判断你对这家公司/岗位的了解程度",
      "看你的动机是否真实、具体",
      "评估你和团队/产品的匹配度",
    ],
    "Reflection": [
      "看你是否具备复盘和成长意识",
      "判断你能否客观看待自己的不足",
      "评估你下一步会怎么改进",
    ],
    "Behavioral": [
      "通过具体事例判断你的协作和应对方式",
      "看你在压力/冲突下的处理逻辑",
      "评估你的沟通与责任感",
    ],
  };
  return (
    map[type] ?? [
      "判断你对这个问题的理解深度",
      "评估你回答时的结构和逻辑",
      "看你能否把经历和岗位联系起来",
    ]
  );
}

// Extract interviewer questions (and a rough user answer) from a transcript.
function extractQAs(transcript: string): Array<{ q: string; a: string }> {
  const lines = transcript
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const qas: Array<{ q: string; a: string }> = [];
  let currentQ: string | null = null;
  let currentA: string[] = [];

  const pushCurrent = () => {
    if (currentQ) {
      qas.push({ q: currentQ, a: currentA.join(" ").slice(0, 400) });
    }
    currentQ = null;
    currentA = [];
  };

  const interviewerPrefix = /^(interviewer|面试官|q|问)\s*[:：]/i;
  const candidatePrefix = /^(me|candidate|我|a|答)\s*[:：]/i;

  for (const line of lines) {
    const stripped = line.replace(interviewerPrefix, "").replace(candidatePrefix, "").trim();
    const isQuestion =
      interviewerPrefix.test(line) || /[?？]\s*$/.test(line);
    const isAnswer = candidatePrefix.test(line);

    if (isQuestion && !isAnswer) {
      pushCurrent();
      currentQ = stripped;
    } else if (currentQ) {
      currentA.push(stripped);
    }
  }
  pushCurrent();

  return qas.slice(0, 6);
}

function pickPerformance(idx: number, flagged: boolean): PerformanceLevel {
  if (flagged) return "needs_work";
  const cycle: PerformanceLevel[] = ["okay", "needs_work", "strong", "needs_work", "okay"];
  return cycle[idx % cycle.length];
}

// ---- the generator --------------------------------------------------------

export function generateMockInterviewDebrief(
  session: InterviewSession,
  projects: ProjectCard[]
): InterviewDebriefReport {
  const related = projects.filter((p) => session.relatedProjectIds.includes(p.id));
  const primary = related[0];
  const lang = answerLang(session);
  const company = session.companyName || "这家公司";
  const direction = session.roleDirection || session.roleTitle || "目标岗位";

  // 1) Build question list (from transcript, with a fallback)
  let qas = extractQAs(session.transcriptText);
  if (qas.length === 0) {
    const fallbackQs =
      primary?.commonInterviewQuestions?.length
        ? primary.commonInterviewQuestions
        : ["请做一下自我介绍", "讲一个你最有代表性的项目", "你为什么想做这个方向?"];
    qas = fallbackQs.slice(0, 4).map((q) => ({ q, a: "" }));
  }

  const flagText = (session.selfReflection.questionsUserWantsReviewed ?? "").toLowerCase();

  const questionList: InterviewQuestion[] = qas.map((qa, i) => {
    const type = guessType(qa.q);
    const flagged =
      flagText.length > 0 &&
      qa.q
        .toLowerCase()
        .split(/\s+/)
        .some((w) => w.length > 3 && flagText.includes(w));
    const performanceLevel = pickPerformance(i, flagged);
    return {
      id: `q${i + 1}`,
      interviewerQuestion: qa.q,
      userAnswerSummary:
        qa.a ||
        "(转录中没有清晰捕捉到你对这个问题的回答,建议下次把回答也补充进来。)",
      questionType: type,
      interviewerIntent: intentForType(type),
      performanceLevel,
      shouldReviewDeeply:
        flagged || performanceLevel === "needs_work" || performanceLevel === "missed",
    };
  });

  // 2) Deep analyses for up to 2 questions that need review
  const deepTargets = questionList.filter((q) => q.shouldReviewDeeply).slice(0, 2);
  const keyQuestionAnalyses: KeyQuestionAnalysis[] = deepTargets.map((q) => {
    const projectName = primary?.projectName ?? "你的项目";
    const constraint =
      primary?.timeConstraint || primary?.resourceConstraint || "项目时间和资源有限";
    const notDone = primary?.whatWasNotDone || "没有做完整的流程";
    const howExplain =
      primary?.howToExplainInInterview ||
      "先说明项目背景和限制,再讲你在限制内具体做了什么。";

    const improvedAnswerText =
      lang === "English"
        ? buildImprovedAnswerEN(projectName, constraint, q.questionType, primary)
        : buildImprovedAnswerCN(projectName, constraint, q.questionType, primary);

    return {
      id: uid("analysis"),
      questionId: q.id,
      interviewerQuestion: q.interviewerQuestion,
      whatInterviewerWantedToKnow: q.interviewerIntent,
      originalAnswerSummary:
        q.userAnswerSummary +
        " —— 整体来说,回答里缺少了开头的项目背景与限制说明,导致后面的内容听起来比实际更单薄。",
      mainProblems: [
        `没有在一开始说明${projectName}的背景(${constraint}),面试官容易误以为你没有方法论。`,
        "回答缺少清晰结构,信息是散的,关键决策没有被突出。",
        primary
          ? `你提到"${notDone}",但没有解释在限制内你用了什么轻量方式去弥补。`
          : "没有把这段经历和这个岗位需要的能力明确联系起来。",
      ],
      whyItMatters: `没有上下文时,面试官可能默认你不懂${q.questionType};但只要补上背景和限制,同样的经历就会显得成熟、诚实。这正是你被低估的地方。`,
      betterAnswerStructure: [
        "先交代项目背景(是什么、多长时间、你的角色)",
        "说明当时的限制(时间 / 资源 / 数据)",
        "讲你在限制内具体做了什么、为什么这么决策",
        "用一句反思收尾:有更多时间你会怎么做",
      ],
      improvedAnswer: { language: lang, answerText: improvedAnswerText },
      naturalPracticeVersion: {
        language: lang === "Bilingual" ? "Chinese" : lang,
        answerText:
          lang === "English"
            ? buildNaturalEN(projectName, primary)
            : buildNaturalCN(projectName, primary),
      },
      relatedProjectContextUsed: primary
        ? [
            `${primary.projectName}:${primary.projectType},${primary.duration}`,
            `限制:${[primary.timeConstraint, primary.resourceConstraint, primary.dataConstraint]
              .filter(Boolean)
              .join(" / ")}`,
            primary.whatWasNotDone ? `没有做:${primary.whatWasNotDone}` : "",
          ].filter(Boolean)
        : undefined,
      followUpQuestions: followUpsForType(q.questionType),
    };
  });

  // 3) Derived summary views
  const rewrittenAnswers: RewrittenAnswer[] = keyQuestionAnalyses.map((a) => ({
    id: uid("rewrite"),
    questionId: a.questionId,
    interviewerQuestion: a.interviewerQuestion,
    language: a.improvedAnswer.language,
    answerText: a.improvedAnswer.answerText,
  }));

  const simulatedFollowUps: SimulatedFollowUp[] = keyQuestionAnalyses.flatMap((a) =>
    a.followUpQuestions.map((q) => ({
      id: uid("followup"),
      fromQuestionId: a.questionId,
      question: q,
      whyAsked: "面试官想确认你不是临场编的,而是真的想清楚了背后的逻辑。",
    }))
  );

  // 4) Weakness tags (normalized labels for long-term tracking)
  const weaknessTags: WeaknessTag[] = buildWeaknessTags(session, primary, questionList);

  // 5) Overall summary
  const needsWork = questionList.filter(
    (q) => q.performanceLevel === "needs_work" || q.performanceLevel === "missed"
  ).length;

  const report: InterviewDebriefReport = {
    id: uid("report"),
    interviewSessionId: session.id,
    overallSummary: {
      mainTopics: dedupe(questionList.map((q) => q.questionType)).slice(0, 4),
      interviewerLikelyEvaluated: [
        `你能否清楚解释项目里的决策(面向 ${direction})`,
        "你是否真正理解用户需求 / 业务逻辑",
        "你能否把过去的经历和这个岗位联系起来",
      ],
      overallPerformanceSummary:
        related.length > 0
          ? `这场 ${company} 的面试里,你其实有可以聊的真实经历,但有 ${needsWork} 个问题的回答听起来比你的实际水平更弱——主要是因为你在讲清楚"发生了什么"之前,没有先给出足够的项目背景。`
          : `这场 ${company} 的面试里,有 ${needsWork} 个问题值得重点复盘。整体的问题不在于经历不够,而在于回答的结构和上下文还可以更清楚。`,
      topStrengths: [
        "你对自己做过和没做过的事比较诚实,这是面试里很可贵的特质。",
        "你在复盘时愿意正视哪里答得不好,说明有成长意识。",
        related.length > 0
          ? `你有像「${primary?.projectName}」这样可以连接到 ${direction} 的项目。`
          : "你愿意系统地复盘面试,这本身就会让你进步很快。",
      ],
      topIssues: [
        "回答前没有先交代项目背景和限制。",
        "部分回答缺少清晰的结构,信息是散的。",
        "对面试官真正想考察什么,判断还不够准。",
      ],
      nextPriority:
        "练习用固定结构讲每个项目:背景 → 限制 → 你的角色与决策 → 如果重来你会怎么做。",
    },
    questionList,
    keyQuestionAnalyses,
    rewrittenAnswers,
    simulatedFollowUps,
    weaknessTags,
    practicePlan: {
      immediatePracticeTasks: [
        primary
          ? `用「背景→限制→行动→反思」的结构,重写一遍关于「${primary.projectName}」的回答。`
          : "挑一个核心项目,用「背景→限制→行动→反思」的结构重写回答。",
        "把同一个回答准备 30 秒 / 60 秒 / 90 秒三个版本。",
        "针对 2-3 个 follow-up 问题,各练一遍出声回答。",
      ],
      beforeNextInterview: [
        "复习一下这个方向的基础概念和词汇。",
        "给简历上每个主要项目都建一张项目卡。",
        "为每个项目的限制,准备一句诚实又得体的解释。",
      ],
    },
  };

  return report;
}

// ---- content builders -----------------------------------------------------

// Opening clause that frames the project background + constraint, shared by all
// question types so every rewrite starts from honest context.
function contextOpenerCN(projectName: string, constraint: string, p?: ProjectCard): string {
  const type = p?.projectType ?? "项目";
  const dur = p?.duration ?? constraint;
  return `${projectName}是一个${dur}的${type}`;
}

function buildImprovedAnswerCN(
  projectName: string,
  constraint: string,
  qType: string,
  p?: ProjectCard
): string {
  const opener = contextOpenerCN(projectName, constraint, p);
  const goal = p?.projectGoal || "解决一个具体的用户问题";
  if (qType === "Growth strategy" || qType === "Marketing strategy") {
    return `${opener},目标是${goal}。受限于时间和资源,我们当时没有真正跑过完整的增长漏斗。如果让我重新做增长,我会先想清楚目标用户在哪里、用什么指标衡量(比如激活率或留存),再选 1-2 个低成本渠道做小规模验证,而不是一上来就铺很多内容。先证明单个渠道能跑通,再考虑放大。`;
  }
  if (qType === "Self introduction") {
    return `我目前在找${p ? "相关方向" : "增长方向"}的机会。最能代表我的是${projectName}——一个${opener.replace(`${projectName}是`, "")},我在里面负责${p?.role ?? "产品相关的部分"}。它让我学会了在有限的时间和资源里,怎么把一个想法收敛成清晰的使用场景。我会用一两句讲清楚我做了什么、学到了什么,再说明这和这个岗位的关系。`;
  }
  // default: user research / product storytelling / reflection
  return `${opener},所以我们没有条件做完整的调研流程。它的目标是${goal}。在这个限制下,我把重点放在把核心使用场景讲清楚、看了几个对标产品、并思考用户在什么场景下真正需要它。如果有更多时间,我会先做几场用户访谈来验证这个需求是不是高频痛点,再去比较不同场景、决定优先做哪个功能。`;
}

function contextOpenerEN(projectName: string, constraint: string, p?: ProjectCard): string {
  const type = p?.projectType?.toLowerCase() ?? "project";
  const dur = p?.duration ?? constraint;
  return `${projectName} was a ${dur} ${type}`;
}

function buildImprovedAnswerEN(
  projectName: string,
  constraint: string,
  qType: string,
  p?: ProjectCard
): string {
  const opener = contextOpenerEN(projectName, constraint, p);
  const goal = p?.projectGoal || "solve a specific user problem";
  if (qType === "Growth strategy" || qType === "Marketing strategy") {
    return `${opener} aiming to ${goal}. Given the time and resources, we never really ran a full growth funnel. If I were driving growth now, I'd first get clear on where the target users are and which metric to track (say activation or retention), then pick one or two low-cost channels to validate at small scale, rather than producing a lot of content up front. Prove one channel works, then scale it.`;
  }
  if (qType === "Self introduction") {
    return `I'm currently looking for opportunities in this direction. The work that represents me best is ${projectName} — ${opener.replace(`${projectName} was `, "")} where I focused on ${p?.role ?? "the product side"}. It taught me how to take an idea and narrow it into a clear use case under real time and resource limits. I'd keep it to a sentence or two on what I did and learned, then connect it to this role.`;
  }
  return `${opener}, so we didn't have the scope to run a full discovery process. The goal was to ${goal}. Within that constraint, I focused on making the core use case concrete, looking at a few comparable products, and thinking through when users would actually need this. If I had more time, I would validate the need through short user interviews to check whether it's a frequent pain point, then compare use cases before prioritizing features.`;
}

function buildNaturalCN(projectName: string, p?: ProjectCard): string {
  return `因为${projectName}是个${p?.duration ? `${p.duration}的` : "时间很短的"}${
    p?.projectType ?? "项目"
  },我们一开始没有做完整的研究。我们先从一个想法出发,然后我尽量把使用场景想具体——比如用户到底在什么时候会用到。如果重来一次,我一定会加上几场快速的用户访谈,去确认这是不是一个真问题、哪个场景最重要。`;
}

function buildNaturalEN(projectName: string, p?: ProjectCard): string {
  return `Since ${projectName} was a ${p?.duration ?? "short"} ${
    p?.projectType?.toLowerCase() ?? "project"
  }, we didn't start with a full research phase. We began from an idea, and I tried to make the use case concrete by thinking about when users would actually need it. If I did it again, I'd definitely add quick user interviews to validate whether this was a real problem and which scenario mattered most.`;
}

function followUpsForType(type: string): string[] {
  const map: Record<string, string[]> = {
    "User research": [
      "你会先访谈哪一类用户?为什么是他们?",
      "你怎么判断这是不是一个真实的高频痛点?",
      "你会先验证哪个功能?为什么?",
    ],
    "Growth strategy": [
      "如果预算很有限,你会先做哪个渠道?",
      "你会用哪个指标判断这个策略有没有用?",
      "这个增长打法在冷启动阶段还成立吗?",
    ],
    "Project storytelling": [
      "这个项目里你最关键的一个决策是什么?",
      "如果团队不同意你的判断,你会怎么做?",
      "这段经历和我们这个岗位最相关的点是什么?",
    ],
  };
  return (
    map[type] ?? [
      "能再具体讲讲你当时是怎么决策的吗?",
      "如果再做一次,你会改哪一步?",
      "这件事和这个岗位的关系是什么?",
    ]
  );
}

function buildWeaknessTags(
  session: InterviewSession,
  primary: ProjectCard | undefined,
  questionList: InterviewQuestion[]
): WeaknessTag[] {
  const tags: WeaknessTag[] = [];

  tags.push({
    id: uid("weakness"),
    label: "Missing project context",
    severity: "high",
    evidence: primary
      ? `在聊到「${primary.projectName}」时,没有先说明这是一个${primary.projectType}(${primary.duration})。`
      : "在讲项目时没有先交代背景和限制。",
    suggestedPractice: "练习用背景和限制开头,再进入正题。",
  });

  tags.push({
    id: uid("weakness"),
    label: "Weak understanding of interviewer intent",
    severity: "medium",
    evidence: "回答了问题的字面意思,但没有回应面试官背后真正想评估的能力。",
    suggestedPractice: "回答前先想一句:这个问题面试官到底想考察我什么?",
  });

  const hasStructureIssue = questionList.some(
    (q) => q.performanceLevel === "needs_work"
  );
  if (hasStructureIssue) {
    tags.push({
      id: uid("weakness"),
      label: "Answer structure is unclear",
      severity: "medium",
      evidence: "部分回答信息是散的,关键决策没有被突出。",
      suggestedPractice: "用「背景→限制→行动→反思」的固定结构组织回答。",
    });
  }

  if ((session.selfReflection.emotionalState ?? "").length > 0) {
    tags.push({
      id: uid("weakness"),
      label: "Nervousness affected clarity",
      severity: "low",
      evidence: `你自己提到:${session.selfReflection.emotionalState}`,
      suggestedPractice: "提前把开场 30 秒练到能脱口而出,能明显降低紧张。",
    });
  }

  return tags;
}

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
