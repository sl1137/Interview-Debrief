// Best-effort structuring of extracted resume text into displayable blocks.
// Heuristic only (keyword + bracket detection) — true semantic parsing is an
// AI job for later. Driven entirely by the (editable) text so edits reflect
// in the preview.

export type ResumeBlock =
  | { type: "header"; name: string; contacts: string[] }
  | { type: "heading"; text: string }
  | { type: "sub"; text: string; rest?: string }
  | { type: "para"; text: string };

const HEADING_RE =
  /^(教育背景|教育经历|教育|实习经历|实习|工作经历|工作经验|项目经历|项目经验|项目|专业技能|技能|个人简介|自我评价|个人评价|获奖经历|奖项荣誉|荣誉奖项|证书|语言能力|兴趣爱好|工作技能|Education|Work\s*Experience|Experience|Internships?|Projects?|Skills?|Summary|Awards?|Certifications?|Languages?)\s*[:：]?\s*$/i;

const CONTACT_RE = /(@|邮箱|电话|手机|微信|tel\b|e-?mail|linkedin|github)/i;

export function parseResumeBlocks(text: string): ResumeBlock[] {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const blocks: ResumeBlock[] = [];
  let headerDone = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Header: first contact-bearing line near the top
    if (!headerDone && i <= 2 && CONTACT_RE.test(line)) {
      const parts = line
        .split(/[|｜丨·•]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const first = parts.shift() ?? line;
      let name = first;
      const m = first.match(
        /^([一-龥A-Za-z·\s]{1,14}?)\s*(邮箱|电话|手机|微信|e-?mail|tel)\s*[:：]?\s*(.*)$/i
      );
      if (m) {
        name = m[1].trim();
        const rest = m[3].trim();
        if (rest) parts.unshift(`${m[2]}: ${rest}`);
      }
      blocks.push({ type: "header", name, contacts: parts });
      headerDone = true;
      continue;
    }

    if (HEADING_RE.test(line)) {
      blocks.push({ type: "heading", text: line.replace(/[:：]\s*$/, "") });
      continue;
    }

    const bracket = line.match(/^【(.+?)】\s*[:：]?\s*(.*)$/);
    if (bracket) {
      blocks.push({
        type: "sub",
        text: bracket[1].trim(),
        rest: bracket[2].trim() || undefined,
      });
      continue;
    }

    blocks.push({ type: "para", text: line });
  }

  return blocks;
}
