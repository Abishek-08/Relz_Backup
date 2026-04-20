const PDFDocument = require("pdfkit");
const path = require("path");
const logger = require("../../../logger");

const FONT_PATH = path.join(__dirname, "./fonts/NotoSans-Regular.ttf");
const FONT_BOLD_PATH = path.join(__dirname, "./fonts/NotoSans-Bold.ttf");
const SYMBOLS_PATH = path.join(__dirname, "./fonts/NotoSansSymbols-Regular.ttf");
const FONT_ITALIC_PATH = path.join(__dirname, "./fonts/NotoSans-Italic.ttf");

const FOOTER_RESERVE = 28;
const BASE_BOTTOM = 60;

const FONTS = {
  title: 16,
  section: 12,
  question: 10,
  body: 9,
  meta: 9,
  footer: 8,
  matrixCount: 9
};

const createDoc = () => {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 60, bottom: BASE_BOTTOM + FOOTER_RESERVE, left: 40, right: 40 },
  });
  doc._baseBottom = BASE_BOTTOM;
  doc._footerReserve = FOOTER_RESERVE;
  doc._pageHasContent = false;
  doc.registerFont("Unicode", FONT_PATH);
  doc.registerFont("Unicode-Bold", FONT_BOLD_PATH);
  doc.registerFont("Unicode-Italic", FONT_ITALIC_PATH);
  doc.registerFont("Symbols", SYMBOLS_PATH);
  doc.font("Unicode");
  return doc;
};
exports.createDoc = createDoc;

function markContent(doc) { doc._pageHasContent = true; }
exports._markContent = markContent;

