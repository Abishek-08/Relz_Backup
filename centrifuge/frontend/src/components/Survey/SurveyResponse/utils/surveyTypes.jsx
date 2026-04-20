
export function getQuestionId(q) {
  return q?.surveyQuestionId ?? q?.id ?? q?._id ?? String(Math.random());
}

export function getType(q) {
  const t = (q?.surveyQuestionType ?? q?.type ?? "").toString().toLowerCase();
  if (t === "star" || t === "stars") return "star";
  if (t === "rating") return "rating";
  if (t === "slider") return "slider";
  if (t === "checkbox" || t === "multi" || t === "multi-select") return "checkbox";
  if (t === "radio" || t === "multiple choice" || t === "single-select") return "radio";
  if (t === "dropdown" || t === "select") return "dropdown";
  if (t === "matrix") return "matrix";
  if (t === "comment" || t === "text" || t === "textarea") return "comment";
  return "comment";
}
