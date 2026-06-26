"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { ProjectCard } from "@/lib/types";
import { getProject, saveProject } from "@/lib/store";
import { completeness } from "@/lib/project-utils";
import { ProjectForm } from "@/components/project-form";
import { Card, CardBody, Button, Badge, Bullets, Label, SectionTitle } from "@/components/ui";

function Field({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <Label>{label}</Label>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function ListField({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <Label>{label}</Label>
      <Bullets items={items} />
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<ProjectCard | null | undefined>(undefined);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setProject(getProject(params.id) ?? null);
  }, [params.id]);

  if (project === undefined) {
    return <p className="text-sm text-[var(--muted)]">加载中…</p>;
  }

  if (project === null) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[var(--muted)]">找不到这个项目卡。</p>
        <Link href="/projects">
          <Button variant="secondary">返回项目库</Button>
        </Link>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">编辑项目卡</h1>
        </header>
        <ProjectForm
          initial={project}
          onCancel={() => setEditing(false)}
          onSave={(p) => {
            saveProject(p);
            setProject(p);
            setEditing(false);
          }}
        />
      </div>
    );
  }

  const pct = completeness(project);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/projects"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← 项目库
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {project.projectName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{project.projectType}</Badge>
            {project.duration ? (
              <span className="text-sm text-[var(--muted)]">{project.duration}</span>
            ) : null}
            {project.tags.map((t) => (
              <Badge key={t} tone="accent">
                {t}
              </Badge>
            ))}
          </div>
        </div>
        <Button onClick={() => setEditing(true)}>编辑</Button>
      </header>

      <Card>
        <CardBody className="space-y-5">
          <SectionTitle>项目概要</SectionTitle>
          <Field label="一句话简介" value={project.shortDescription} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="你的角色" value={project.role} />
            <Field label="目标用户" value={project.targetUsers} />
          </div>
          <Field label="项目目标" value={project.projectGoal} />
          <Field label="真实背景" value={project.realProjectBackground} />
          <Field label="你实际做了什么" value={project.whatUserActuallyDid} />
          <ListField label="用到的方法" items={project.methodsUsed} />
          <div className="grid gap-5 sm:grid-cols-2">
            <ListField label="工具" items={project.toolsUsed} />
            <ListField label="产出物" items={project.deliverables} />
          </div>
          <Field label="结果" value={project.outcome} />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-5">
          <SectionTitle hint="这些限制能帮 AI 给出公平、不冤枉你的反馈。">
            项目限制
          </SectionTitle>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="时间限制" value={project.timeConstraint} />
            <Field label="资源限制" value={project.resourceConstraint} />
            <Field label="数据限制" value={project.dataConstraint} />
          </div>
          <Field label="哪些没有做" value={project.whatWasNotDone} />
          <Field label="为什么没做" value={project.whyItWasNotDone} />
          <Field label="面试里该怎么解释" value={project.howToExplainInInterview} />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-5">
          <SectionTitle>面试准备</SectionTitle>
          <ListField label="展示的能力" items={project.skillsDemonstrated} />
          <ListField label="常见面试问题" items={project.commonInterviewQuestions} />
          <ListField label="推荐的回答角度" items={project.recommendedAnswerAngles} />
          <ListField label="不要过度夸大" items={project.thingsNotToOverclaim} />
          <Field label="被追问时怎么回应" value={project.ifChallengedHowToRespond} />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted)]">资料完整度</span>
            <span className="font-medium">{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#eef1f7]">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