function normalizeEscapedToReal(html) {
  let s = String(html || "");

  // 1) Turn backslash-escaped angle brackets into real ones:  \\<tag\\> -> <tag>
  //    Do this before entity repairs so tags can be matched by regex below.
  s = s.replace(/\\</g, "<").replace(/\\>/g, ">");

  // 2) Repair common broken closing tags like </ div> or </  p >
  s = s.replace(/<\s*\/\s*([a-zA-Z]+)\s*>/g, "</$1>");

  // 3) Repair broken opening tags like <  div > or < p   >
  s = s.replace(/<\s*([a-zA-Z]+)(\s[^>]*)?>/g, (m, t, rest) => `<${t}${rest || ""}>`);

  // 4) Resolve nested-escaped entities (&amp;lt; etc.) repeatedly until clean
  while (s.includes("&amp;lt;") || s.includes("&amp;gt;") || s.includes("&amp;amp;")) {
    s = s
      .replace(/&amp;amp;(#\d+;|#x[0-9a-fA-F]+;)/g, "&$1")
      .replace(/&amp;amp;([a-zA-Z]+;)/g, "&$1")
      .replace(/&amp;lt;/g, "&lt;")
      .replace(/&amp;gt;/g, "&gt;")
      .replace(/&amp;amp;/g, "&");
  }

  // 5) Convert REAL closing block tags to <br>, drop opening ones
  //    (We do this for both <div> and <p>)
  s = s.replace(/<\/\s*(div|p)\s*>/gi, "<br>");
  s = s.replace(/<\s*(div|p)[^>]*>/gi, "");

  // 6) Normalize <br/> variants and collapse multiples
  s = s.replace(/<br\s*\/?>/gi, "<br>");
  s = s.replace(/(?:<br>\s*){2,}/gi, "<br>"); // collapse runs

  return s;
}

function injectZWSP(html, every = 8) {
  const src = normalizeEscapedToReal(String(html ?? ""));
  return src.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => {
    if (tag) return tag;
    let out = text
      .replace(/([\/\-_:;,.\(\)\[\]])/g, '$1\u200b')
      .replace(/([A-Za-z])([A-Z][a-z])/g, '$1\u200b$2');
    out = out.replace(new RegExp(`(\\S{${every}})(?=\\S)`, 'g'), '$1\u200b');
    return out;
  });
}

function _parseInlineBIU(line) {
  const segs = [];
  let stack = [];
  let last = 0;
  const re = /<\/?(b|i|u)\s*>/ig;
  let m;
  const push = (t) => { if (t) segs.push({ text: t, b: stack.includes("b"), i: stack.includes("i"), u: stack.includes("u") }); };
  while ((m = re.exec(line)) !== null) {
    push(line.slice(last, m.index));
    const tag = m[1].toLowerCase();
    const closing = line[m.index + 1] === "/";
    if (closing) { const idx = stack.lastIndexOf(tag); if (idx >= 0) stack.splice(idx, 1); }
    else { stack.push(tag); }
    last = re.lastIndex;
  }
  push(line.slice(last));
  return segs;
}

function _tokenizeRichLine(line) {
  const segs = _parseInlineBIU(line);
  const tokens = [];
  segs.forEach((seg) => {
    const parts = String(seg.text).split(/(\s+)/);
    parts.forEach((p) => { if (p !== "") tokens.push({ text: p, b: !!seg.b, i: !!seg.i, isSpace: /^\s+$/.test(p) }); });
  });
  return tokens;
}

function measureStyledLineHeight(doc, htmlLine, width, fontSize, minLine) {
  const tokens = _tokenizeRichLine(htmlLine);
  const widthOf = (t, b, i) => {
    let fontName = "Unicode";
    if (b && i) fontName = "Unicode-Bold";
    else if (b) fontName = "Unicode-Bold";
    else if (i) fontName = "Unicode-Italic";
    doc.font(fontName).fontSize(fontSize);
    return doc.widthOfString(t);
  };
  const breakLongToken = (tok) => {
    const safe = typeof softWrap === "function" ? softWrap(tok.text) : tok.text;
    const pieces = safe.split(/(\u200b)/);
    return pieces.filter((p) => p && p !== "\u200b").map((p) => ({ ...tok, text: p }));
  };
  let lines = 1; let currentWidth = 0;
  tokens.forEach((tok) => {
    const chunks = breakLongToken(tok);
    chunks.forEach((chunk) => {
      const w = widthOf(chunk.text, chunk.b, chunk.i);
      if (!chunk.isSpace && currentWidth > 0 && currentWidth + w > width) { lines += 1; currentWidth = 0; }
      currentWidth += w;
    });
  });
  const lineH = Math.max(
    (doc.font("Unicode").fontSize(fontSize), doc.currentLineHeight(true)),
    (doc.font("Unicode-Bold").fontSize(fontSize), doc.currentLineHeight(true)),
    (doc.font("Unicode-Italic").fontSize(fontSize), doc.currentLineHeight(true)),
    minLine
  );
  return lines * lineH + 2;
}

function measureStyledBlockHeight(doc, html, width, fontSize = FONTS.body, minLine = 12) {
  const safe = normalizeEscapedToReal(html);
  const lines = safe.split(/<br\s*\/?>/i);
  let total = 0;
  lines.forEach((line) => { total += measureStyledLineHeight(doc, line, width, fontSize, minLine); });
  return total + 2;
}

function renderStyledLine(doc, htmlLine, x, y, width, fontSize, align) {
  const segs = _parseInlineBIU(htmlLine);
  let first = true;
  const safeWrap = (s) => (typeof softWrap === "function" ? softWrap(s) : s);
  segs.forEach((seg) => {
    if (!seg.text) return;
    let fontName = "Unicode";
    if (seg.b && seg.i) fontName = "Unicode-Bold";
    else if (seg.b) fontName = "Unicode-Bold";
    else if (seg.i) fontName = "Unicode-Italic";
    const commonOpts = { width, align, underline: !!seg.u, continued: true, lineBreak: true };
    const textToWrite = safeWrap(seg.text);
    if (first) { doc.font(fontName).fontSize(fontSize).fillColor("#000").text(textToWrite, x, y, commonOpts); first = false; }
    else { doc.font(fontName).fontSize(fontSize).fillColor("#000").text(textToWrite, commonOpts); }
  });
  doc.text("", { continued: false });
}

function stripForMeasure(html) {
  const real = normalizeEscapedToReal(html);
  return real.replace(/&nbsp;/gi, " ").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "");
}

