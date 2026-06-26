"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// ---- Card -----------------------------------------------------------------

export function Card({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <As
      className={cn(
        "rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5 sm:p-6", className)}>{children}</div>;
}

export function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-[17px] font-semibold tracking-tight text-[var(--foreground)]">
        {children}
      </h2>
      {hint ? <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

// ---- Button ---------------------------------------------------------------

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  className,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const sizes = {
    sm: "px-3.5 py-1.5 text-[13px]",
    md: "px-5 py-2.5 text-sm",
  };
  const variants = {
    primary:
      "bg-[var(--accent)] text-white shadow-[0_4px_12px_-4px_rgba(47,125,136,0.45)] hover:bg-[var(--accent-strong)] active:scale-[0.98]",
    secondary:
      "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]",
    ghost: "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)]",
    danger:
      "border border-[var(--border-strong)] text-[var(--muted)] hover:border-[var(--high)] hover:bg-[var(--high-soft)] hover:text-[var(--high)]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </button>
  );
}

// ---- Badge ----------------------------------------------------------------

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "low" | "medium" | "high" | "accent";
}) {
  const tones = {
    neutral: "bg-[#eef1f7] text-[var(--muted)]",
    accent: "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
    low: "bg-[var(--low-soft)] text-[var(--low)]",
    medium: "bg-[var(--medium-soft)] text-[var(--medium)]",
    high: "bg-[var(--high-soft)] text-[var(--high)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

// ---- Collapsible ----------------------------------------------------------

export function Collapsible({
  title,
  subtitle,
  defaultOpen = false,
  right,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  defaultOpen?: boolean;
  right?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-3.5 p-5 text-left transition-colors hover:bg-[var(--surface-2)] sm:p-6"
      >
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-200",
            open && "rotate-90"
          )}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </span>
        <span className="flex-1">
          <span className="block font-medium leading-snug text-[var(--foreground)]">
            {title}
          </span>
          {subtitle ? (
            <span className="mt-0.5 block text-sm text-[var(--muted)]">
              {subtitle}
            </span>
          ) : null}
        </span>
        {right}
      </button>
      {open ? (
        <div className="border-t border-[var(--border)] p-5 sm:p-6">{children}</div>
      ) : null}
    </Card>
  );
}

// ---- Small presentational helpers ----------------------------------------

export function Bullets({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-1.5", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-[var(--foreground)]">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
      {children}
    </div>
  );
}

export function Stat({
  value,
  label,
}: {
  value: ReactNode;
  label: string;
}) {
  return (
    <Card>
      <div className="p-5">
        <div className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          {value}
        </div>
        <div className="mt-1 text-sm text-[var(--muted)]">{label}</div>
      </div>
    </Card>
  );
}

export function BarRow({
  label,
  count,
  max,
  tone = "accent",
  suffix,
}: {
  label: ReactNode;
  count: number;
  max: number;
  tone?: "accent" | "low" | "medium" | "high";
  suffix?: string;
}) {
  const pct = max > 0 ? Math.max(6, Math.round((count / max) * 100)) : 0;
  const bar = {
    accent: "bg-[var(--accent)]",
    low: "bg-[var(--low)]",
    medium: "bg-[var(--medium)]",
    high: "bg-[var(--high)]",
  }[tone];
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-[var(--foreground)]">{label}</span>
        <span className="shrink-0 text-[var(--muted)]">
          {count}
          {suffix ?? ""}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef1f7]">
        <div className={cn("h-full rounded-full", bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ---- Pastel stat tile (dashboard) ----------------------------------------

const TILE = {
  blue: { bg: "var(--tile-blue)", fg: "var(--tile-blue-fg)" },
  purple: { bg: "var(--tile-purple)", fg: "var(--tile-purple-fg)" },
  pink: { bg: "var(--tile-pink)", fg: "var(--tile-pink-fg)" },
  mint: { bg: "var(--tile-mint)", fg: "var(--tile-mint-fg)" },
  peach: { bg: "var(--tile-peach)", fg: "var(--tile-peach-fg)" },
};

export function StatTile({
  tone = "blue",
  icon,
  value,
  label,
  badge,
}: {
  tone?: keyof typeof TILE;
  icon: ReactNode;
  value: ReactNode;
  label: string;
  badge?: string;
}) {
  const t = TILE[tone];
  return (
    <div
      className="relative overflow-hidden rounded-[var(--radius)] p-4 sm:p-5"
      style={{ background: t.bg, color: t.fg }}
    >
      {/* faint sparkle decoration */}
      <svg
        className="pointer-events-none absolute -right-3 bottom-1 opacity-[0.18]"
        width="92"
        height="92"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z" />
      </svg>
      <div className="relative flex items-start justify-between">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60"
          style={{ color: t.fg }}
        >
          {icon}
        </span>
        <span className="opacity-60">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
      </div>
      <div className="relative mt-4 flex items-end gap-2">
        <span className="text-[28px] font-semibold leading-none tracking-tight">
          {value}
        </span>
        {badge ? (
          <span className="mb-0.5 rounded-full bg-white/55 px-1.5 py-0.5 text-[11px] font-semibold">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="relative mt-1.5 text-[13px] font-medium opacity-80">
        {label}
      </div>
    </div>
  );
}

// ---- Progress pill row (recent debriefs) ---------------------------------

export function ProgressPill({
  icon,
  title,
  tag,
  tagTone = "accent",
  pct,
  onClick,
}: {
  icon?: ReactNode;
  title: string;
  tag?: string;
  tagTone?: "accent" | "low" | "medium" | "high";
  pct: number;
  onClick?: () => void;
}) {
  const fill = {
    accent: "var(--accent)",
    low: "var(--low)",
    medium: "var(--medium)",
    high: "var(--high)",
  }[tagTone];
  const clamped = Math.max(4, Math.min(100, pct));
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-[var(--surface-2)] p-2.5 pr-4 text-left transition-shadow hover:shadow-[var(--shadow-card)]"
    >
      {/* progress fill behind content */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 rounded-2xl opacity-[0.16]"
        style={{ width: `${clamped}%`, background: fill }}
      />
      {icon ? (
        <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--accent)] shadow-[var(--shadow-card)]">
          {icon}
        </span>
      ) : null}
      <span className="relative z-10 min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-[var(--foreground)]">
            {title}
          </span>
          {tag ? <Badge tone={tagTone}>{tag}</Badge> : null}
        </span>
      </span>
      <span className="relative z-10 shrink-0 text-sm font-semibold text-[var(--foreground)]">
        {Math.round(pct)}%
      </span>
    </button>
  );
}

// ---- Smart task row -------------------------------------------------------

export function SmartTask({
  tone = "blue",
  title,
  meta,
  onClick,
}: {
  tone?: keyof typeof TILE;
  title: string;
  meta?: string;
  onClick?: () => void;
}) {
  const t = TILE[tone];
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span
        className="mt-0.5 h-8 w-8 shrink-0 rounded-lg"
        style={{ background: t.bg }}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-[var(--foreground)]">
          {title}
        </span>
        {meta ? (
          <span className="block truncate text-xs text-[var(--muted)]">{meta}</span>
        ) : null}
      </span>
      <button
        type="button"
        onClick={onClick}
        className="h-5 w-5 shrink-0 rounded-full border-2 border-[var(--border-strong)] transition-colors hover:border-[var(--accent)]"
        aria-label="mark done"
      />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
        <div className="text-base font-medium text-[var(--foreground)]">{title}</div>
        {description ? (
          <p className="max-w-sm text-sm text-[var(--muted)]">{description}</p>
        ) : null}
        {action}
      </div>
    </Card>
  );
}
