export function wrapSelectionWithTag(el, value, tag) {
  const v = String(value ?? "");
  const start = el?.selectionStart ?? v.length;
  const end = el?.selectionEnd ?? v.length;
  const before = v.slice(0, start);
  const after = v.slice(end);
  const insert = end > start ? `<${tag}>${v.slice(start, end)}</${tag}>` : `<${tag}></${tag}>`;
  const nv = `${before}${insert}${after}`;
  const pos = before.length + (end > start ? insert.length : `<${tag}>`.length);
  return { value: nv, caretStart: pos, caretEnd: pos };
}

export function insertLineBreakAtCaret(el, value) {
  const v = String(value ?? "");
  const start = el?.selectionStart ?? v.length;
  const end = el?.selectionEnd ?? v.length;
  const nv = v.slice(0, start) + "<br>" + v.slice(end);
  const pos = start + 4;
  return { value: nv, caretStart: pos, caretEnd: pos };
}

export function sanitizeInlineHTML(input) {
  if (!input) return "";
  let html = String(input);

  html = html.replace(/<(script|style|iframe)[^>]*>[\s\S]*?<\/\1>/gi, "");

  html = html.replace(/<\s*strong\b[^>]*>/gi, "<b>")
             .replace(/<\s*\/\s*strong\s*>/gi, "</b>")
             .replace(/<\s*em\b[^>]*>/gi, "<i>")
             .replace(/<\s*\/\s*em\s*>/gi, "</i>");

  html = html.replace(/<\s*(b|i|u|br)\b[^>]*>/gi, "<$1>");
  html = html.replace(/<\/\s*(b|i|u|br)\s*>/gi, "</$1>");

  html = html.replace(/&lt;br\s*\/?&gt;/gi, "<br>");
  html = html.replace(/<\s*br\s*\/?>/gi, "<br>");

  html = html.replace(/<(?!\/?(?:b|i|u|br|div|p)\b)[^>]*>/gi, "");
  html = html.replace(/<\/(?!b|i|u|br|div|p)[^>]*>/gi, "");

  html = html.replace(/&nbsp;/gi, " ");

  return html;
}

export function stripInlineTags(s) {
  return String(s || "")
    .replace(/<(script|style|iframe)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;br\s*\/?&gt;/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(div|p)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export function toDisplayHTML(escaped) {
  let s = String(escaped || "");

  s = s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

  s = s.replace(/<(?!\/?(?:b|i|u|br|div|p)\b)[^>]*>/gi, "");

  s = s.replace(/<\/\s*(div|p)\s*>/gi, "<br>").replace(/<\s*(div|p)[^>]*>/gi, "");

  s = s.replace(/<\s*br\s*\/?>/gi, "<br>").replace(/(?:<br>\s*){3,}/gi, "<br><br>");

  s = s.replace(/<\s*(b|i|u)[^>]*>/gi, "<$1>").replace(/<\/\s*(b|i|u)\s*>/gi, "</$1>");

  return s;
}

export function toAxisLabel(escaped) {
  return stripInlineTags(escaped);
}