function drawRichInBox(doc, html, x, y, width, align = "left", opts = {}) {
  const safe = normalizeEscapedToReal(html);
  const lines = safe.split(/<br\s*\/?>/i);
  const fontSize = opts.fontSize || FONTS.body;
  const minLine = opts.minLine || 12;
  doc.x = x; doc.y = y;
  lines.forEach((line) => {
    const plain = stripForMeasure(line) || " ";
    const h = Math.max(doc.font("Unicode").fontSize(fontSize).heightOfString(plain, { width, align }) + 2, minLine);
    if (doc.y + h > doc.page.height - doc.page.margins.bottom) doc.addPage();
    renderStyledLine(doc, line, x, doc.y, width, fontSize, align);
    doc.y += h;
  });
  markContent(doc);
}

function drawRichInCell(doc, html, x, y, width, align = "left", opts = {}) {
  const safe = normalizeEscapedToReal(html);
  const lines = safe.split(/<br\s*\/?>/i);
  const fontSize = opts.fontSize || FONTS.body;
  const minLine = opts.minLine || 12;
  let cursorY = y;
  lines.forEach((line) => {
    const plain = stripForMeasure(line) || " ";
    const h = Math.max(doc.font("Unicode").fontSize(fontSize).heightOfString(plain, { width, align }) + 2, minLine);
    renderStyledLine(doc, line, x, cursorY, width, fontSize, align);
    cursorY += h;
  });
  return cursorY - y;
}

function _parseInlineBIU_Agg(line) {
  const segs = [];
  let stack = [];
  let last = 0;
  const re = /<\/?(b|i|u)\s*>/ig;
  let m;
  const push = (t) => { if (t) segs.push({ text: t, b: stack.includes('b'), i: stack.includes('i'), u: stack.includes('u') }); };
  while ((m = re.exec(line)) !== null) {
    push(line.slice(last, m.index));
    const tag = m[1].toLowerCase();
    const closing = line[m.index + 1] === '/';
    if (closing) { const idx = stack.lastIndexOf(tag); if (idx >= 0) stack.splice(idx, 1); }
    else stack.push(tag);
    last = re.lastIndex;
  }
  push(line.slice(last));
  return segs;
}

function _widthOfRun(doc, text, fontSize, flags) {
  let fontName = "Unicode";
  if (flags.b && flags.i) fontName = "Unicode-Bold";
  else if (flags.b) fontName = "Unicode-Bold";
  else if (flags.i) fontName = "Unicode-Italic";
  doc.font(fontName).fontSize(fontSize);
  return doc.widthOfString(text);
}

function layoutStyledLines(doc, html, width, fontSize = FONTS.body, minLine = 12) {
  const prepped = injectZWSP(html);
  const safe = normalizeEscapedToReal(prepped);
  const rawLines = safe.split(/<br\s*\/?>/i);
  const lineH = Math.max(
    (doc.font("Unicode").fontSize(fontSize), doc.currentLineHeight(true)),
    (doc.font("Unicode-Bold").fontSize(fontSize), doc.currentLineHeight(true)),
    (doc.font("Unicode-Italic").fontSize(fontSize), doc.currentLineHeight(true)),
    minLine
  ) + 2;
  const out = [];
  rawLines.forEach((line) => {
    const segs = _parseInlineBIU_Agg(line);
    const tokens = [];
    segs.forEach(seg => {
      const pieces = String(seg.text).split(/(\s+)/);
      pieces.forEach(p => {
        if (p === "") return;
        const parts = p.split('\u200b');
        parts.forEach((q, idx) => {
          if (q !== "") tokens.push({ text: q, b: seg.b, i: seg.i, u: seg.u, isSpace: /^\s+$/.test(q) });
          if (idx < parts.length - 1) tokens.push({ text: "", b: seg.b, i: seg.i, u: seg.u, isSpace: true, zwsp: true });
        });
      });
    });
    let curWidth = 0; let curLine = [];
    const flush = () => { out.push(curLine); curLine = []; curWidth = 0; };
    tokens.forEach(tok => {
      const w = tok.isSpace ? (tok.zwsp ? 0 : _widthOfRun(doc, tok.text, fontSize, tok)) : _widthOfRun(doc, tok.text, fontSize, tok);
      if (!tok.isSpace && curWidth > 0 && curWidth + w > width) flush();
      if (!tok.zwsp) {
        if (tok.text) curLine.push({ text: tok.text, b: tok.b, i: tok.i, u: tok.u });
        else if (tok.isSpace) curLine.push({ text: " ", b: tok.b, i: tok.i, u: tok.u });
      }
      curWidth += w;
    });
    flush();
  });
  return { lines: out, lineH };
}

