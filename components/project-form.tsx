"use client";

import { useState } from "react";
import type { ProjectCard } from "@/lib/types";
import { Card, CardBody, SectionTitle, Button } from "@/components/ui";
import {
  TextField,
  TextAreaField,
  SelectField,
  ChipMultiSelect,
  ListInput,
} from "@/components/form";
import { PROJECT_TYPES, METHODS, PROJECT_TAGS } from "@/lib/constants";

export function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ProjectCard;
  onSave: (p: ProjectCard) => void;
  onCancel: () => void;
}) {
  const [p, setP] = useState<ProjectCard>(initial);
  const set = <K extends keyof ProjectCard>(key: K, value: ProjectCard[K]) =>
    setP((prev) => ({ ...prev, [key]: value }));

  const canSave = p.projectName.trim().length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="space-y-5">
          <SectionTitle hint="先把项目讲清楚:是什么、你是谁、目标是什么。">
            基本信息
          </SectionTitle>
          <TextField
            label="项目名称"
            value={p.projectName}
            onChange={(v) => set("projectName", v)}
            placeholder="例如:Mini Knowledge"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="项目类型 (Project type)"
              value={p.projectType}
              onChange={(v) => set("projectType", v)}
              options={PROJECT_TYPES}
            />
            <TextField
              label="时长 (Duration)"
              value={p.duration}
              onChange={(v) => set("duration", v)}
              placeholder="例如:4 周 / 3 个月"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="你的角色 (Role)"
              value={p.role}
              onChange={(v) => set("role", v)}
              placeholder="例如:UX/产品成员"
            />
            <TextField
              label="目标用户 (Target users)"
              value={p.targetUsers}
              onChange={(v) => set("targetUsers", v)}
            />
          </div>
          <TextField
            label="项目目标 (Goal)"
            value={p.projectGoal}
            onChange={(v) => set("projectGoal", v)}
          />
          <TextAreaField
            label="一句话简介 (Short description)"
            value={p.shortDescription}
            onChange={(v) => set("shortDescription", v)}
            rows={2}
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-5">
          <SectionTitle hint="项目真实的来龙去脉,帮 AI 还原你实际做了什么。">
            项目背景
          </SectionTitle>
          <TextAreaField
            label="最初想法来源 (Initial idea source)"
            value={p.initialIdeaSource}
            onChange={(v) => set("initialIdeaSource", v)}
            rows={2}
          />
          <TextAreaField
            label="真实项目背景 (Real background)"
            value={p.realProjectBackground}
            onChange={(v) => set("realProjectBackground", v)}
            rows={2}
          />
          <TextAreaField
            label="你实际做了什么 (What you actually did)"
            value={p.whatUserActuallyDid}
            onChange={(v) => set("whatUserActuallyDid", v)}
            rows={3}
          />
          <ChipMultiSelect
            label="用到的方法 (Methods used)"
            selected={p.methodsUsed}
            onChange={(v) => set("methodsUsed", v)}
            options={METHODS}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <ListInput
              label="工具 (Tools used)"
              items={p.toolsUsed}
              onChange={(v) => set("toolsUsed", v)}
              placeholder="例如:Figma"
            />
            <ListInput
              label="产出物 (Deliverables)"
              items={p.deliverables}
              onChange={(v) => set("deliverables", v)}
              placeholder="例如:原型"
            />
          </div>
          <TextAreaField
            label="结果 (Outcome)"
            value={p.outcome}
            onChange={(v) => set("outcome", v)}
            rows={2}
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-5">
          <SectionTitle hint="这部分最关键:写清限制,AI 才不会不公平地批评你。">
            项目限制
          </SectionTitle>
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField
              label="时间限制"
              value={p.timeConstraint}
              onChange={(v) => set("timeConstraint", v)}
            />
            <TextField
              label="资源限制"
              value={p.resourceConstraint}
              onChange={(v) => set("resourceConstraint", v)}
            />
            <TextField
              label="数据限制"
              value={p.dataConstraint}
              onChange={(v) => set("dataConstraint", v)}
            />
          </div>
          <TextAreaField
            label="哪些没有做 (What was not done)"
            value={p.whatWasNotDone}
            onChange={(v) => set("whatWasNotDone", v)}
            rows={2}
          />
          <TextAreaField
            label="为什么没做 (Why)"
            value={p.whyItWasNotDone}
            onChange={(v) => set("whyItWasNotDone", v)}
            rows={2}
          />
          <TextAreaField
            label="面试里该怎么解释 (How to explain in interview)"
            hint="例如:因为是 4 周课程项目,我们没有做完整的 discovery,而是用了轻量的对标和原型反馈来收敛方向。"
            value={p.howToExplainInInterview}
            onChange={(v) => set("howToExplainInInterview", v)}
            rows={3}
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-5">
          <SectionTitle hint="为面试做准备:能展示什么、可能被问什么、怎么答更稳。">
            面试准备
          </SectionTitle>
          <ListInput
            label="展示的能力 (Skills demonstrated)"
            items={p.skillsDemonstrated}
            onChange={(v) => set("skillsDemonstrated", v)}
          />
          <ListInput
            label="常见面试问题 (Common questions)"
            items={p.commonInterviewQuestions}
            onChange={(v) => set("commonInterviewQuestions", v)}
          />
          <ListInput
            label="推荐的回答角度 (Answer angles)"
            items={p.recommendedAnswerAngles}
            onChange={(v) => set("recommendedAnswerAngles", v)}
          />
          <ListInput
            label="不要过度夸大的地方 (Don't overclaim)"
            items={p.thingsNotToOverclaim}
            onChange={(v) => set("thingsNotToOverclaim", v)}
          />
          <TextAreaField
            label="被追问时怎么回应 (If challenged)"
            value={p.ifChallengedHowToRespond}
            onChange={(v) => set("ifChallengedHowToRespond", v)}
            rows={2}
          />
          <ChipMultiSelect
            label="岗位相关标签 (Tags)"
            selected={p.tags}
            onChange={(v) => set("tags", v)}
            options={PROJECT_TAGS}
          />
        </CardBody>
      </Card>

      <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_-1px_3px_rgba(31,35,41,0.04)]">
        <span className="text-sm text-[var(--muted)]">
          {canSave ? "可以保存了" : "请至少填写项目名称"}
        </span>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel}>
            取消
          </Button>
          <Button disabled={!canSave} onClick={() => onSave(p)}>
            保存项目卡
          </Button>
        </div>
      </div>
    </div>
  );
}
