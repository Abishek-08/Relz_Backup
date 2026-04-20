import { getQuestionId, getType } from "./surveyTypes";

export function validateQuestion(q, value) {
  if (!q?.required) return true;

  const t = getType(q);

  const isNullish = value === null || value === undefined;
  const toNumber = (v) => (typeof v === "number" ? v : Number(v));
  const hasNumber = (v) => Number.isFinite(toNumber(v));

  if (t === "comment") {
    return !isNullish && String(value || "").trim().length > 0;
  }

  if (t === "checkbox") {
    return Array.isArray(value) && value.length > 0;
  }

  
if (t === "radio" || t === "dropdown") {
    // 0 is allowed; only null/undefined/empty is missing
    return !isNullish && String(value).trim() !== "";
  }

    if (t === "slider" || t === "rating" || t === "star") {
    if (value === null || value === undefined) return false;
    const n = Number(value);
    if (!Number.isFinite(n)) return false;

    const hasMin = typeof q?.scaleMin === "number";
    const hasMax = typeof q?.scaleMax === "number";
    let min = hasMin ? q.scaleMin : 0;
    let max = hasMax ? q.scaleMax : (t === "star" ? 5 : 10);

    if (t === "rating" && !hasMin) min = 1;
    if (t === "star") min = 0;

    return n >= min && n <= max; 
  }


  if (t === "matrix") {
    const rows = q.matrixQnLabels || q.matrixRows || [];
    return Array.isArray(value) && rows.every((_, ri) => value[ri] != null);
  }

  return !isNullish && String(value).trim() !== "";
}


export function pageHasMissingRequired(questions, answers) {
  return questions.some((q) => !validateQuestion(q, answers.get(getQuestionId(q))));
}

export function normalizeMatrixValue(q, raw) {
  const rows = q.matrixQnLabels || q.matrixRows || [];
  const cols = q.scaleLabels || [];
  const out = {};
  rows.forEach((r, ri) => {
    const ci = Array.isArray(raw) ? raw[ri] : null;
    if (ci != null && ci >= 0 && ci < cols.length) {
      out[String(r) || `Row ${ri + 1}`] = String(cols[ci] ?? ci);
    }
  });
  return out;
}