function drawTableAgg(doc, headers, rows) {
  const startX = 40;
  const pageWidth = doc.page.width;
  const colCount = headers.length;
  const colWidth = (pageWidth - 80) / Math.max(colCount, 1);
  const cellPadX = 6, cellPadY = 8;
  const bottomLimit = doc.page.height - doc.page.margins.bottom;
  const HEADER_FONTS = [9, 8, 7, 6];
  const CELL_FONTS = [9, 8, 7, 6];
  const MIN_LINE = 12;
  const MAX_HEADER_H = 280, MAX_ROW_H = 260;
  const measureWithLayout = (html, width, fonts, capPx) => {
    for (const fs of fonts) {
      const { lines, lineH } = layoutStyledLines(doc, html, width, fs, MIN_LINE);
      const h = Math.ceil(lines.length * lineH) + cellPadY * 2;
      if (h <= capPx) return { fs, h, lines, lineH };
    }
    const fs = fonts[fonts.length - 1];
    const { lines, lineH } = layoutStyledLines(doc, html, width, fs, MIN_LINE);
    return { fs, h: Math.min(Math.ceil(lines.length * lineH) + cellPadY * 2, capPx), lines, lineH };
  };
  const headerMetrics = headers.map(h => measureWithLayout(h, colWidth - cellPadX * 2, HEADER_FONTS, MAX_HEADER_H));
  const headerHeight = Math.max(...headerMetrics.map(m => m.h));
  let y = doc.y;
  if (y + headerHeight > bottomLimit) { doc.addPage(); y = doc.y; }
  headers.forEach((h, i) => {
    const x = startX + i * colWidth;
    doc.rect(x, y, colWidth, headerHeight).fillAndStroke('#f2f2f8', '#000');
    const m = headerMetrics[i]; let curY = y + cellPadY;
    m.lines.forEach(line => {
      let curX = x + cellPadX;
      line.forEach(seg => {
        let fontName = "Unicode";
        if (seg.b && seg.i) fontName = "Unicode-Bold"; else if (seg.b) fontName = "Unicode-Bold"; else if (seg.i) fontName = "Unicode-Italic";
        doc.font(fontName).fontSize(m.fs).fillColor("#000").text(seg.text, curX, curY, { lineBreak: false, continued: true });
        curX += doc.widthOfString(seg.text);
      });
      doc.text("", { continued: false }); curY += m.lineH;
    });
  });
  y += headerHeight;
  rows.forEach(row => {
    const metrics = row.map(cell => measureWithLayout(String(cell ?? ""), colWidth - cellPadX * 2, CELL_FONTS, MAX_ROW_H));
    const rowHeight = Math.max(...metrics.map(m => m.h));
    if (y + rowHeight > bottomLimit) {
      doc.addPage(); y = doc.y;
      headers.forEach((h, i) => {
        const x = startX + i * colWidth;
        doc.rect(x, y, colWidth, headerHeight).fillAndStroke('#f2f2f8', '#000');
        const m = headerMetrics[i]; let curY = y + cellPadY;
        m.lines.forEach(line => {
          let curX = x + cellPadX;
          line.forEach(seg => {
            let fontName = "Unicode";
            if (seg.b && seg.i) fontName = "Unicode-Bold"; else if (seg.b) fontName = "Unicode-Bold"; else if (seg.i) fontName = "Unicode-Italic";
            doc.font(fontName).fontSize(m.fs).fillColor("#000").text(seg.text, curX, curY, { lineBreak: false, continued: true });
            curX += doc.widthOfString(seg.text);
          });
          doc.text("", { continued: false }); curY += m.lineH;
        });
      });
      y += headerHeight;
    }
    row.forEach((_, i) => { const x = startX + i * colWidth; doc.rect(x, y, colWidth, rowHeight).stroke(); });
    row.forEach((cell, i) => {
      const x = startX + i * colWidth; const m = metrics[i]; let curY = y + cellPadY;
      m.lines.forEach(line => {
        let curX = x + cellPadX;
        line.forEach(seg => {
          let fontName = "Unicode";
          if (seg.b && seg.i) fontName = "Unicode-Bold"; else if (seg.b) fontName = "Unicode-Bold"; else if (seg.i) fontName = "Unicode-Italic";
          doc.font(fontName).fontSize(m.fs).fillColor("#000").text(seg.text, curX, curY, { lineBreak: false, continued: true });
          curX += doc.widthOfString(seg.text);
        });
        doc.text("", { continued: false }); curY += m.lineH;
      });
    });
    y += rowHeight;
  });
  doc.y = y + 10; markContent(doc);
}

