"use client";

import type { ProjectCard, InterviewSession, UserProfile, ResumeDoc } from "./types";
import { sampleProjectCard } from "./sample-data";

const PROJECTS_KEY = "idc.projects.v1";
const SESSIONS_KEY = "idc.sessions.v1";
const PROFILE_KEY = "idc.profile.v1";
const RESUME_KEY = "idc.resume.v1";
const SEEDED_KEY = "idc.seeded.v1";

export function uid(prefix = "id"): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// Seed a sample project once so the library is never empty on first run.
function ensureSeeded(): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEEDED_KEY)) return;
  const existing = read<ProjectCard[]>(PROJECTS_KEY, []);
  if (existing.length === 0) {
    write(PROJECTS_KEY, [sampleProjectCard]);
  }
  window.localStorage.setItem(SEEDED_KEY, "1");
}

// ----- Projects -----

export function getProjects(): ProjectCard[] {
  ensureSeeded();
  return read<ProjectCard[]>(PROJECTS_KEY, []);
}

export function getProject(id: string): ProjectCard | undefined {
  return getProjects().find((p) => p.id === id);
}

export function saveProject(project: ProjectCard): void {
  const all = getProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  const stamped = { ...project, updatedAt: nowISO() };
  if (idx >= 0) {
    all[idx] = stamped;
  } else {
    all.unshift(stamped);
  }
  write(PROJECTS_KEY, all);
}

export function deleteProject(id: string): void {
  write(
    PROJECTS_KEY,
    getProjects().filter((p) => p.id !== id)
  );
}

// ----- Sessions -----

export function getSessions(): InterviewSession[] {
  return read<InterviewSession[]>(SESSIONS_KEY, []);
}

export function getSession(id: string): InterviewSession | undefined {
  return getSessions().find((s) => s.id === id);
}

export function saveSession(session: InterviewSession): void {
  const all = getSessions();
  const idx = all.findIndex((s) => s.id === session.id);
  const stamped = { ...session, updatedAt: nowISO() };
  if (idx >= 0) {
    all[idx] = stamped;
  } else {
    all.unshift(stamped);
  }
  write(SESSIONS_KEY, all);
}

export function deleteSession(id: string): void {
  write(
    SESSIONS_KEY,
    getSessions().filter((s) => s.id !== id)
  );
}

// ----- Profile -----

export function getProfile(): UserProfile | null {
  return read<UserProfile | null>(PROFILE_KEY, null);
}

export function saveProfile(profile: UserProfile): void {
  write(PROFILE_KEY, profile);
}

// ----- Resume -----

export function getResume(): ResumeDoc | null {
  return read<ResumeDoc | null>(RESUME_KEY, null);
}

export function saveResume(resume: ResumeDoc): void {
  write(RESUME_KEY, resume);
}

export function clearResume(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RESUME_KEY);
}
