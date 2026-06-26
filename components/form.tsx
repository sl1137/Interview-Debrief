"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

function FieldShell({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
        {label}
      </span>
      {hint ? (
        <span className="mb-2 block text-xs text-[var(--muted)]">{hint}</span>
      ) : null}
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition-all placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <FieldShell label={label} hint={hint}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <FieldShell label={label} hint={hint}>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, "resize-y leading-relaxed")}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  hint?: string;
}) {
  return (
    <FieldShell label={label} hint={hint}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, "appearance-none")}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

// Multi-select from a fixed option list, rendered as toggleable chips.
export function ChipMultiSelect({
  label,
  selected,
  onChange,
  options,
  hint,
}: {
  label: string;
  selected: string[];
  onChange: (v: string[]) => void;
  options: readonly string[];
  hint?: string;
}) {
  const toggle = (o: string) =>
    onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);
  return (
    <FieldShell label={label} hint={hint}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => toggle(o)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                on
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                  : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)]"
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

// Free-text list: type + Enter adds an item, click × to remove.
export function ListInput({
  label,
  items,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  };
  return (
    <FieldShell label={label} hint={hint}>
      <div className="space-y-2">
        {items.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {items.map((it, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[13px] text-[var(--accent-strong)]"
              >
                {it}
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="text-[var(--accent)] hover:text-[var(--accent-strong)]"
                  aria-label="remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex gap-2">
          <input
            value={draft}
            placeholder={placeholder ?? "输入后按回车添加"}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            className={inputClass}
          />
          <button
            type="button"
            onClick={add}
            className="shrink-0 rounded-xl border border-[var(--border-strong)] px-4 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            添加
          </button>
        </div>
      </div>
    </FieldShell>
  );
}
