
import React, { useMemo } from "react";
import QuestionShell from "./QuestionShell";
import QuestionRenderer from "./QuestionRenderer";
import { getQuestionId, getType } from "../utils/surveyTypes";

export default function SurveyFlow({
  questions,
  answers,
  setAnswer,
  activeIndex,
  setActiveIndex,
  viewport,
  disabled,
}) {
  const isSingle = viewport === "mobile"; // single-question-per-view on mobile

  const visibleQuestions = useMemo(() => {
    if (isSingle) return questions.slice(activeIndex, activeIndex + 1);
    // tablet/desktop: show a compact list (still focused, but faster navigation)
    return questions;
  }, [questions, isSingle, activeIndex]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className={isSingle ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {visibleQuestions.map((q, i) => {
          const qid = getQuestionId(q);
          const type = getType(q);
          const value = answers.get(qid);
          const index = isSingle ? activeIndex : i;

          return (
            <QuestionShell
              key={qid}
              index={index}
              total={questions.length}
              required={!!q.required}
              question={q}
            >
              <QuestionRenderer
                type={type}
                question={q}
                value={value}
                onChange={(v) => setAnswer(qid, v)}
                disabled={disabled}
              />
            </QuestionShell>
          );
        })}
      </div>
    </div>
  );
}
``
