"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProjectCard } from "@/lib/types";
import { getProjects, deleteProject } from "@/lib/store";
import { completeness } from "@/lib/project-utils";
import { Card, CardBody, Button, Badge, EmptyState } from "@/components/ui";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectCard[] | null>(null);
  const [query, setQuery] = useState("");

  const refresh = () => setProjects(getProjects());
  useEffect(refresh, []);

  const onDelete = (id: string, name: string) => {
    if (confirm(`确定删除「${name}」这张项目卡吗?`)) {
      deleteProject(id);
      refresh();
    }
  };

  const filtered = (projects ?? []).filter(
    (p) =>
      query.trim() === "" ||
      p.projectName.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">项目经历库</h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            为简历上的每个项目建一张卡。AI 复盘时会用这些上下文,避免对你做出不公平的评价。
          </p>
        </div>
        <Link href="/projects/new">
          <Button>+ 新建项目卡</Button>
        </Link>
      </header>

      {projects && projects.length > 0 ? (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="按名称或标签搜索…"
          className="w-full max-w-xs rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
        />
      ) : null}

      {projects === null ? (
        <p className="text-sm text-[var(--muted)]">加载中…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query ? "没有匹配的项目" : "还没有项目卡"}
          description={
            query
              ? "换个关键词试试。"
              : "先建一张项目卡,后面做面试复盘时就能连接它。"
          }
          action={
            !query ? (
              <Link href="/projects/new">
                <Button>+ 新建项目卡</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((p) => {
            const pct = completeness(p);
            return (
              <Card key={p.id}>
                <CardBody>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">{p.projectName}</h2>
                        <Badge tone="neutral">{p.projectType}</Badge>
                        {p.duration ? (
                          <span className="text-xs text-[var(--muted)]">
                            {p.duration}
                          </span>
                        ) : null}
                      </div>
                      {p.shortDescription ? (
                        <p className="mt-1.5 text-sm text-[var(--muted)]">
                          {p.shortDescription}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link href={`/projects/${p.id}`}>
                        <Button variant="secondary" size="sm">
                          查看 / 编辑
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(p.id, p.projectName)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>

                  {p.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <Badge key={t} tone="accent">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-[var(--muted)]">
                      <span>资料完整度</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eef1f7]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {pct < 60 ? (
                      <p className="mt-2 text-xs text-[var(--warm)]">
                        建议补充「项目限制」和「面试里该怎么解释」,反馈会更准。
                      </p>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
