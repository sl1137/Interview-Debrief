"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { InterviewSession, ProjectCard } from "@/lib/types";
import { getSessions, getProjects } from "@/lib/store";
import {
  completedSessions,
  aggregateWeaknesses,
  suggestedPractice,
} from "@/lib/analytics";
import { SEVERITY_LABELS } from "@/lib/constants";
import {
  Card,
  CardBody,
  Button,
  Badge,
  StatTile,
  ProgressPill,
  SmartTask,
} from "@/components/ui";
import {
  IconChat,
  IconFolder,
  IconTrend,
  IconTarget,
  IconSearch,
  IconBell,
  IconSend,
  IconSparkle,
} from "@/components/icons";

function performanceScore(s: InterviewSession): number {
  const qs = s.report?.questionList ?? [];
  if (qs.length === 0) return 0;
  const pts = qs.reduce((sum, q) => {
    if (q.performanceLevel === "strong") return sum + 1;
    if (q.performanceLevel === "okay") return sum + 0.6;
    if (q.performanceLevel === "needs_work") return sum + 0.3;
    return sum;
  }, 0);
  return Math.round((pts / qs.length) * 100);
}

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<InterviewSession[] | null>(null);
  const [projects, setProjects] = useState<ProjectCard[]>([]);

  useEffect(() => {
    setSessions(getSessions());
    setProjects(getProjects());
  }, []);

  if (sessions === null) {
    return <p className="text-sm text-[var(--muted)]">加载中…</p>;
  }

  const done = completedSessions(sessions);
  const totalQuestions = done.reduce(
    (n, s) => n + (s.report?.questionList.length ?? 0),
    0
  );
  const weaknesses = aggregateWeaknesses(sessions);
  const practice = suggestedPractice(sessions, 4);

  const TILE_TONES = ["mint", "blue", "purple", "pink"] as const;
  const TASK_TONES = ["blue", "purple", "pink", "mint", "peach"] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            你好,欢迎回来 👋
          </h1>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            每多复盘一次,反馈都会更懂你。
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--muted-soft)] sm:flex">
            <IconSearch size={16} />
            <span>搜索…</span>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--muted)] hover:text-[var(--foreground)]">
            <IconBell size={17} />
          </button>
          <Link href="/interviews/new">
            <Button size="sm">
              <IconSparkle size={15} /> 新建复盘
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Main column */}
        <div className="space-y-6">
          {/* Stat tiles */}
          <div className="grid grid-cols-2 gap-4">
            <StatTile
              tone={TILE_TONES[0]}
              icon={<IconChat size={18} />}
              value={done.length}
              label="已复盘面试"
            />
            <StatTile
              tone={TILE_TONES[1]}
              icon={<IconTarget size={18} />}
              value={totalQuestions}
              label="复盘过的问题"
            />
            <StatTile
              tone={TILE_TONES[2]}
              icon={<IconFolder size={18} />}
              value={projects.length}
              label="项目卡"
            />
            <StatTile
              tone={TILE_TONES[3]}
              icon={<IconTrend size={18} />}
              value={weaknesses.length}
              label="薄弱点种类"
            />
          </div>

          {/* Continue / recent debriefs */}
          <Card>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold">最近的复盘</h2>
                <Link
                  href="/growth"
                  className="text-[13px] text-[var(--accent-strong)] hover:underline"
                >
                  查看全部
                </Link>
              </div>
              {done.length === 0 ? (
                <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-8 text-center text-sm text-[var(--muted)]">
                  还没有复盘记录。粘贴一段面试转录,生成你的第一份报告。
                </div>
              ) : (
                <div className="space-y-2.5">
                  {done.slice(0, 4).map((s) => {
                    const score = performanceScore(s);
                    const tone =
                      score >= 70 ? "low" : score >= 45 ? "medium" : "high";
                    return (
                      <ProgressPill
                        key={s.id}
                        icon={<IconChat size={17} />}
                        title={s.interviewTitle}
                        tag={s.roleDirection}
                        tagTone={tone}
                        pct={score}
                        onClick={() => router.push(`/interviews/${s.id}`)}
                      />
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Chat-style entry */}
          <Card>
            <CardBody className="py-4">
              <div className="flex items-center gap-3">
                <input
                  readOnly
                  onClick={() => router.push("/interviews/new")}
                  placeholder="想复盘哪一场面试?点这里开始…"
                  className="flex-1 cursor-pointer bg-transparent text-sm outline-none placeholder:text-[var(--muted-soft)]"
                />
                <button
                  onClick={() => router.push("/interviews/new")}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
                  aria-label="开始复盘"
                >
                  <IconSend size={16} />
                </button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {/* CTA / hero card */}
          <Card className="overflow-hidden border-0">
            <div className="bg-gradient-to-br from-[var(--tile-blue)] to-[var(--tile-purple)] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-[var(--accent)]">
                <IconSparkle size={20} />
              </div>
              <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
                温和但具体的 AI 教练
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
                它会用你的项目背景和限制,给出公平、可执行的反馈。
              </p>
              <Link href="/projects">
                <Button size="sm" variant="secondary" className="mt-3 bg-white/80">
                  管理项目库
                </Button>
              </Link>
            </div>
          </Card>

          {/* Practice tasks */}
          <Card>
            <CardBody>
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold">建议的练习</h2>
                <Link
                  href="/growth"
                  className="text-[13px] text-[var(--accent-strong)] hover:underline"
                >
                  查看全部
                </Link>
              </div>
              {practice.length === 0 ? (
                <p className="py-3 text-sm text-[var(--muted)]">
                  复盘后这里会出现针对你的练习任务。
                </p>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {practice.map((t, i) => (
                    <SmartTask
                      key={i}
                      tone={TASK_TONES[i % TASK_TONES.length]}
                      title={t}
                    />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Recurring weaknesses */}
          {weaknesses.length > 0 ? (
            <Card>
              <CardBody>
                <h2 className="mb-3 text-[15px] font-semibold">反复出现的薄弱点</h2>
                <div className="space-y-2.5">
                  {weaknesses.slice(0, 4).map((w) => (
                    <div
                      key={w.label}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="min-w-0 truncate text-sm">{w.label}</span>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          tone={
                            w.maxSeverity === "high"
                              ? "high"
                              : w.maxSeverity === "medium"
                              ? "medium"
                              : "low"
                          }
                        >
                          {SEVERITY_LABELS[w.maxSeverity]}
                        </Badge>
                        <span className="text-xs text-[var(--muted)]">×{w.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