function drawMatrixCounts(doc, labels, rows, counts) {
  const startX = 40;
  const pageWidth = doc.page.width;
  const cols = Array.isArray(labels) ? labels : [];
  const rws = Array.isArray(rows) ? rows : [];
  const colCount = cols.length + 1;
  const colWidth = (pageWidth - 80) / Math.max(colCount, 1);
  const cellPadX = 6, cellPadY = 7;
  let y = doc.y;
  const bottomLimit = doc.page.height - doc.page.margins.bottom;
  const HEADER_FONTS = [12, 11, 10, 9, 8, 7, 6];
  const ROW_FONTS = [11, 10, 9, 8, 7, 6];
  const MIN_LINE = 12;
  const MAX_HDR_H = 240, MAX_ROW_H = 220;
  const ensureSpace = (needed) => { if (y + needed > bottomLimit) { doc.addPage(); y = doc.y; } };
  const measureStyledDynamic = (html, width, fonts, capPx) => {
    for (const fs of fonts) { const h = measureStyledBlockHeight(doc, String(html ?? ""), width, fs, MIN_LINE) + cellPadY * 2; if (h <= capPx) return { fs, h }; }
    const fs = fonts[fonts.length - 1]; const h = measureStyledBlockHeight(doc, String(html ?? ""), width, fs, MIN_LINE) + cellPadY * 2; return { fs, h: Math.min(h, capPx) };
  };
  const headerMetrics = [ measureStyledDynamic(" ", colWidth - cellPadX * 2, HEADER_FONTS, MAX_HDR_H), ...cols.map(lbl => measureStyledDynamic(lbl, colWidth - cellPadX * 2, HEADER_FONTS, MAX_HDR_H)) ];
  const headerHeight = Math.max(...headerMetrics.map(m => m.h));
  ensureSpace(headerHeight);
  doc.rect(startX, y, colWidth, headerHeight).stroke();
  drawRichInCell(doc, " ", startX + cellPadX, y + cellPadY, colWidth - cellPadX * 2, "left", { fontSize: headerMetrics[0].fs, minLine: MIN_LINE });
  cols.forEach((lbl, i) => {
    const x = startX + (i + 1) * colWidth;
    doc.rect(x, y, colWidth, headerHeight).stroke();
    drawRichInCell(doc, String(lbl ?? ""), x + cellPadX, y + cellPadY, colWidth - cellPadX * 2, "center", { fontSize: headerMetrics[i + 1].fs, minLine: MIN_LINE });
  });
  y += headerHeight;
  rws.forEach((rLabel) => {
    const m = measureStyledDynamic(rLabel, colWidth - cellPadX * 2, ROW_FONTS, MAX_ROW_H);
    const rowHeight = Math.max(m.h, 36);
    ensureSpace(rowHeight);
    doc.rect(startX, y, colWidth, rowHeight).stroke();
    drawRichInCell(doc, String(rLabel ?? ""), startX + cellPadX, y + cellPadY, colWidth - cellPadX * 2, "left", { fontSize: m.fs, minLine: MIN_LINE });
    cols.forEach((c, i) => {
      const x = startX + (i + 1) * colWidth;
      doc.rect(x, y, colWidth, rowHeight).stroke();
      const val = (counts && counts[rLabel]) ? (counts[rLabel][c] ?? 0) : 0;
      const fs = FONTS.matrixCount;
      const availableW = colWidth - cellPadX * 2;
      const text = String(val);
      doc.font("Unicode-Bold").fontSize(fs);
      const textH = doc.heightOfString(text, { width: availableW, align: 'center' });
      const textY = y + (rowHeight - textH) / 2;
      doc.fillColor("#000").text(text, x + cellPadX, textY, { width: availableW, align: 'center', lineBreak: false });
    });
    y += rowHeight;
  });
  doc.y = y + 10; markContent(doc);
}

