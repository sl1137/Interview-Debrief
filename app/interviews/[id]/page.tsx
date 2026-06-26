"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { InterviewSession, InterviewQuestion } from "@/lib/types";
import { getSession } from "@/lib/store";
import { PERFORMANCE_LABELS, SEVERITY_LABELS } from "@/lib/constants";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Bullets,
  Collapsible,
  SectionTitle,
  Label,
} from "@/components/ui";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const [session, setSession] = useState<InterviewSession | null | undefined>(undefined);

  useEffect(() => {
    setSession(getSession(params.id) ?? null);
  }, [params.id]);

  if (session === undefined) {
    return <p className="text-sm text-[var(--muted)]">加载中…</p>;
  }
  if (session === null || !session.report) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[var(--muted)]">找不到这份复盘报告。</p>
        <Link href="/interviews/new">
          <Button variant="secondary">新建一次复盘</Button>
        </Link>
      </div>
    );
  }

  const r = session.report;
  const o = r.overallSummary;

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/projects"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ← 返回
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {session.interviewTitle}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          {session.companyName ? <span>{session.companyName}</span> : null}
          <Badge tone="neutral">{session.interviewRound}</Badge>
          <Badge tone="neutral">{session.roleDirection}</Badge>
          <span>{session.interviewDate}</span>
        </div>
      </header>

      {/* 1. Overall summary */}
      <Card>
        <CardBody className="space-y-5">
          <SectionTitle>整体复盘</SectionTitle>
          <p className="rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-[15px] leading-relaxed text-[var(--accent-strong)]">
            {o.overallPerformanceSummary}
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>这场面试主要在聊</Label>
              <div className="flex flex-wrap gap-1.5">
                {o.mainTopics.map((t) => (
                  <Badge key={t} tone="neutral">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>面试官可能在评估</Label>
              <Bullets items={o.interviewerLikelyEvaluated} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-[var(--low-soft)] p-4">
              <Label>做得好的地方</Label>
              <Bullets items={o.topStrengths} />
            </div>
            <div className="rounded-xl bg-[var(--medium-soft)] p-4">
              <Label>主要可以改进的</Label>
              <Bullets items={o.topIssues} />
            </div>
          </div>

          <div>
            <Label>下一步最值得做的</Label>
            <p className="text-sm leading-relaxed">{o.nextPriority}</p>
          </div>
        </CardBody>
      </Card>

      {/* 2. Question list */}
      <section className="space-y-3">
        <SectionTitle hint="面试官问了什么、想考察什么、你大致答得如何。">
          问题清单
        </SectionTitle>
        <div className="grid gap-3">
          {r.questionList.map((q) => (
            <QuestionRow key={q.id} q={q} />
          ))}
        </div>
      </section>

      {/* 3. Key question analyses */}
      {r.keyQuestionAnalyses.length > 0 ? (
        <section className="space-y-3">
          <SectionTitle hint="只对最值得复盘的问题做深入拆解。点开看具体诊断和重写。">
            重点问题深入复盘
          </SectionTitle>
          {r.keyQuestionAnalyses.map((a, idx) => (
            <Collapsible
              key={a.id}
              defaultOpen={idx === 0}
              title={a.interviewerQuestion}
              subtitle="点开查看:面试官想知道什么 · 主要问题 · 更好的结构 · 重写后的回答"
            >
              <div className="space-y-5">
                <div>
                  <Label>面试官真正想知道</Label>
                  <Bullets items={a.whatInterviewerWantedToKnow} />
                </div>

                <div>
                  <Label>你原本的回答(概括)</Label>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">
                    {a.originalAnswerSummary}
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--medium-soft)] p-4">
                  <Label>主要问题</Label>
                  <Bullets items={a.mainProblems} />
                </div>

                <div>
                  <Label>为什么这很重要</Label>
                  <p className="text-sm leading-relaxed">{a.whyItMatters}</p>
                </div>

                <div>
                  <Label>更好的回答结构</Label>
                  <ol className="space-y-1.5">
                    {a.betterAnswerStructure.map((step, i) => (
                      <li key={i} className="flex gap-2.5 text-sm">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-medium text-[var(--accent-strong)]">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <AnswerBlock
                  title="重写后的回答"
                  lang={a.improvedAnswer.language}
                  text={a.improvedAnswer.answerText}
                  accent
                />
                {a.naturalPracticeVersion ? (
                  <AnswerBlock
                    title="更口语的练习版本"
                    lang={a.naturalPracticeVersion.language}
                    text={a.naturalPracticeVersion.answerText}
                  />
                ) : null}

                {a.relatedProjectContextUsed?.length ? (
                  <div className="rounded-xl border border-[var(--border)] p-4">
                    <Label>反馈用到的项目上下文</Label>
                    <Bullets items={a.relatedProjectContextUsed} />
                  </div>
                ) : null}

                <div>
                  <Label>可能的追问</Label>
                  <Bullets items={a.followUpQuestions} />
                </div>
              </div>
            </Collapsible>
          ))}
        </section>
      ) : null}

      {/* 4. Rewritten answers (quick reference) */}
      {r.rewrittenAnswers.length > 0 ? (
        <section className="space-y-3">
          <SectionTitle hint="把上面的重写回答集中放这里,方便你直接拿去练。">
            重写后的回答(速览)
          </SectionTitle>
          {r.rewrittenAnswers.map((a) => (
            <Card key={a.id}>
              <CardBody>
                <p className="mb-2 text-sm font-medium">{a.interviewerQuestion}</p>
                <p className="whitespace-pre-wrap rounded-xl bg-[var(--accent-soft)] p-4 text-sm leading-relaxed text-[var(--accent-strong)]">
                  {a.answerText}
                </p>
              </CardBody>
            </Card>
          ))}
        </section>
      ) : null}

      {/* 5. Simulated follow-ups */}
      {r.simulatedFollowUps.length > 0 ? (
        <section className="space-y-3">
          <SectionTitle hint="下次面试前,试着出声回答这些。">
            模拟追问
          </SectionTitle>
          <Card>
            <CardBody className="space-y-3">
              {r.simulatedFollowUps.map((f) => (
                <div key={f.id} className="border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium">{f.question}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">{f.whyAsked}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </section>
      ) : null}

      {/* 6. Weakness tags */}
      {r.weaknessTags.length > 0 ? (
        <section className="space-y-3">
          <SectionTitle hint="这些会进入长期追踪,帮你看反复出现的薄弱点。">
            薄弱点标签
          </SectionTitle>
          <div className="grid gap-3">
            {r.weaknessTags.map((w) => {
              const tone =
                w.severity === "high"
                  ? "high"
                  : w.severity === "medium"
                  ? "medium"
                  : "low";
              return (
                <Card key={w.id}>
                  <CardBody>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={tone as "high" | "medium" | "low"}>
                        {SEVERITY_LABELS[w.severity]}
                      </Badge>
                      <span className="font-medium">{w.label}</span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{w.evidence}</p>
                    <p className="mt-1.5 text-sm">
                      <span className="text-[var(--accent-strong)]">建议练习:</span>{" "}
                      {w.suggestedPractice}
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* 7. Practice plan */}
      <section className="space-y-3">
        <SectionTitle>练习计划</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardBody>
              <Label>现在就可以做</Label>
              <Bullets items={r.practicePlan.immediatePracticeTasks} />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Label>下次面试前</Label>
              <Bullets items={r.practicePlan.beforeNextInterview} />
            </CardBody>
          </Card>
        </div>
      </section>

      <div className="pt-2">
        <Link href="/interviews/new">
          <Button variant="secondary">再复盘一场面试</Button>
        </Link>
      </div>
    </div>
  );
}

function QuestionRow({ q }: { q: InterviewQuestion }) {
  const perf = PERFORMANCE_LABELS[q.performanceLevel];
  return (
    <Card>
      <CardBody>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="min-w-0 flex-1 text-sm font-medium leading-relaxed">
            {q.interviewerQuestion}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {q.shouldReviewDeeply ? <Badge tone="accent">重点复盘</Badge> : null}
            <Badge tone={perf.tone as "high" | "medium" | "low"}>{perf.text}</Badge>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
          <span className="rounded-md bg-[#eef1f7] px-2 py-0.5 font-medium">{q.questionType}</span>
          <span>想考察:{q.interviewerIntent[0]}</span>
        </div>
        {q.userAnswerSummary ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            你的回答:{q.userAnswerSummary}
          </p>
        ) : null}
      </CardBody>
    </Card>
  );
}

function AnswerBlock({
  title,
  lang,
  text,
  accent,
}: {
  title: string;
  lang: string;
  text: string;
  accent?: boolean;
}) {
  const langLabel: Record<string, string> = {
    Chinese: "中文",
    English: "English",
    Bilingual: "中英双语",
  };
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <Label>{title}</Label>
        <span className="text-xs text-[var(--muted-soft)]">
          {langLabel[lang] ?? lang}
        </span>
      </div>
      <p
        className={
          "whitespace-pre-wrap rounded-xl p-4 text-sm leading-relaxed " +
          (accent
            ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
            : "border border-[var(--border)] text-[var(--foreground)]")
        }
      >
        {text}
      </p>
    </div>
  );
}
