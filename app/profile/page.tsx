"use client";

import { useEffect, useRef, useState } from "react";
import type { ResumeDoc } from "@/lib/types";
import { getResume, saveResume, clearResume, nowISO } from "@/lib/store";
import { extractPdfText } from "@/lib/pdf";
import { parseResumeBlocks } from "@/lib/resume-format";
import { Card, CardBody, Button, SectionTitle } from "@/components/ui";
import { cn } from "@/lib/cn";
import { IconDoc, IconPlus } from "@/components/icons";

export default function ProfilePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [mode, setMode] = useState<"preview" | "edit">("preview");

  useEffect(() => {
    const r = getResume();
    if (r) {
      setText(r.text);
      setFileName(r.fileName);
      setSavedAt(r.updatedAt);
    }
    setLoaded(true);
  }, []);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("请上传 PDF 文件。");
      return;
    }
    setError(null);
    setParsing(true);
    try {
      const extracted = await extractPdfText(file);
      setFileName(file.name);
      if (!extracted) {
        setError(
          "没从这份 PDF 里解析出文字——它可能是扫描件/图片型简历。你可以直接在下面手动粘贴文本。"
        );
      } else {
        setText(extracted);
        setMode("preview");
      }
    } catch {
      setError("解析失败,请换一份 PDF,或直接在下面手动粘贴文本。");
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = () => {
    const doc: ResumeDoc = {
      fileName: fileName || "手动输入",
      text: text.trim(),
      updatedAt: nowISO(),
    };
    saveResume(doc);
    setSavedAt(doc.updatedAt);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const clear = () => {
    if (!confirm("确定清空已保存的简历吗?")) return;
    clearResume();
    setText("");
    setFileName("");
    setSavedAt(null);
  };

  if (!loaded) {
    return <p className="text-sm text-[var(--muted)]">加载中…</p>;
  }

  const hasContent = text.trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">我的简历</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          AI 复盘时会读这份简历,用来理解你做过什么、把回答和你的经历对上。它不会显示在别处。
        </p>
      </header>

      {/* Upload */}
      <Card>
        <CardBody>
          <SectionTitle hint="支持文字型 PDF;扫描件/图片型简历抽不出文字,可以手动粘贴。">
            上传简历
          </SectionTitle>

          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={parsing}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--surface-2)] px-6 py-9 text-center transition-colors hover:border-[var(--accent)] disabled:opacity-60"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              {parsing ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
              ) : (
                <IconPlus size={20} />
              )}
            </span>
            <span className="text-sm font-medium text-[var(--foreground)]">
              {parsing ? "正在解析 PDF…" : "点击选择 PDF 文件"}
            </span>
            <span className="text-xs text-[var(--muted)]">解析在你的浏览器本地完成,不会上传到服务器</span>
          </button>

          {error ? (
            <p className="mt-3 rounded-xl bg-[var(--warm-soft)] px-3.5 py-2.5 text-sm text-[var(--warm)]">
              {error}
            </p>
          ) : null}
        </CardBody>
      </Card>

      {/* Parsed text — preview / edit */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle hint="自动识别成简历版式;识别不准就切到「编辑」手动修。">
              简历内容
            </SectionTitle>
            <div className="flex items-center gap-3">
              {fileName ? (
                <span className="hidden items-center gap-1.5 text-xs text-[var(--muted)] sm:flex">
                  <IconDoc size={14} /> {fileName}
                </span>
              ) : null}
              <div className="flex rounded-full bg-[var(--surface-2)] p-0.5 text-[13px]">
                {(["preview", "edit"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={cn(
                      "rounded-full px-3 py-1 transition-colors",
                      mode === m
                        ? "bg-[var(--surface)] font-medium text-[var(--accent-strong)] shadow-[var(--shadow-card)]"
                        : "text-[var(--muted)]"
                    )}
                  >
                    {m === "preview" ? "预览" : "编辑"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {mode === "edit" ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={18}
              placeholder="上传 PDF 后这里会出现解析的文字,你也可以直接粘贴/编辑简历内容…"
              className="w-full resize-y rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-3 text-sm leading-relaxed outline-none transition-all placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
            />
          ) : hasContent ? (
            <ResumePreview text={text} />
          ) : (
            <div className="rounded-xl bg-[var(--surface-2)] px-4 py-10 text-center text-sm text-[var(--muted)]">
              还没有内容。上传 PDF,或切到「编辑」手动粘贴。
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[var(--muted)]">
              {savedAt ? (
                justSaved ? (
                  <span className="text-[var(--low)]">已保存 ✓</span>
                ) : (
                  <span>
                    上次保存:{new Date(savedAt).toLocaleString("zh-CN")} ·{" "}
                    {text.trim().length} 字
                  </span>
                )
              ) : (
                <span>还没保存</span>
              )}
            </div>
            <div className="flex gap-2">
              {savedAt ? (
                <Button variant="danger" size="sm" onClick={clear}>
                  清空
                </Button>
              ) : null}
              <Button size="sm" disabled={!hasContent} onClick={save}>
                {justSaved ? "已保存" : "保存简历"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function ResumePreview({ text }: { text: string }) {
  const blocks = parseResumeBlocks(text);
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-5 py-5 sm:px-7 sm:py-6">
      <div className="space-y-3">
        {blocks.map((b, i) => {
          if (b.type === "header") {
            return (
              <div key={i} className="border-b border-[var(--border-strong)] pb-3">
                <div className="text-lg font-semibold text-[var(--foreground)]">
                  {b.name || "简历"}
                </div>
                {b.contacts.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
                    {b.contacts.map((c, j) => (
                      <span key={j}>{c}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          }
          if (b.type === "heading") {
            return (
              <div key={i} className="flex items-center gap-2 pt-3">
                <span className="h-3.5 w-1 rounded-full bg-[var(--accent)]" />
                <h3 className="text-[15px] font-semibold tracking-tight text-[var(--accent-strong)]">
                  {b.text}
                </h3>
              </div>
            );
          }
          if (b.type === "sub") {
            return (
              <p key={i} className="text-sm leading-relaxed text-[var(--foreground)]">
                <span className="font-semibold">{b.text}</span>
                {b.rest ? <span className="text-[var(--muted)]">：{b.rest}</span> : null}
              </p>
            );
          }
          return (
            <p
              key={i}
              className="text-sm leading-relaxed text-[var(--foreground)]"
            >
              {b.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