const drawMatrix = (doc, labels, rows, answers) => {
  const startX = 40;
  const pageWidth = doc.page.width;
  const cols = Array.isArray(labels) ? labels : [];
  const rws = Array.isArray(rows) ? rows : [];
  const colCount = cols.length + 1;
  const colWidth = (pageWidth - 80) / Math.max(colCount, 1);
  const cellPadX = 6, cellPadY = 7;
  let y = doc.y;
  const bottomLimit = doc.page.height - doc.page.margins.bottom;
  const HEADER_FONTS = [12, 11, 10, 9, 8, 7, 6];
  const ROW_FONTS = [11, 10, 9, 8, 7, 6];
  const MIN_LINE = 12;
  const MAX_HDR_H = 220, MAX_ROW_H = 200;
  const ensureSpace = (needed) => { if (y + needed > bottomLimit) { doc.addPage(); y = doc.y; } };
  const measureStyledDynamic = (html, width, fonts, capPx) => {
    for (const fs of fonts) { const h = measureStyledBlockHeight(doc, String(html ?? ""), width, fs, MIN_LINE) + cellPadY * 2; if (h <= capPx) return { fs, h }; }
    const fs = fonts[fonts.length - 1]; const h = measureStyledBlockHeight(doc, String(html ?? ""), width, fs, MIN_LINE) + cellPadY * 2; return { fs, h: Math.min(h, capPx) };
  };
  const headerMetrics = [ measureStyledDynamic(" ", colWidth - cellPadX * 2, HEADER_FONTS, MAX_HDR_H), ...cols.map(lbl => measureStyledDynamic(lbl, colWidth - cellPadX * 2, HEADER_FONTS, MAX_HDR_H)) ];
  const headerHeight = Math.max(...headerMetrics.map(m => m.h));
  ensureSpace(headerHeight);
  doc.rect(startX, y, colWidth, headerHeight).stroke();
  drawRichInCell(doc, " ", startX + cellPadX, y + cellPadY, colWidth - cellPadX * 2, "left", { fontSize: headerMetrics[0].fs, minLine: MIN_LINE });
  cols.forEach((lbl, i) => {
    const x = startX + (i + 1) * colWidth;
    doc.rect(x, y, colWidth, headerHeight).stroke();
    drawRichInCell(doc, String(lbl ?? ""), x + cellPadX, y + cellPadY, colWidth - cellPadX * 2, "center", { fontSize: headerMetrics[i + 1].fs, minLine: MIN_LINE });
  });
  y += headerHeight;
  rws.forEach((rLabel) => {
    const m = measureStyledDynamic(rLabel, colWidth - cellPadX * 2, ROW_FONTS, MAX_ROW_H);
    const rowHeight = Math.max(m.h, 36);
    ensureSpace(rowHeight);
    doc.rect(startX, y, colWidth, rowHeight).stroke();
    drawRichInCell(doc, String(rLabel ?? ""), startX + cellPadX, y + cellPadY, colWidth - cellPadX * 2, "left", { fontSize: m.fs, minLine: MIN_LINE });
    cols.forEach((c, i) => {
      const x = startX + (i + 1) * colWidth;
      doc.rect(x, y, colWidth, rowHeight).stroke();
      if (answers && answers[rLabel] === c) {
        doc.circle(x + colWidth / 2, y + rowHeight / 2, 5).fillColor("#27235c").fill().fillColor("#000");
      }
    });
    y += rowHeight;
  });
  doc.y = y + 10; markContent(doc);
};
exports.drawMatrix = drawMatrix;

