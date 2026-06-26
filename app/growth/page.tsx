"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { InterviewSession } from "@/lib/types";
import { getSessions } from "@/lib/store";
import {
  completedSessions,
  aggregateWeaknesses,
  aggregateQuestionTypes,
  aggregateRoleDirections,
  growthInsight,
} from "@/lib/analytics";
import { SEVERITY_LABELS } from "@/lib/constants";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Stat,
  BarRow,
  EmptyState,
  SectionTitle,
} from "@/components/ui";

export default function GrowthPage() {
  const [sessions, setSessions] = useState<InterviewSession[] | null>(null);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  if (sessions === null) {
    return <p className="text-sm text-[var(--muted)]">加载中…</p>;
  }

  const done = completedSessions(sessions);

  if (done.length === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">成长追踪</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            把多场面试的薄弱点聚合起来,看你长期的进步。
          </p>
        </header>
        <EmptyState
          title="还没有可以追踪的数据"
          description="完成至少一次面试复盘后,这里会出现你的长期趋势。"
          action={
            <Link href="/interviews/new">
              <Button>开始第一次复盘</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const weaknesses = aggregateWeaknesses(sessions);
  const qTypes = aggregateQuestionTypes(sessions);
  const directions = aggregateRoleDirections(sessions);
  const insight = growthInsight(sessions);
  const maxW = weaknesses[0]?.count ?? 1;
  const maxQ = qTypes[0]?.count ?? 1;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">成长追踪</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          把多场面试的薄弱点聚合起来,看你长期的进步。
        </p>
      </header>

      {insight ? (
        <Card>
          <div className="bg-gradient-to-br from-[var(--accent-soft)] to-[var(--surface)] p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent-strong)]">
              一句话洞察
            </div>
            <p className="text-[15px] leading-relaxed">{insight}</p>
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat value={done.length} label="已复盘面试" />
        <Stat
          value={qTypes.reduce((a, b) => a + b.count, 0)}
          label="复盘过的问题"
        />
        <Stat value={weaknesses.length} label="不同薄弱点" />
      </div>

      <section className="space-y-3">
        <SectionTitle hint="出现次数越多、严重度越高,越值得优先攻克。">
          反复出现的薄弱点
        </SectionTitle>
        <Card>
          <CardBody className="space-y-4">
            {weaknesses.map((w) => (
              <BarRow
                key={w.label}
                label={
                  <span className="flex items-center gap-2">
                    {w.label}
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
                  </span>
                }
                count={w.count}
                max={maxW}
                suffix=" 次"
                tone={
                  w.maxSeverity === "high"
                    ? "high"
                    : w.maxSeverity === "medium"
                    ? "medium"
                    : "low"
                }
              />
            ))}
          </CardBody>
        </Card>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="space-y-3">
          <SectionTitle>最常被问的问题类型</SectionTitle>
          <Card>
            <CardBody className="space-y-4">
              {qTypes.slice(0, 6).map((q) => (
                <BarRow key={q.label} label={q.label} count={q.count} max={maxQ} />
              ))}
            </CardBody>
          </Card>
        </section>

        <section className="space-y-3">
          <SectionTitle>按岗位方向</SectionTitle>
          <Card>
            <CardBody className="space-y-3">
              {directions.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between border-b border-[var(--border)] pb-3 text-sm last:border-0 last:pb-0"
                >
                  <span>{d.label}</span>
                  <span className="text-[var(--muted)]">{d.count} 场</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}
