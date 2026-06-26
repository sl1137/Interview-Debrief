import Link from "next/link";
import { Card } from "@/components/ui";

export function ComingSoon({
  title,
  desc,
  planned,
}: {
  title: string;
  desc: string;
  planned: string[];
}) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{desc}</p>
      </header>
      <Card className="border-dashed">
        <div className="p-6">
          <div className="mb-3 inline-flex rounded-full bg-[var(--warm-soft)] px-3 py-1 text-xs font-medium text-[var(--warm)]">
            即将推出
          </div>
          <p className="mb-4 text-sm text-[var(--muted)]">
            这一页会在核心流程跑通后补上。计划包含:
          </p>
          <ul className="space-y-1.5">
            {planned.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--foreground)]">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3 text-sm">
            <Link
              href="/interviews/new"
              className="rounded-full bg-[var(--accent)] px-5 py-2.5 font-medium text-white hover:bg-[var(--accent-strong)]"
            >
              开始一次面试复盘
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-[var(--border-strong)] px-5 py-2.5 font-medium hover:bg-[var(--accent-soft)]"
            >
              管理项目经历库
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