const drawHeader = (doc, { title, leftLogo, rightLogo }) => {
  const marginLeft = doc.page.margins.left;
  const marginRight = doc.page.margins.right;
  const pageWidth = doc.page.width;
  const usableWidth = pageWidth - marginLeft - marginRight;
  const logoH = 64, logoW = 100, gap = 10, yTop = doc.y;
  if (leftLogo && Buffer.isBuffer(leftLogo)) doc.image(leftLogo, marginLeft, yTop, { height: logoH });
  if (rightLogo && Buffer.isBuffer(rightLogo)) {
    const xRight = pageWidth - marginRight - logoW;
    doc.image(rightLogo, xRight, yTop, { height: logoH, width: logoW, fit: [logoW, logoH] });
  }
  const titleX = marginLeft + logoW + gap;
  const titleW = Math.max(usableWidth - (logoW + gap) * 2, 120);
  doc.font("Unicode-Bold").fontSize(FONTS.title).fillColor("#27235c").text(title, titleX, yTop + 20, { width: titleW, align: "center" });
  const bandBottom = yTop + logoH + 10;
  doc.y = Math.max(doc.y, bandBottom);
  doc.moveDown(1);
  markContent(doc);
};
exports.drawHeader = drawHeader;

const drawMeta = (doc, meta) => {
  Object.entries(meta).forEach(([k, v]) => {
    doc.font("Unicode-Bold").fontSize(FONTS.meta).fillColor("#000").text(`${k}: ${v}`, 40, doc.y, {
      width: doc.page.width - 80, align: "left",
    });
    doc.moveDown(0.5);
  });
  doc.moveDown(1);
  doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
  doc.moveDown(1);
  markContent(doc);
};
exports.drawMeta = drawMeta;

const drawSectionTitle = (doc, text) => {
  doc.font("Unicode-Bold").fontSize(FONTS.section).fillColor("#27235c");
  const x = doc.page.margins.left, w = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  drawRichInBox(doc, text, x, doc.y, w, "left", { fontSize: FONTS.section, minLine: 12 });
  doc.moveDown(0.5);
  markContent(doc);
};
exports.drawSectionTitle = drawSectionTitle;

const drawQuestion = (doc, order, text) => {
  doc.font("Unicode-Bold").fontSize(FONTS.question).fillColor("#000");
  const x = doc.page.margins.left, w = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  drawRichInBox(doc, `${order}. ${text}`, x, doc.y, w, "left", { fontSize: FONTS.question, minLine: 12 });
  doc.moveDown(0.3);
  markContent(doc);
};
exports.drawQuestion = drawQuestion;

const drawDivider = (doc) => {
  doc.moveDown(1).strokeColor("#27235c").lineWidth(1).moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke().moveDown(1);
  markContent(doc);
};
exports.drawDivider = drawDivider;

const drawFooter = (doc, pageNumber) => {
  if (doc._writingFooter) return;
  doc._writingFooter = true;
  const savedY = doc.y, savedFont = doc._font, savedFontSize = doc._fontSize, savedFill = doc._fillColor;
  const originalBottomMargin = doc.page.margins.bottom;
  const baseBottom = doc._baseBottom || 60;
  doc.page.margins.bottom = baseBottom;
  const { left, right } = doc.page.margins;
  const pageWidth = doc.page.width;
  const width = pageWidth - left - right;
  const footerText = `Generated at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} | Page ${pageNumber}`;
  doc.font("Unicode").fontSize(FONTS.footer);
  const textHeight = doc.heightOfString(footerText, { width, align: "center" });
  const contentBottomY = doc.page.height - baseBottom;
  const footerY = Math.max(doc.page.margins.top, contentBottomY - textHeight - 2);
  doc.fillColor("#777").text(footerText, left, footerY, { width, align: "center", lineBreak: false });
  if (savedFont) doc._font = savedFont;
  if (savedFontSize) doc._fontSize = savedFontSize;
  if (savedFill) doc._fillColor = savedFill;
  doc.y = savedY;
  doc.page.margins.bottom = originalBottomMargin;
  doc._writingFooter = false;
};
exports.drawFooter = drawFooter;

