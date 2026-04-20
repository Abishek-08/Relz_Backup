import React from "react";
import QuestionShell from "./QuestionShell";
import QuestionRenderer from "./QuestionRenderer";
import { getQuestionId, getType } from "../utils/surveyTypes";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import GradientBackdrop from "./GradientBackdrop";
import FormPoweredBy from "./FormPoweredBy";

export default function SurveyFlow({
  questions,
  answers,
  setAnswer,
  activeIndex,
  setActiveIndex,
  disabled,
  primaryColor = "#27235c",
  onSubmit,
  onBack,
  onClearQuestion,
  eventName,
  animDirection = "right",
  invalidQid
}) {
  const q = questions[activeIndex];
  const qid = q ? getQuestionId(q) : null;
  const type = q ? getType(q) : null;
  const value = qid ? answers.get(qid) : null;
  const total = questions.length;
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= total - 1;
  const motionClass =
    animDirection === "left" ? "slide-in-left" : "slide-in-right";

  return (
    <div className="kiosk-stage">
      <GradientBackdrop />
      <FormPoweredBy />

      <div className="kiosk-center">
        <div
          className={`w-full max-w-[720px] md:max-w-[820px] lg:max-w-[900px] bg-white/95 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl p-6 md:p-7 ${motionClass}`}
        >
            {eventName && (
              <div className="mb-2 flex justify-center">
                <div className="inline-block px-4 py-1.5 rounded-full bg-gray-600 text-white font-semibold text-base">
                  {eventName}
                </div>
              </div>
            )}
          <QuestionShell
            index={activeIndex}
            total={total}
            required={!!q?.required}
            question={q}
            primaryColor={primaryColor}
            onClear={() => onClearQuestion?.(qid)}
            invalid={invalidQid === qid}
            value={value}
          >
            <QuestionRenderer
              type={type}
              question={q}
              value={value}
              onChange={(v) => setAnswer(qid, v)}
              disabled={disabled}
              primaryColor={primaryColor}
            />
          </QuestionShell>

          {/* Actions below card; current/total only once */}
          <div className="mt-6 flex items-center gap-4 justify-between">
            <div className="text-sm sm:text-base text-[#27235c]/70">
              {activeIndex + 1} / {total}
            </div>
            
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => onBack?.()}
                disabled={isFirst}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[#274c77] disabled:text-[#27235c]/30 disabled:cursor-not-allowed hover:bg-[#27235c]/10 text-base font-medium transition cursor-pointer"
              >
                <ArrowLeft size={18} /> Back
              </button>
              {isLast ? (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={disabled}
                  className="inline-flex items-center gap-2 bg-[#274c77] hover:opacity-90 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl text-base font-semibold transition cursor-pointer"
                >
                  <Send size={18} /> Submit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((i) => Math.min(i + 1, total - 1))
                  }
                  className="inline-flex items-center gap-2 bg-[#274c77] hover:opacity-90 text-white px-8 py-3.5 rounded-2xl text-base font-semibold transition cursor-pointer"
                >
                  Next <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
