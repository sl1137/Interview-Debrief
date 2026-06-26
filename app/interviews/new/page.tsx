"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { InterviewSession, ProjectCard } from "@/lib/types";
import { emptySession } from "@/lib/interview-utils";
import { getProjects, saveSession } from "@/lib/store";
import { generateMockInterviewDebrief } from "@/lib/mock-report";
import { cn } from "@/lib/cn";
import { Card, CardBody, Button, SectionTitle } from "@/components/ui";
import {
  TextField,
  TextAreaField,
  SelectField,
} from "@/components/form";
import {
  ROLE_DIRECTIONS,
  INTERVIEW_ROUNDS,
  INTERVIEW_LANGUAGES,
} from "@/lib/constants";

const STEPS = [
  "面试基本信息",
  "JD 与公司背景",
  "转录 / 录音",
  "相关项目",
  "自我反思",
  "生成报告",
];

export default function NewInterviewPage() {
  const router = useRouter();
  const [s, setS] = useState<InterviewSession>(() => emptySession());
  const [step, setStep] = useState(0);
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const set = <K extends keyof InterviewSession>(k: K, v: InterviewSession[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));
  const setReflection = (k: keyof InterviewSession["selfReflection"], v: string) =>
    setS((prev) => ({ ...prev, selfReflection: { ...prev.selfReflection, [k]: v } }));

  const toggleProject = (id: string) =>
    set(
      "relatedProjectIds",
      s.relatedProjectIds.includes(id)
        ? s.relatedProjectIds.filter((x) => x !== id)
        : [...s.relatedProjectIds, id]
    );

  const canGenerate = s.transcriptText.trim().length > 20;

  const generate = () => {
    setGenerating(true);
    // small delay so it feels like real processing
    setTimeout(() => {
      const report = generateMockInterviewDebrief(s, projects);
      const finished: InterviewSession = {
        ...s,
        interviewTitle:
          s.interviewTitle.trim() ||
          `${s.companyName || "某公司"} · ${s.roleTitle || s.roleDirection}`,
        analysisStatus: "completed",
        report,
      };
      saveSession(finished);
      router.push(`/interviews/${finished.id}`);
    }, 1100);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">新建面试复盘</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          填好背景、粘贴转录、连接项目,就能生成一份温和而具体的复盘报告。
        </p>
      </header>

      <Stepper step={step} onJump={setStep} />

      {step === 0 ? (
        <Card>
          <CardBody className="space-y-5">
            <SectionTitle>面试基本信息</SectionTitle>
            <TextField
              label="复盘标题(可留空自动生成)"
              value={s.interviewTitle}
              onChange={(v) => set("interviewTitle", v)}
              placeholder="例如:Acme 增长岗 · 二面"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="公司名称"
                value={s.companyName}
                onChange={(v) => set("companyName", v)}
              />
              <TextField
                label="岗位名称"
                value={s.roleTitle}
                onChange={(v) => set("roleTitle", v)}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="岗位方向"
                value={s.roleDirection}
                onChange={(v) => set("roleDirection", v)}
                options={ROLE_DIRECTIONS}
              />
              <SelectField
                label="面试轮次 (Round)"
                value={s.interviewRound}
                onChange={(v) => set("interviewRound", v)}
                options={INTERVIEW_ROUNDS}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="面试语言"
                value={s.interviewLanguage}
                onChange={(v) =>
                  set("interviewLanguage", v as InterviewSession["interviewLanguage"])
                }
                options={INTERVIEW_LANGUAGES}
              />
              <TextField
                label="面试日期"
                type="date"
                value={s.interviewDate}
                onChange={(v) => set("interviewDate", v)}
              />
            </div>
          </CardBody>
        </Card>
      ) : null}

      {step === 1 ? (
        <Card>
          <CardBody className="space-y-5">
            <SectionTitle hint="有 JD 和公司信息,AI 才能判断面试官真正在评估什么。">
              JD 与公司背景
            </SectionTitle>
            <TextAreaField
              label="职位描述 (JD)"
              value={s.jobDescription}
              onChange={(v) => set("jobDescription", v)}
              rows={6}
              placeholder="粘贴 JD 全文…"
            />
            <TextAreaField
              label="公司 / 产品背景"
              value={s.companyContext}
              onChange={(v) => set("companyContext", v)}
              rows={4}
              placeholder="这家公司是做什么的、处于什么阶段…"
            />
          </CardBody>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card>
          <CardBody className="space-y-5">
            <SectionTitle>转录 / 录音</SectionTitle>
            <div className="rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent-strong)]">
              当前版本请直接粘贴转录文本。语音转文字之后可以接上。
              <br />
              小提示:如果能标出谁在说话(例如 <code>面试官:</code> /{" "}
              <code>我:</code>),问题会拆得更准。
            </div>
            <TextAreaField
              label="面试转录"
              value={s.transcriptText}
              onChange={(v) => set("transcriptText", v)}
              rows={14}
              placeholder={
                "面试官:可以先做个自我介绍吗?\n我:好的,我是……\n面试官:你是怎么发现用户需求的?\n我:……"
              }
            />
            <div>
              <div className="mb-1.5 text-sm font-medium text-[var(--muted-soft)]">
                上传音频(占位,暂未启用)
              </div>
              <div className="rounded-xl border border-dashed border-[var(--border-strong)] px-4 py-6 text-center text-sm text-[var(--muted-soft)]">
                语音转写功能稍后接入
              </div>
            </div>
          </CardBody>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card>
          <CardBody className="space-y-4">
            <SectionTitle hint="选上相关项目卡,AI 会用它的背景和限制,避免不公平地评价你。">
              相关项目
            </SectionTitle>
            {projects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--border-strong)] px-4 py-8 text-center text-sm text-[var(--muted)]">
                还没有项目卡。
                <Link href="/projects/new" className="ml-1 text-[var(--accent-strong)] underline">
                  先去建一张
                </Link>
                (也可以跳过,直接生成。)
              </div>
            ) : (
              <div className="grid gap-3">
                {projects.map((p) => {
                  const on = s.relatedProjectIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProject(p.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                        on
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--border-strong)] hover:border-[var(--accent)]"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs",
                          on
                            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                            : "border-[var(--border-strong)]"
                        )}
                      >
                        {on ? "✓" : ""}
                      </span>
                      <span>
                        <span className="font-medium">{p.projectName}</span>
                        <span className="ml-2 text-xs text-[var(--muted)]">
                          {p.projectType} · {p.duration}
                        </span>
                        {p.shortDescription ? (
                          <span className="mt-0.5 block text-sm text-[var(--muted)]">
                            {p.shortDescription}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      ) : null}

      {step === 4 ? (
        <Card>
          <CardBody className="space-y-5">
            <SectionTitle hint="这些会帮教练更懂你的真实状态,反馈也会更贴。">
              自我反思
            </SectionTitle>
            <TextAreaField
              label="哪部分感觉最难?"
              value={s.selfReflection.feltHardest ?? ""}
              onChange={(v) => setReflection("feltHardest", v)}
              rows={2}
            />
            <TextAreaField
              label="哪个问题你觉得自己答得不好?"
              hint="写在这里的问题,AI 会重点深入复盘。"
              value={s.selfReflection.questionsUserWantsReviewed ?? ""}
              onChange={(v) => setReflection("questionsUserWantsReviewed", v)}
              rows={2}
            />
            <TextAreaField
              label="有没有哪个时刻卡住、慌张或困惑?"
              value={s.selfReflection.emotionalState ?? ""}
              onChange={(v) => setReflection("emotionalState", v)}
              rows={2}
            />
            <TextAreaField
              label="你希望教练重点关注什么?"
              value={s.selfReflection.focusRequest ?? ""}
              onChange={(v) => setReflection("focusRequest", v)}
              rows={2}
            />
          </CardBody>
        </Card>
      ) : null}

      {step === 5 ? (
        <Card>
          <CardBody className="space-y-5">
            <SectionTitle>生成报告</SectionTitle>
            <ReviewRow label="公司 / 岗位" value={`${s.companyName || "—"} · ${s.roleTitle || s.roleDirection}`} />
            <ReviewRow label="面试语言" value={s.interviewLanguage} />
            <ReviewRow
              label="转录长度"
              value={`${s.transcriptText.trim().length} 字`}
              warn={!canGenerate}
              warnText="转录内容太短,建议至少粘贴一段完整对话。"
            />
            <ReviewRow
              label="已连接项目"
              value={
                s.relatedProjectIds.length > 0
                  ? `${s.relatedProjectIds.length} 个`
                  : "未连接(建议连接,反馈会更公平)"
              }
            />
            <div className="rounded-xl bg-[var(--warm-soft)] px-4 py-3 text-sm text-[var(--warm)]">
              当前为 mock 分析:报告结构、措辞、以及对项目限制的引用都已就绪,接入真实
              AI 时只需替换生成函数。
            </div>
            <Button disabled={!canGenerate || generating} onClick={generate}>
              {generating ? "正在生成复盘报告…" : "生成复盘报告"}
            </Button>
          </CardBody>
        </Card>
      ) : null}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((x) => Math.max(0, x - 1))}
          disabled={step === 0}
        >
          ← 上一步
        </Button>
        {step < STEPS.length - 1 ? (
          <Button variant="secondary" onClick={() => setStep((x) => x + 1)}>
            下一步 →
          </Button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

function Stepper({
  step,
  onJump,
}: {
  step: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {STEPS.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onJump(i)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs transition-colors",
            i === step
              ? "bg-[var(--accent)] text-white"
              : i < step
              ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
              : "bg-[#eef1f7] text-[var(--muted)] hover:text-[var(--foreground)]"
          )}
        >
          {i + 1}. {label}
        </button>
      ))}
    </div>
  );
}

function ReviewRow({
  label,
  value,
  warn,
  warnText,
}: {
  label: string;
  value: string;
  warn?: boolean;
  warnText?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3 last:border-0">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span className="text-right text-sm">
        <span className={warn ? "text-[var(--warm)]" : "text-[var(--foreground)]"}>
          {value}
        </span>
        {warn && warnText ? (
          <span className="mt-0.5 block text-xs text-[var(--warm)]">{warnText}</span>
        ) : null}
      </span>
    </div>
  );
}