const renderAggregatedPDFKit = (doc, report) => {
  if (report && report.matrix) {
    const rowLabels = Object.keys(report.matrix);
    const colLabels = Object.keys(report.matrix[rowLabels[0]] || {});
    drawMatrixCounts(doc, colLabels, rowLabels, report.matrix);
    return;
  }
  if (report && report.distribution) {
    const headers = ["Option", "Count"];
    const rows = Object.entries(report.distribution).map(([k, v]) => [k, v]);
    drawTableAgg(doc, headers, rows);
    return;
  }
  if (report && report.comments) {
    doc.font("Unicode-Bold").text(`Total Responses: ${report.comments.length}`, { align: "left" });
    doc.moveDown();
    return;
  }
  doc.font("Unicode").fillColor("#777").text("No aggregated data available", { align: "left" });
  doc.moveDown();
};
exports.renderAggregatedPDFKit = renderAggregatedPDFKit;

const renderIndividualPDFKit = (doc, q) => {
  if (q.type === 'comment') {
    drawRichInBox(doc, q.answer || '', doc.page.margins.left, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, "left", { fontSize: FONTS.body, minLine: 12 });
    doc.moveDown();
    return;
  }
  if (q.type === 'matrix') {
    drawMatrix(doc, q.scaleLabels, q.matrixLabels, q.answer);
    return;
  }
  let richValue = '';
  if (Array.isArray(q.answer)) richValue = q.answer.map((v) => String(v || '')).join('<br>');
  else if (typeof q.answer === 'string') richValue = q.answer;
  else richValue = String(q.answer ?? '');
  const x = doc.page.margins.left, w = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  drawRichInBox(doc, `Selected: ${richValue}`, x, doc.y, w, "left", { fontSize: FONTS.body, minLine: 12 });
  doc.moveDown();
  markContent(doc);
};
exports.renderIndividualPDFKit = renderIndividualPDFKit;

const horizontalScalePDFKit = (doc, total, selected) => {
  for (let i = 1; i <= total; i++) {
    const color = i <= selected ? "#27235c" : "#ccc";
    doc.fillColor(color).text("■", { continued: true });
  }
  doc.text(""); doc.moveDown();
};
exports.horizontalScalePDFKit = horizontalScalePDFKit;

function initPagination(doc) {
  doc._pageNumber = 1;
  doc._isAddingPage = false;
  const _origAddPage = doc.addPage.bind(doc);
  doc.addPage = (...args) => {
    if (doc._isAddingPage) return _origAddPage(...args);
    doc._isAddingPage = true;
    if (!doc._writingFooter && doc._pageHasContent) {
      drawFooter(doc, doc._pageNumber);
      doc._pageNumber += 1;
    }
    const res = _origAddPage(...args);
    doc._pageHasContent = false;
    doc._isAddingPage = false;
    return res;
  };
}
exports.initPagination = initPagination;

function finalizeWithFooterAndBuffer(doc) {
  return new Promise((resolve, reject) => {
    try {
      if (doc._pageHasContent) drawFooter(doc, doc._pageNumber);
      const buffers = [];
      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', err => reject(err));
      doc.end();
    } catch (e) { reject(e); }
  });
}
exports.finalizeWithFooterAndBuffer = finalizeWithFooterAndBuffer;

function drawQuestionType(doc, type) {
  if (!type) return;
  doc.font("Unicode").fontSize(9).fillColor("#555").text(`Type: ${String(type)}`, 40, doc.y, { align: "left" });
  doc.moveDown(0.4);
  markContent(doc);
}
exports.drawQuestionType = drawQuestionType;