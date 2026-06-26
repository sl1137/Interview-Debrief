// Client-side PDF text extraction via pdf.js. The worker is served from
// /public so it works offline with no CDN dependency.
//
// Instead of naively joining all text items (which collapses a resume into one
// run-on blob), we reconstruct the original line/paragraph layout from each
// item's geometry: group items into rows by their y-position, order each row
// left-to-right, then insert single/double line breaks based on the vertical
// gap between rows.

type Row = { y: number; items: { x: number; str: string; size: number }[] };

export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;

  const pageTexts: string[] = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();

    const rows: Row[] = [];
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const it = item as { str: string; transform: number[]; height: number };
      if (!it.str) continue;
      const x = it.transform[4];
      const y = it.transform[5];
      const size = it.height || Math.abs(it.transform[3]) || 10;
      // merge into a row whose baseline is within ~half a line of this item
      const tol = Math.max(2, size * 0.5);
      let row = rows.find((r) => Math.abs(r.y - y) <= tol);
      if (!row) {
        row = { y, items: [] };
        rows.push(row);
      }
      row.items.push({ x, str: it.str, size });
    }

    // top-to-bottom (PDF y grows upward → larger y is higher on the page)
    rows.sort((a, b) => b.y - a.y);

    const lines = rows
      .map((r) => {
        r.items.sort((a, b) => a.x - b.x);
        const text = r.items
          .map((i) => i.str)
          .join("")
          .replace(/[ \t ]+/g, " ")
          .trim();
        const size = Math.max(...r.items.map((i) => i.size), 0);
        return { text, size, y: r.y };
      })
      .filter((l) => l.text);

    let out = "";
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) {
        const gap = lines[i - 1].y - lines[i].y;
        // big vertical gap → paragraph break, otherwise a normal line break
        out += gap > lines[i].size * 1.7 ? "\n\n" : "\n";
      }
      out += lines[i].text;
    }
    if (out.trim()) pageTexts.push(out.trim());
  }

  return pageTexts.join("\n\n").trim();
}
