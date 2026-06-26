"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  IconGrid,
  IconFolder,
  IconChat,
  IconTrend,
  IconDoc,
  IconSparkle,
} from "@/components/icons";

const NAV = [
  { href: "/dashboard", label: "总览", Icon: IconGrid },
  { href: "/projects", label: "项目经历库", Icon: IconFolder },
  { href: "/interviews/new", label: "新建复盘", Icon: IconChat },
  { href: "/growth", label: "成长追踪", Icon: IconTrend },
  { href: "/profile", label: "我的简历", Icon: IconDoc },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-full shrink-0 flex-col gap-2 border-b border-[var(--border)] bg-[var(--surface)] p-4 sm:w-[236px] sm:border-b-0 sm:border-r sm:p-5">
      <Link href="/dashboard" className="mb-4 flex items-center gap-2.5 px-2 py-1">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[#54b3b0] text-white shadow-[0_4px_12px_-4px_rgba(47,125,136,0.6)]">
          <IconSparkle size={18} />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">面试复盘教练</span>
      </Link>

      <nav className="flex flex-row gap-1.5 sm:flex-col">
        {NAV.map(({ href, label, Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href)) ||
            (href === "/interviews/new" && pathname.startsWith("/interviews"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-[var(--accent-soft)] font-medium text-[var(--accent-strong)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  active
                    ? "bg-white text-[var(--accent)] shadow-[var(--shadow-card)]"
                    : "text-[var(--muted-soft)]"
                )}
              >
                <Icon size={18} />
              </span>
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Promo / CTA card */}
      <div className="mt-auto hidden sm:block">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f3a40] to-[#2f7d88] p-4 text-white">
          <svg
            className="pointer-events-none absolute -right-4 -top-4 opacity-20"
            width="96"
            height="96"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z" />
          </svg>
          <div className="relative">
            <div className="text-sm font-semibold">把每场面试变成进步</div>
            <p className="mt-1 text-xs leading-relaxed text-white/75">
              粘贴转录,连接项目,得到温和而具体的复盘。
            </p>
            <Link
              href="/interviews/new"
              className="mt-3 inline-flex rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-[var(--accent-strong)] hover:bg-white/90"
            >
              开始复盘
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
