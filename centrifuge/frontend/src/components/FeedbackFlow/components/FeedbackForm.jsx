import React from "react";
import { ChevronLeft, ChevronRight, Send, Check } from "lucide-react";

export default function FeedbackForm({
  eventInformation,
  eventName,
  assets,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  feedbackQuestionResponses,
  onChangeAnswer,
  prevQuestion,
  nextQuestion,
  answeredCount,
  submitFeedback,
  isSubmitting,
}) {
  const { poweredBy, questionicon } = assets;
  const total = feedbackQuestionResponses.length;
  const current = feedbackQuestionResponses[currentQuestionIndex];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-500 flex items-center justify-center z-[60]">
      <div className="w-full max-w-7xl mx-auto p-8 relative">
        <div className="flex gap-8">
          {/* Left panel */}
          <div className="w-1/4 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Questions
            </h3>
            <div className="grid grid-cols-3 portrait:grid-cols-2 gap-4">
              {feedbackQuestionResponses.map((q, idx) => {
                const isAnswered = !!q.answer;
                const isActive = currentQuestionIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg font-semibold transition-all duration-300 cursor-pointer
                    ${isActive ? "ring-2 ring-[#274c77] scale-110" : ""}
                    ${isAnswered ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <div className="w-3/4">
            <div className="mb-10">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center text-gray-700 mb-4">
                  <span className="text-xl font-semibold">
                    {answeredCount} of {total} Answered
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#274c77]">
                      {Math.round((answeredCount / total) * 100)} %
                    </span>
                    <p className="text-sm text-gray-500">Complete</p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[#274c77] to-[#5a7db8] rounded-full h-4 transition-all duration-700 shadow-lg"
                    style={{ width: `${(answeredCount / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-12 mb-10 border border-white/50">
              {current?.answer && (
                <button
                  onClick={() => onChangeAnswer(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full shadow-sm transition duration-300 z-20 cursor-pointer"
                  aria-label="Clear current answer"
                >
                  Clear Selection
                </button>
              )}

              <div className="text-center mb-10">
                <div className="w-25 h-25 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <img src={questionicon} width={200} />
                </div>
                <h2
                  className={`text-[#de3163] font-bold mb-4 leading-relaxed max-w-4xl mx-auto ${current?.feedbackQuestion?.length <= 20 ? "text-3xl" : "text-xl"}`}
                >
                  {current?.feedbackQuestion}
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-[#274c77] to-[#5a7db8] rounded-full mx-auto" />
              </div>

              <div className="max-w-5xl mx-auto relative">
                <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8">
                  {[
                    {
                      emoji: "😍",
                      hover: "🥰",
                      value: 5,
                      label: "Excellent",
                      color: "bg-green-500",
                      hoverColor: "hover:bg-green-400",
                    },
                    {
                      emoji: "😊",
                      hover: "😁",
                      value: 4,
                      label: "Good",
                      color: "bg-lime-400",
                      hoverColor: "hover:bg-lime-300",
                    },
                    {
                      emoji: "😐",
                      hover: "🤔",
                      value: 3,
                      label: "Average",
                      color: "bg-yellow-400",
                      hoverColor: "hover:bg-yellow-300",
                    },
                    {
                      emoji: "😕",
                      hover: "😞",
                      value: 2,
                      label: "Poor",
                      color: "bg-orange-400",
                      hoverColor: "hover:bg-orange-300",
                    },
                    {
                      emoji: "😢",
                      hover: "😭",
                      value: 1,
                      label: "Very Poor",
                      color: "bg-red-500",
                      hoverColor: "hover:bg-red-400",
                    },
                  ].map((opt) => (
                    <div key={opt.value} className="text-center group">
                      <button
                        onClick={() => onChangeAnswer(opt.value)}
                        className={`relative w-24 h-24 lg:w-28 lg:h-28 rounded-full border-4 font-bold text-4xl lg:text-5xl transition-all duration-300 transform hover:scale-110 shadow-xl
                        ${
                          current?.answer === opt.value
                            ? `${opt.color} border-white shadow-2xl scale-110`
                            : `border-gray-300 bg-white hover:border-gray-400 shadow-lg ${opt.hoverColor}`
                        }`}
                      >
                        <span className="group-hover:hidden">{opt.emoji}</span>
                        <span className="hidden group-hover:inline-block animate-pulse">
                          {opt.hover}
                        </span>
                        {current?.answer === opt.value && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#274c77] rounded-full flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </button>
                      <p
                        className={`mt-4 text-base lg:text-xl font-bold ${
                          current?.answer === opt.value
                            ? "text-[#de3163] text-2xl font-bold"
                            : "text-[#de3163] group-hover:text-[#de3163]"
                        }`}
                      >
                        {opt.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white p-3 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl transition-all text-lg font-semibold shadow-xl ${
                  currentQuestionIndex === 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#274c77] text-white hover:bg-[#1e3a5f] cursor-pointer"
                }`}
              >
                <ChevronLeft size={24} />
                <span>Previous</span>
              </button>

              <div className="text-center">
                <div className="inset-0 z-0 flex justify-center items-center gap-4 flex-wrap overflow-hidden">
                  <img
                    src={poweredBy}
                    alt="R2DC Logo"
                    style={{
                      userSelect: "none",
                      width: "8vw",
                      maxWidth: "80px",
                      height: "auto",
                      pointerEvents: "none",
                      zIndex: 0,
                    }}
                  />
                  <div className="text-sm sm:text-base md:text-lg mb-1 leading-tight font-semibold">
                    <span className="text-[9px] text-[#27235c] font-light">
                      Powered by
                    </span>
                    <span className="text-[#27235c] font-bold ml-2">
                      Relevantz R&amp;D Centre (R2DC)
                    </span>
                  </div>
                </div>
              </div>

              {currentQuestionIndex === total - 1 ? (
                <button
                  onClick={submitFeedback}
                  disabled={
                    isSubmitting ||
                    feedbackQuestionResponses.some((r) => r.answer == null)
                  }
                  className="flex items-center space-x-3 px-8 py-4 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-xl cursor-pointer"
                >
                  <span>
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </span>
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-70"></div>
                  ) : (
                    <Send size={24} />
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={current?.answer == null}
                  className="flex items-center space-x-3 px-8 py-4 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-xl cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
