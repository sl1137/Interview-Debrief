"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/project-form";
import { emptyProject } from "@/lib/project-utils";
import { saveProject } from "@/lib/store";

export default function NewProjectPage() {
  const router = useRouter();
  const initial = useMemo(() => emptyProject(), []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">新建项目卡</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          填得越具体,后面的面试复盘就越公平、越有用。只有项目名称是必填的。
        </p>
      </header>
      <ProjectForm
        initial={initial}
        onCancel={() => router.push("/projects")}
        onSave={(p) => {
          saveProject(p);
          router.push("/projects");
        }}
      />
    </div>
  );
}
