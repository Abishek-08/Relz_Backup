// import React, { useEffect, useMemo, useState } from "react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import {
//   PanelRightClose,
//   PanelRightOpen,
//   Trash2,
//   Upload,
//   FileVideo2,
// } from "lucide-react";
// import SortableItem from "./SortableItem";
// import {
//   getSurveyQuestionsByEventCategoryId,
//   getSurveyQuestionsByEventAndEventCategoryId,
//   addSurveyQuestionsAndLaunchFeedback,
// } from "../../../services/Services";
// import { decryptSession } from "../../../utils/SessionCrypto";
// import { useToast } from "../../../utils/useToast";
// const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
// const QUESTION_TYPES = [
//   { value: "comment", label: "Comment" },
//   { value: "checkbox", label: "Checkbox" },
//   { value: "radio", label: "Radio" },
//   { value: "dropdown", label: "Dropdown" }, // <-- added
//   { value: "star", label: "Star" },
//   { value: "rating", label: "Rating (Scale)" },
//   { value: "slider", label: "Slider" },
//   { value: "matrix", label: "Matrix" },
// ];
// function SurveyAddQuestion() {
//   const [questions, setQuestions] = useState([]);
//   const [previousQuestions, setPreviousQuestions] = useState([]);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [filterText, setFilterText] = useState("");
//   // Global pre-launch settings
//   const [themeChoice, setThemeChoice] = useState("default");
//   const [themeFile, setThemeFile] = useState(null);
//   const [responseMode, setResponseMode] = useState("anonymous");
//   // Timeouts
//   const [thankyouTimeout, setThankyouTimeout] = useState("5");
//   const [idleTimeoutValue, setIdleTimeoutValue] = useState("10");
//   const [idleTimeoutUnit, setIdleTimeoutUnit] = useState("minutes");
//   // New Question model
//   const [newQuestion, setNewQuestion] = useState({
//     text: "",
//     type: "comment",
//     options: [], // checkbox/radio/dropdown OR matrix rows
//     scaleMin: 1,
//     scaleMax: 5,
//     scaleLabels: [], // e.g., ["Poor", "Average", "Good"]
//     matrixRows: [], // UI field -> will map to matrixQnLabels in payload
//     required: false, // per question fallback if needed
//   });
//   const eventCategoryId = Number(
//     decryptSession(localStorage.getItem("eventCategoryId")),
//   );
//   const eventId = Number(
//     decryptSession(localStorage.getItem("selectedEventId")),
//   );
//   const surveyOwnerEmail = decryptSession(localStorage.getItem("email"));
//   const masterSocket = "123jhv";
//   const { success, error } = useToast();
//   // Derived
//   const filteredQuestions = useMemo(
//     () =>
//       previousQuestions.filter((pq) =>
//         (pq.surveyQuestion || "")
//           .toLowerCase()
//           .includes(filterText.toLowerCase()),
//       ),
//     [previousQuestions, filterText],
//   );
//   // Helpers
//   const validateThemeFile = (file) => {
//     if (!file) return true;
//     const validTypes = ["image/gif", "video/mp4"];
//     if (!validTypes.includes(file.type)) {
//       error("Theme must be GIF or MP4.");
//       return false;
//     }
//     const maxBytes = 50 * 1024 * 1024; // 50MB
//     if (file.size > maxBytes) {
//       error("Theme file size must be ≤ 50MB.");
//       return false;
//     }
//     return true;
//   };
//   const sanitizeNumberString = (s) => String(s ?? "").replace(/[^\d]/g, "");
//   const clampThankyou = (s) => {
//     const n = Number(s ?? 0);
//     if (!Number.isFinite(n)) return "0";
//     if (n < 0) return "0";
//     if (n > 30) return "30";
//     return String(n);
//   };
//   // unit should be exactly "minutes" or "hours"
//   const clampIdle = (s, unit) => {
//     const n = Number(s ?? 0);
//     if (!Number.isFinite(n)) return unit === "minutes" ? "10" : "1";
//     if (unit === "minutes") {
//       if (n < 10) return "10";
//     } else if (unit === "hours") {
//       if (n < 1) return "1";
//     }
//     return String(n);
//   };
//   // Load previous questions from API
//   useEffect(() => {
//     const fetchPrev = async () => {
//       try {
//         let data;
//         if (eventId) {
//           data = await getSurveyQuestionsByEventAndEventCategoryId(
//             eventCategoryId,
//             eventId,
//           );
//         } else {
//           data = await getSurveyQuestionsByEventCategoryId(eventCategoryId);
//         }
//         setPreviousQuestions(Array.isArray(data?.data) ? data.data : []);
//       } catch (err) {
//         console.error("Failed to load previous questions", err);
//         setPreviousQuestions([]);
//       }
//     };
//     fetchPrev();
//   }, [eventCategoryId, eventId]);
//   // CRUD for in-memory questions
//   const onUpdate = (id, changes) => {
//     setQuestions((prev) =>
//       prev.map((q) => (q.id === id ? { ...q, ...changes } : q)),
//     );
//   };
//   const onRemove = (id) => {
//     setQuestions((prev) =>
//       prev
//         .filter((q) => q.id !== id)
//         .map((q, idx) => ({ ...q, displayOrder: idx + 1 })),
//     );
//   };
//   const onDuplicate = (q) => {
//     const displayOrder = questions.length + 1;
//     const clone = {
//       ...q,
//       id: makeId(),
//       displayOrder,
//     };
//     setQuestions((prev) => [...prev, clone]);
//   };
//   const handleAddQuestion = () => {
//     if (!newQuestion.text.trim()) {
//       error("Question text is required.");
//       return;
//     }
//     // Basic guardrails per type
//     if (["checkbox", "radio", "dropdown"].includes(newQuestion.type)) {
//       if (!newQuestion.options || newQuestion.options.length === 0) {
//         error("Add at least one option.");
//         return;
//       }
//     }
//     if (["rating", "slider", "star"].includes(newQuestion.type)) {
//       if (Number(newQuestion.scaleMin) >= Number(newQuestion.scaleMax)) {
//         error("Scale min must be less than max.");
//         return;
//       }
//     }
//     if (newQuestion.type === "matrix") {
//       if (!newQuestion.options?.length || !newQuestion.matrixRows?.length) {
//         error("Matrix requires at least one row.");
//         return;
//       }
//     }
//     const displayOrder = questions.length + 1;
//     setQuestions((prev) => [
//       ...prev,
//       {
//         id: makeId(),
//         text: newQuestion.text,
//         type: newQuestion.type,
//         options: newQuestion.options || [],
//         scaleMin: Number(newQuestion.scaleMin) || 1,
//         scaleMax: Number(newQuestion.scaleMax) || 5,
//         scaleLabels: newQuestion.scaleLabels || [],
//         matrixRows: newQuestion.matrixRows || [],
//         displayOrder,
//         required: !!newQuestion.required,
//       },
//     ]);
//     // Reset new question editor
//     setNewQuestion({
//       text: "",
//       type: "comment",
//       options: [],
//       scaleMin: 1,
//       scaleMax: 5,
//       scaleLabels: [],
//       matrixRows: [],
//       required: false,
//     });
//   };
//   // DnD for current questions
//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) return;
//     const oldIndex = questions.findIndex((q) => q.id === active.id);
//     const newIndex = questions.findIndex((q) => q.id === over.id);
//     const reordered = arrayMove(questions, oldIndex, newIndex).map(
//       (q, idx) => ({
//         ...q,
//         displayOrder: idx + 1,
//       }),
//     );
//     setQuestions(reordered);
//   };
//   const handleDelete = (id) => {
//     setQuestions((prev) => {
//       const filtered = prev.filter((q) => q.id !== id);
//       // re-number displayOrder
//       return filtered.map((q, idx) => ({ ...q, displayOrder: idx + 1 }));
//     });
//   };
//   const handleDuplicate = (q) => {
//     const copy = {
//       ...q,
//       id: `${q.id}-copy-${Date.now()}`,
//       displayOrder: questions.length + 1,
//     };
//     setQuestions((prev) => [...prev, copy]);
//   };
//   // Add previous question to builder
//   const addPreviousQuestion = (pq) => {
//     const exists = questions.some(
//       (q) => q.text.trim() === (pq.surveyQuestion || "").trim(),
//     );
//     const displayOrder = questions.length + 1;
//     if (exists) {
//       error("This question is already added.");
//       return;
//     }
//     setQuestions((prev) => [
//       ...prev,
//       {
//         id: `${pq.surveyQuestionId || makeId()}-${makeId()}`,
//         text: pq.surveyQuestion,
//         type: pq.surveyQuestionType,
//         options: ["checkbox", "radio", "dropdown"].includes(
//           pq.surveyQuestionType,
//         )
//           ? pq.surveyCheckBoxOptions || []
//           : [],
//         scaleMin: pq.scaleMin ?? 1,
//         scaleMax: pq.scaleMax ?? 5,
//         scaleLabels: pq.scaleLabels || [],
//         matrixRows: pq.matrixQnLabels || [], // <-- rows
//         displayOrder,
//         required: !!pq.required,
//       },
//     ]);
//   };
//   const toApiQuestion = (q, idx) => ({
//     surveyQuestion: q.text,
//     surveyQuestionType: q.type,
//     surveyCheckBoxOptions: ["checkbox", "radio", "dropdown"].includes(q.type)
//       ? q.options || []
//       : [],
//     scaleMin: ["rating", "slider", "star", "matrix"].includes(q.type)
//       ? q.scaleMin
//       : undefined,
//     scaleMax: ["rating", "slider", "star", "matrix"].includes(q.type)
//       ? q.scaleMax
//       : undefined,
//     scaleLabels: ["rating", "slider", "star", "matrix"].includes(q.type)
//       ? q.scaleLabels || []
//       : [],
//     matrixQnLabels:
//       q.type === "matrix" ? (q.matrixRows ?? []) : [],
//     required: !!q.required,
//     displayOrder: idx + 1,
//   });
//   const launchSurvey = async () => {
//     if (themeChoice === "custom") {
//       if (!themeFile) {
//         error("Please upload a theme (GIF/MP4) or choose Default.");
//         return;
//       }
//       if (!validateThemeFile(themeFile)) return;
//     }
//     if (questions.length === 0) {
//       error("Add at least one question.");
//       return;
//     }
//     const thankyou = clampThankyou(sanitizeNumberString(thankyouTimeout));
//     const idleVal = clampIdle(
//       sanitizeNumberString(idleTimeoutValue),
//       idleTimeoutUnit,
//     );
//     // Build the final payload pieces
//     const isAnonymousSurvey = responseMode === "anonymous";
//     const apiQuestions = questions.map((q, idx) => toApiQuestion(q, idx));
//     const formData = new FormData();
//     formData.append("eventId", String(eventId));
//     formData.append("surveyOwnerEmail", surveyOwnerEmail || "");
//     formData.append("masterSocket", masterSocket || "");
//     formData.append("isAnonymousSurvey", String(isAnonymousSurvey));
//     formData.append("thankyouTimeout", String(Number(thankyou)));
//     formData.append("idleTimeoutValue", String(Number(idleVal)));
//     formData.append("idleTimeoutUnit", idleTimeoutUnit);
//     formData.append("questions", JSON.stringify(apiQuestions));
//     if (themeChoice === "custom" && themeFile) {
//       formData.append("backgroundTheme", themeFile); // binary
//     }
//     try {
//       await addSurveyQuestionsAndLaunchFeedback(formData); // <-- ensure Services handles FormData
//       success("Survey launched!");
//     } catch (e) {
//       console.error(e);
//       error("Failed to launch survey.");
//     }
//   };
//   // --- UI RENDER ---
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       {showSidebar && (
//         <aside className="w-80 bg-white shadow-lg transition-all duration-300 rounded-l-lg flex flex-col">
//           <div className="p-4 border-b flex justify-between items-center">
//             <h2 className="text-lg font-bold text-[#27235c]">
//               Previous Questions
//             </h2>
//             <button
//               className="text-gray-600 hover:text-[#27235c]"
//               onClick={() => setShowSidebar(false)}
//               aria-label="Close previous questions"
//             >
//               <PanelRightClose size={22} />
//             </button>
//           </div>
//           <div className="p-4 space-y-3 overflow-y-auto">
//             <input
//               type="text"
//               placeholder="Search questions..."
//               className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#27235c]"
//               value={filterText}
//               onChange={(e) => setFilterText(e.target.value)}
//             />
//             {filteredQuestions.map((pq) => (
//               <div
//                 key={pq.surveyQuestionId ?? `${pq.surveyQuestion}-${makeId()}`}
//                 className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
//                 onClick={() => addPreviousQuestion(pq)}
//                 role="button"
//                 tabIndex={0}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") addPreviousQuestion(pq);
//                 }}
//               >
//                 <p className="font-medium text-gray-800">{pq.surveyQuestion}</p>
//                 <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-600">
//                   {pq.surveyQuestionType}
//                 </span>
//                 {["slider", "rating", "star", "matrix"].includes(
//                   pq.surveyQuestionType,
//                 ) && (
//                   <p className="text-xs text-gray-600 mt-1">
//                     Scale: {pq.scaleMin ?? 1} - {pq.scaleMax ?? 5}
//                   </p>
//                 )}
//                 {pq.scaleLabels?.length > 0 && (
//                   <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
//                     {pq.scaleLabels.map((label, idx) => (
//                       <li key={idx}>{label}</li>
//                     ))}
//                   </ul>
//                 )}
//                 {pq.surveyQuestionType === "matrix" &&
//                   pq.matrixQnLabels?.length > 0 && (
//                     <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
//                       {pq.matrixQnLabels.map((label, idx) => (
//                         <li key={idx}>{label}</li>
//                       ))}
//                     </ul>
//                   )}
//               </div>
//             ))}
//             {filteredQuestions.length === 0 && (
//               <p className="text-sm text-gray-500">
//                 No matches in previous questions.
//               </p>
//             )}
//           </div>
//           <div className="p-4 border-t">
//             {previousQuestions.length === 0 && (
//               <p className="text-sm text-gray-500">
//                 No previous questions found.
//               </p>
//             )}
//           </div>
//         </aside>
//       )}
//       {/* Main Content */}
//       <main
//         className={`flex-1 transition-all duration-300 p-6 ${
//           showSidebar ? "md:w-[calc(100%-20rem)]" : "md:w-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-[#27235c]">Survey Builder</h1>
//           <div className="flex items-center gap-2">
//             <button
//               className="hidden md:flex items-center text-gray-600 hover:text-[#27235c]"
//               onClick={() => setShowSidebar((s) => !s)}
//             >
//               {showSidebar ? (
//                 <PanelRightClose size={24} />
//               ) : (
//                 <PanelRightOpen size={24} />
//               )}
//             </button>
//             <button
//               className="md:hidden bg-[#27235c] text-white px-3 py-1 rounded-lg"
//               onClick={() => setShowSidebar(true)}
//             >
//               Previous
//             </button>
//           </div>
//         </div>
//         {/* Pre-Launch Settings */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           {/* Theme */}
//           <div className="bg-white p-5 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-[#27235c] mb-3">
//               Background Theme
//             </h3>
//             <div className="space-y-3">
//               <div className="flex items-center gap-3">
//                 <input
//                   id="theme-default"
//                   type="radio"
//                   name="theme"
//                   checked={themeChoice === "default"}
//                   onChange={() => setThemeChoice("default")}
//                   className="h-4 w-4 text-[#27235c] focus:ring-[#27235c]"
//                 />
//                 <label
//                   htmlFor="theme-default"
//                   className="text-sm text-gray-800"
//                 >
//                   Use default theme
//                 </label>
//               </div>
//               <div className="flex items-center gap-3">
//                 <input
//                   id="theme-custom"
//                   type="radio"
//                   name="theme"
//                   checked={themeChoice === "custom"}
//                   onChange={() => setThemeChoice("custom")}
//                   className="h-4 w-4 text-[#27235c] focus:ring-[#27235c]"
//                 />
//                 <label htmlFor="theme-custom" className="text-sm text-gray-800">
//                   Upload custom (GIF/MP4, ≤ 50MB)
//                 </label>
//               </div>
//               <div
//                 className={`mt-2 ${themeChoice === "custom" ? "block" : "hidden"}`}
//               >
//                 <label className="flex items-center justify-between w-full border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
//                   <div className="flex items-center gap-2">
//                     <Upload className="text-[#27235c]" size={18} />
//                     <span className="text-sm text-gray-700">
//                       {themeFile ? themeFile.name : "Choose theme file"}
//                     </span>
//                   </div>
//                   <FileVideo2 className="text-gray-400" size={18} />
//                   <input
//                     type="file"
//                     accept="image/gif,video/mp4"
//                     className="hidden"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (!file) return;
//                       if (!validateThemeFile(file)) {
//                         e.target.value = "";
//                         return;
//                       }
//                       setThemeFile(file);
//                     }}
//                   />
//                 </label>
//                 {themeFile && (
//                   <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
//                     <span>
//                       {(themeFile.size / (1024 * 1024)).toFixed(1)} MB
//                     </span>
//                     <button
//                       className="text-red-600 hover:underline inline-flex items-center gap-1"
//                       onClick={() => setThemeFile(null)}
//                     >
//                       <Trash2 size={14} />
//                       Remove
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           {/* Response Mode */}
//           <div className="bg-white p-5 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-[#27235c] mb-3">
//               Response Mode
//             </h3>
//             <div className="space-y-3">
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="resp-mode"
//                   className="h-4 w-4 text-[#27235c] focus:ring-[#27235c]"
//                   checked={responseMode === "anonymous"}
//                   onChange={() => setResponseMode("anonymous")}
//                 />
//                 <span className="text-sm text-gray-800">Anonymous</span>
//               </label>
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="resp-mode"
//                   className="h-4 w-4 text-[#27235c] focus:ring-[#27235c]"
//                   checked={responseMode === "email"}
//                   onChange={() => setResponseMode("email")}
//                 />
//                 <span className="text-sm text-gray-800">Email-based</span>
//               </label>
//             </div>
//           </div>
//           {/* Timeouts */}
//           <div className="bg-white p-5 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-[#27235c] mb-3">
//               Timeouts
//             </h3>
//             <div className="space-y-4">
//               {/* Thank you timeout */}
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">
//                   Thank you screen timeout (0–30 seconds)
//                 </label>
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   value={thankyouTimeout}
//                   onChange={(e) => {
//                     const s = sanitizeNumberString(e.target.value);
//                     setThankyouTimeout(s);
//                   }}
//                   onBlur={() => setThankyouTimeout((s) => clampThankyou(s))}
//                   placeholder="e.g., 5"
//                   className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#27235c]"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Only numbers allowed; max 30s.
//                 </p>
//               </div>
//               {/* Idle timeout */}
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">
//                   Idle timeout (min ≥ 10 or hour ≥ 1)
//                 </label>
//                 <div className="flex gap-3">
//                   <input
//                     type="text"
//                     inputMode="numeric"
//                     value={idleTimeoutValue}
//                     onChange={(e) => {
//                       const s = sanitizeNumberString(e.target.value);
//                       setIdleTimeoutValue(s);
//                     }}
//                     onBlur={() =>
//                       setIdleTimeoutValue((s) => clampIdle(s, idleTimeoutUnit))
//                     }
//                     className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#27235c]"
//                     placeholder={
//                       idleTimeoutUnit === "min" ? "e.g., 10" : "e.g., 1"
//                     }
//                   />
//                   <select
//                     value={idleTimeoutUnit}
//                     onChange={(e) =>
//                       setIdleTimeoutUnit(
//                         e.target.value === "min" ? "min" : "hour",
//                       )
//                     }
//                     className="w-28 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#27235c]"
//                   >
//                     <option value="min">Minutes</option>
//                     <option value="hour">Hours</option>
//                   </select>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Minimum 10 minutes or 1 hour depending on unit.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>
//         {/* Question Form */}
//         <section className="space-y-4 bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold text-[#27235c]">
//             Add a Question
//           </h2>
//           {/* Text */}
//           <input
//             type="text"
//             placeholder="Enter question text"
//             value={newQuestion.text}
//             onChange={(e) =>
//               setNewQuestion({ ...newQuestion, text: e.target.value })
//             }
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#27235c]"
//           />
//           {/* Type */}
//           <select
//             value={newQuestion.type}
//             onChange={(e) => {
//               const type = e.target.value;
//               setNewQuestion((prev) => ({
//                 ...prev,
//                 type,
//               }));
//             }}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#27235c]"
//           >
//             {QUESTION_TYPES.map((t) => (
//               <option key={t.value} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//           <label className="inline-flex items-center gap-2 text-sm text-gray-700">
//             <input
//               type="checkbox"
//               checked={newQuestion.required}
//               onChange={(e) =>
//                 setNewQuestion((nq) => ({ ...nq, required: e.target.checked }))
//               }
//               className="h-4 w-4"
//             />
//             Required
//           </label>
//           {/* Dynamic fields */}
//           <DynamicFields
//             q={newQuestion}
//             onChange={setNewQuestion}
//             primaryColor="#27235c"
//           />
//           <div className="flex justify-end">
//             <button
//               onClick={handleAddQuestion}
//               className="bg-[#27235c] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1d1a4a] transition"
//             >
//               Add Question
//             </button>
//           </div>
//         </section>
//         {/* Current Questions */}
//         <section className="mt-8">
//           <h2 className="text-xl font-semibold text-[#27235c] mb-4">
//             Current Questions
//           </h2>
//           <DndContext
//             collisionDetection={closestCenter}
//             onDragEnd={handleDragEnd}
//           >
//             <SortableContext
//               items={questions.map((q) => q.id)}
//               strategy={verticalListSortingStrategy}
//             >
//               {questions.length === 0 && (
//                 <p className="text-gray-500 text-sm">No questions added yet.</p>
//               )}
//               <div className="space-y-3">
//                 {questions.map((q) => (
//                   <SortableItem
//                     key={q.id}
//                     id={q.id}
//                     question={q}
//                     onUpdate={onUpdate}
//                     onRemove={handleDelete}
//                     onDuplicate={handleDuplicate}
//                     primaryColor="#27235c"
//                   />
//                 ))}
//               </div>
//             </SortableContext>
//           </DndContext>
//         </section>
//         {/* Launch Survey */}
//         <section className="mt-10 flex justify-end">
//           <button
//             onClick={launchSurvey}
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition"
//           >
//             Launch Survey
//           </button>
//         </section>
//       </main>
//     </div>
//   );
// }
// export default SurveyAddQuestion;
// /* ---------------------------------- */
// /* Dynamic Field Editor for New Qn    */
// /* ---------------------------------- */
// function DynamicFields({ q, onChange, primaryColor = "#27235c" }) {
//   // For choice-like
//   const addOption = () =>
//     onChange({
//       ...q,
//       options: [...(q.options || []), `Option ${q.options.length + 1}`],
//     });
//   const updateOption = (idx, val) => {
//     const next = [...q.options];
//     next[idx] = val;
//     onChange({ ...q, options: next });
//   };
//   const removeOption = (idx) => {
//     const next = [...q.options];
//     next.splice(idx, 1);
//     onChange({ ...q, options: next });
//   };
//   const moveOption = (idx, dir) => {
//     const next = [...q.options];
//     const newIndex = idx + dir;
//     if (newIndex < 0 || newIndex >= next.length) return;
//     const [it] = next.splice(idx, 1);
//     next.splice(newIndex, 0, it);
//     onChange({ ...q, options: next });
//   };
//   // For scale-like
//   const addScaleLabel = () =>
//     onChange({
//       ...q,
//       scaleLabels: [
//         ...(q.scaleLabels || []),
//         `Label ${q.scaleLabels.length + 1}`,
//       ],
//     });
//   const updateScaleLabel = (idx, val) => {
//     const next = [...(q.scaleLabels || [])];
//     next[idx] = val;
//     onChange({ ...q, scaleLabels: next });
//   };
//   const removeScaleLabel = (idx) => {
//     const next = [...(q.scaleLabels || [])];
//     next.splice(idx, 1);
//     onChange({ ...q, scaleLabels: next });
//   };
//   // Matrix columns
//   const addMatrixCol = () =>
//     onChange({
//       ...q,
//       matrixCols: [...(q.matrixCols || []), `Col ${q.matrixCols.length + 1}`],
//     });
//   const updateMatrixCol = (idx, val) => {
//     const next = [...(q.matrixCols || [])];
//     next[idx] = val;
//     onChange({ ...q, matrixCols: next });
//   };
//   const removeMatrixCol = (idx) => {
//     const next = [...(q.matrixCols || [])];
//     next.splice(idx, 1);
//     onChange({ ...q, matrixCols: next });
//   };
//   const labelCls = "block text-sm text-gray-700 mb-1";
//   const inputCls =
//     "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#27235c]";
//   // Switch on type
//   if (q.type === "comment") {
//     return (
//       <div>
//         <p className="text-sm text-gray-600">No additional fields required.</p>
//       </div>
//     );
//   }
//   if (["checkbox", "radio", "dropdown"].includes(q.type)) {
//     return (
//       <div className="space-y-3">
//         <label className={labelCls}>Options</label>
//         {(q.options || []).map((opt, idx) => (
//           <div key={idx} className="flex items-center gap-2">
//             <input
//               type="text"
//               value={opt}
//               onChange={(e) => updateOption(idx, e.target.value)}
//               className={inputCls}
//               placeholder={`Option ${idx + 1}`}
//             />
//             <div className="flex gap-1">
//               <button
//                 className="px-2 py-1 border rounded hover:bg-gray-50"
//                 onClick={() => moveOption(idx, -1)}
//                 title="Move up"
//               >
//                 ↑
//               </button>
//               <button
//                 className="px-2 py-1 border rounded hover:bg-gray-50"
//                 onClick={() => moveOption(idx, 1)}
//                 title="Move down"
//               >
//                 ↓
//               </button>
//               <button
//                 className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
//                 onClick={() => removeOption(idx)}
//                 title="Remove"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
//         ))}
//         <button
//           onClick={addOption}
//           className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
//         >
//           + Add option
//         </button>
//       </div>
//     );
//   }
//   if (["rating", "slider", "star"].includes(q.type)) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className={labelCls}>Scale Min</label>
//           <input
//             type="number"
//             value={q.scaleMin}
//             onChange={(e) =>
//               onChange({ ...q, scaleMin: Number(e.target.value) || 0 })
//             }
//             className={inputCls}
//           />
//         </div>
//         <div>
//           <label className={labelCls}>Scale Max</label>
//           <input
//             type="number"
//             value={q.scaleMax}
//             onChange={(e) =>
//               onChange({ ...q, scaleMax: Number(e.target.value) || 0 })
//             }
//             className={inputCls}
//           />
//         </div>
//         <div className="md:col-span-2">
//           <label className={labelCls}>Scale Labels (optional)</label>
//           {(q.scaleLabels || []).map((lab, idx) => (
//             <div key={idx} className="flex items-center gap-2 mb-2">
//               <input
//                 type="text"
//                 value={lab}
//                 onChange={(e) => updateScaleLabel(idx, e.target.value)}
//                 className={inputCls}
//                 placeholder={`Label ${idx + 1}`}
//               />
//               <button
//                 className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
//                 onClick={() => removeScaleLabel(idx)}
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//           <button
//             onClick={addScaleLabel}
//             className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
//           >
//             + Add label
//           </button>
//         </div>
//       </div>
//     );
//   }
//   if (q.type === "matrix") {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Rows */}
//         <div>
//           <label className={labelCls}>Row labels</label>
//           {(q.options || []).map((opt, idx) => (
//             <div key={idx} className="flex items-center gap-2 mb-2">
//               <input
//                 type="text"
//                 value={opt}
//                 onChange={(e) => {
//                   const next = [...q.options];
//                   next[idx] = e.target.value;
//                   onChange({ ...q, options: next });
//                 }}
//                 className={inputCls}
//                 placeholder={`Row ${idx + 1}`}
//               />
//               <button
//                 className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
//                 onClick={() => {
//                   const next = [...q.options];
//                   next.splice(idx, 1);
//                   onChange({ ...q, options: next });
//                 }}
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//           <button
//             onClick={() =>
//               onChange({
//                 ...q,
//                 options: [...(q.options || []), `Row ${q.options.length + 1}`],
//               })
//             }
//             className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
//           >
//             + Add row
//           </button>
//         </div>
//         {/* Columns */}
//         <div>
//           <label className={labelCls}>Column labels</label>
//           {(q.matrixCols || []).map((c, idx) => (
//             <div key={idx} className="flex items-center gap-2 mb-2">
//               <input
//                 type="text"
//                 value={c}
//                 onChange={(e) => updateMatrixCol(idx, e.target.value)}
//                 className={inputCls}
//                 placeholder={`Column ${idx + 1}`}
//               />
//               <button
//                 className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
//                 onClick={() => removeMatrixCol(idx)}
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//           <button
//             onClick={addMatrixCol}
//             className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
//           >
//             + Add column
//           </button>
//         </div>
//         {/* Optional scale range for matrix (if needed by backend) */}
//         <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className={labelCls}>Scale Min (optional)</label>
//             <input
//               type="number"
//               value={q.scaleMin}
//               onChange={(e) =>
//                 onChange({ ...q, scaleMin: Number(e.target.value) || 0 })
//               }
//               className={inputCls}
//             />
//           </div>
//           <div>
//             <label className={labelCls}>Scale Max (optional)</label>
//             <input
//               type="number"
//               value={q.scaleMax}
//               onChange={(e) =>
//                 onChange({ ...q, scaleMax: Number(e.target.value) || 0 })
//               }
//               className={inputCls}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return null;
// }

// SurveyBuilderPage.jsx
// COMPLETE WORKING VERSION
// ✔ Keeps ALL your original working logic & payload
// ✔ Keeps Sidebar + Previous Questions (Virtuoso)
// ✔ Adds Create Question panel, Advanced Settings, Launch Survey
// ✔ Modern UI, responsive, no focus rings, no lag
// ✔ No toast on empty data, no infinite API calls

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   useDeferredValue,
//   useRef,
// } from "react";

// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   arrayMove,
// } from "@dnd-kit/sortable";

// import {
//   PanelRightOpen,
//   PanelRightClose,
//   Search,
//   Upload,
//   X,
// } from "lucide-react";

// import { Virtuoso } from "react-virtuoso";

// import SortableItem from "./SortableItem";
// import EventFilterBar from "./EventFilterBar";

// import {
//   getAllEventCategoriesMinimal,
//   getEventsByCategoryMinimal,
//   getSurveyQuestionsByEventCategoryId,
//   getSurveyQuestionsByEventAndEventCategoryId,
//   addSurveyQuestionsAndLaunchFeedback,
// } from "../../../services/Services";

// import { decryptSession } from "../../../utils/SessionCrypto";
// import { useToast } from "../../../utils/useToast";

// /* ---------------- helpers ---------------- */
// const unwrap = (res) => (Array.isArray(res?.data) ? res.data : []);

// /* ---------------- page ---------------- */
// export default function SurveyBuilderPage() {
//   const { success, error } = useToast();

//   /* ---------------- filters ---------------- */
//   const [categories, setCategories] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [categoryId, setCategoryId] = useState(null);
//   const [eventId, setEventId] = useState(null);

//   /* ---------------- sidebar ---------------- */
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [previousQuestions, setPreviousQuestions] = useState([]);
//   const [noPrevFound, setNoPrevFound] = useState(false);
//   const [search, setSearch] = useState("");
//   const deferredSearch = useDeferredValue(search);

//   /* ---------------- builder ---------------- */
//   const [questions, setQuestions] = useState([]);

//   /* ---------------- advanced settings (ORIGINAL LOGIC) ---------------- */
//   const [responseMode, setResponseMode] = useState("anonymous");
//   const [themeChoice, setThemeChoice] = useState("default");
//   const [themeFile, setThemeFile] = useState(null);
//   const [thankyouTimeout, setThankyouTimeout] = useState("5");
//   const [idleTimeoutValue, setIdleTimeoutValue] = useState("10");
//   const [idleTimeoutUnit, setIdleTimeoutUnit] = useState("minutes");

//   const surveyOwnerEmail = decryptSession(
//     localStorage.getItem("email")
//   );
//   const eventIdFromSession = decryptSession(
//     localStorage.getItem("selectedEventId")
//   );
//   const masterSocket = "123jhv";

//   /* ---------------- load categories ---------------- */
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getAllEventCategoriesMinimal();
//         const list = unwrap(res);
//         setCategories(list);
//         if (list.length) setCategoryId(list[0].eventCategoryId);
//       } catch {
//         error("Failed to load event categories");
//       }
//     })();
//   }, []);

//   /* ---------------- load events ---------------- */
//   useEffect(() => {
//     if (!categoryId) return;
//     (async () => {
//       try {
//         const res = await getEventsByCategoryMinimal(categoryId);
//         const list = unwrap(res);
//         setEvents(list);
//         setEventId(list[0]?.eventId ?? null);
//       } catch {
//         error("Failed to load events");
//       }
//     })();
//   }, [categoryId]);

//   /* ---------------- load previous questions ---------------- */
//   useEffect(() => {
//     if (!categoryId) return;
//     (async () => {
//       try {
//         const res = eventId
//           ? await getSurveyQuestionsByEventAndEventCategoryId(
//               categoryId,
//               eventId
//             )
//           : await getSurveyQuestionsByEventCategoryId(categoryId);

//         if (res?.success === false) {
//           setPreviousQuestions([]);
//           setNoPrevFound(true);
//           return;
//         }

//         setPreviousQuestions(unwrap(res));
//         setNoPrevFound(false);
//       } catch {
//         error("Failed to load previous questions");
//       }
//     })();
//   }, [categoryId, eventId]);

//   /* ---------------- filter previous ---------------- */
//   const filteredPrevious = useMemo(() => {
//     if (!deferredSearch) return previousQuestions;
//     return previousQuestions.filter((q) =>
//       q.surveyQuestion
//         ?.toLowerCase()
//         .includes(deferredSearch.toLowerCase())
//     );
//   }, [previousQuestions, deferredSearch]);

//   /* ---------------- add from sidebar ---------------- */
//   const addPreviousQuestion = useCallback(
//     (pq) => {
//       if (
//         questions.some(
//           (q) => q.text.trim() === pq.surveyQuestion.trim()
//         )
//       ) {
//         error("Question already added");
//         return;
//       }

//       setQuestions((prev) => [
//         ...prev,
//         {
//           id: `${pq.surveyQuestionId}-${prev.length + 1}`,
//           text: pq.surveyQuestion,
//           type: pq.surveyQuestionType,
//           options: pq.surveyCheckBoxOptions || [],
//           scaleMin: pq.scaleMin ?? 1,
//           scaleMax: pq.scaleMax ?? 5,
//           scaleLabels: pq.scaleLabels || [],
//           matrixRows: pq.matrixQnLabels || [],
//           required: !!pq.required,
//           displayOrder: prev.length + 1,
//         },
//       ]);

//       success("Question added");
//       setShowSidebar(false);
//     },
//     [questions]
//   );

//   /* ---------------- DnD ---------------- */
//   const onDragEnd = ({ active, over }) => {
//     if (!over || active.id === over.id) return;
//     setQuestions((prev) =>
//       arrayMove(
//         prev,
//         prev.findIndex((q) => q.id === active.id),
//         prev.findIndex((q) => q.id === over.id)
//       ).map((q, i) => ({ ...q, displayOrder: i + 1 }))
//     );
//   };

//   const onUpdate = (id, changes) =>
//     setQuestions((prev) =>
//       prev.map((q) => (q.id === id ? { ...q, ...changes } : q))
//     );

//   const onDelete = (id) =>
//     setQuestions((prev) =>
//       prev
//         .filter((q) => q.id !== id)
//         .map((q, i) => ({ ...q, displayOrder: i + 1 }))
//     );

//   /* ---------------- launch survey (ORIGINAL PAYLOAD) ---------------- */
//   const launchSurvey = async () => {
//     if (!questions.length) {
//       error("Add at least one question");
//       return;
//     }

//     const apiQuestions = questions.map((q, idx) => ({
//       surveyQuestion: q.text,
//       surveyQuestionType: q.type,
//       surveyCheckBoxOptions: q.options || [],
//       scaleMin: q.scaleMin,
//       scaleMax: q.scaleMax,
//       scaleLabels: q.scaleLabels || [],
//       matrixQnLabels: q.matrixRows || [],
//       required: !!q.required,
//       displayOrder: idx + 1,
//     }));

//     const formData = new FormData();
//     formData.append("eventId", eventIdFromSession);
//     formData.append("surveyOwnerEmail", surveyOwnerEmail || "");
//     formData.append("masterSocket", masterSocket);
//     formData.append(
//       "isAnonymousSurvey",
//       responseMode === "anonymous"
//     );
//     formData.append("thankyouTimeout", thankyouTimeout);
//     formData.append("idleTimeoutValue", idleTimeoutValue);
//     formData.append("idleTimeoutUnit", idleTimeoutUnit);
//     formData.append("questions", JSON.stringify(apiQuestions));

//     if (themeChoice === "custom" && themeFile) {
//       formData.append("backgroundTheme", themeFile);
//     }

//     try {
//       await addSurveyQuestionsAndLaunchFeedback(formData);
//       success("Survey launched successfully");
//     } catch {
//       error("Failed to launch survey");
//     }
//   };

//   /* ---------------- render ---------------- */
//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* MOBILE SIDEBAR */}
//       {showSidebar && (
//         <div className="fixed inset-0 z-40 bg-white flex flex-col md:hidden">
//           <div className="p-4 border-b flex justify-between">
//             <h2 className="font-semibold">Previous Questions</h2>
//             <button onClick={() => setShowSidebar(false)}>
//               <X />
//             </button>
//           </div>
//           <Sidebar />
//         </div>
//       )}

//       {/* DESKTOP SIDEBAR */}
//       <aside className="hidden md:flex w-96 bg-white border-r flex-col">
//         <Sidebar />
//       </aside>

//       {/* MAIN */}
//       <main className="flex-1 p-6 overflow-y-auto">
//         <header className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-[#27235c]">
//             Survey Builder
//           </h1>
//           <button
//             className="md:hidden bg-[#27235c] text-white px-3 py-2 rounded-lg"
//             onClick={() => setShowSidebar(true)}
//           >
//             Browse Questions
//           </button>
//         </header>

//         {/* CREATE QUESTION + ADVANCED SETTINGS */}
//         <section className="bg-white rounded-xl shadow p-6 mb-6">
//           <h2 className="font-semibold mb-2">Advanced Settings</h2>

//           <div className="grid md:grid-cols-3 gap-4">
//             <div>
//               <label className="text-sm">Response Mode</label>
//               <select
//                 className="w-full border rounded p-2 focus:ring-0"
//                 value={responseMode}
//                 onChange={(e) => setResponseMode(e.target.value)}
//               >
//                 <option value="anonymous">Anonymous</option>
//                 <option value="email">Email based</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-sm">Thank you timeout</label>
//               <input
//                 className="w-full border rounded p-2 focus:ring-0"
//                 value={thankyouTimeout}
//                 onChange={(e) =>
//                   setThankyouTimeout(e.target.value)
//                 }
//               />
//             </div>

//             <div>
//               <label className="text-sm">Idle timeout</label>
//               <div className="flex gap-2">
//                 <input
//                   className="flex-1 border rounded p-2 focus:ring-0"
//                   value={idleTimeoutValue}
//                   onChange={(e) =>
//                     setIdleTimeoutValue(e.target.value)
//                   }
//                 />
//                 <select
//                   className="border rounded p-2 focus:ring-0"
//                   value={idleTimeoutUnit}
//                   onChange={(e) =>
//                     setIdleTimeoutUnit(e.target.value)
//                   }
//                 >
//                   <option value="minutes">Minutes</option>
//                   <option value="hours">Hours</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* QUESTIONS */}
//         <DndContext
//           collisionDetection={closestCenter}
//           onDragEnd={onDragEnd}
//         >
//           <SortableContext
//             items={questions.map((q) => q.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {questions.map((q) => (
//               <SortableItem
//                 key={q.id}
//                 id={q.id}
//                 question={q}
//                 onUpdate={onUpdate}
//                 onDelete={onDelete}
//               />
//             ))}
//           </SortableContext>
//         </DndContext>
//         {/* LAUNCH */}
//         <div className="mt-8 flex justify-end">
//           <button
//             onClick={launchSurvey}
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
//           >
//             Launch Survey
//           </button>
//         </div>
//       </main>
//     </div>
//   );

//   /* ---------------- sidebar component ---------------- */
//   function Sidebar() {
//     return (
//       <>
//         <EventFilterBar
//           categories={categories}
//           events={events}
//           categoryId={categoryId}
//           eventId={eventId}
//           onCategoryChange={setCategoryId}
//           onEventChange={setEventId}
//         />

//         <div className="p-3 relative">
//           <Search
//             size={16}
//             className="absolute left-5 top-5 text-gray-400"
//           />
//           <input
//             className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-0"
//             placeholder="Search questions..."
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {noPrevFound ? (
//           <div className="p-6 text-center text-gray-500">
//             No questions found for this event
//           </div>
//         ) : (
//           <Virtuoso
//             data={filteredPrevious}
//             itemContent={(i, q) => (
//               <div
//                 onClick={() => addPreviousQuestion(q)}
//                 className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition"
//               >
//                 <p className="text-sm font-medium">
//                   {q.surveyQuestion}
//                 </p>
//                 <span className="text-xs text-blue-600">
//                   {q.surveyQuestionType}
//                 </span>
//               </div>
//             )}
//           />
//         )}
//       </>
//     );
//   }
// }

// import React, {
//   useEffect,
//   useMemo,
//   useState,
//   useDeferredValue,
// } from "react";

// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";

// import {
//   PanelRightOpen,
//   PanelRightClose,
//   Upload,
//   Trash2,
//   FileVideo2,
// } from "lucide-react";

// import { Virtuoso } from "react-virtuoso";

// import SortableItem from "./SortableItem";
// import EventFilterBar from "./EventFilterBar";

// import {
//   getAllEventCategoriesMinimal,
//   getEventsByCategoryMinimal,
//   getSurveyQuestionsByEventCategoryId,
//   getSurveyQuestionsByEventAndEventCategoryId,
//   addSurveyQuestionsAndLaunchFeedback,
// } from "../../../services/Services";

// import { decryptSession } from "../../../utils/SessionCrypto";
// import { useToast } from "../../../utils/useToast";

// /* ---------------- helpers ---------------- */
// const normalize = (s = "") =>
//   s.toLowerCase().replace(/\s+/g, "");

// /* ===================================================== */
// /* ================= SURVEY BUILDER ==================== */
// /* ===================================================== */

// export default function SurveyBuilderPage() {
//   const { success, error } = useToast();

//   /* ---------- filters ---------- */
//   const [categories, setCategories] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [categoryId, setCategoryId] = useState(null);
//   const [eventId, setEventId] = useState(null);

//   /* ---------- sidebar ---------- */
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [previousQuestions, setPreviousQuestions] = useState([]);
//   const [search, setSearch] = useState("");
//   const deferredSearch = useDeferredValue(search);

//   /* ---------- builder ---------- */
//   const [questions, setQuestions] = useState([]);

//   /* ---------- new question ---------- */
//   const [newQuestion, setNewQuestion] = useState({
//     text: "",
//     type: "comment",
//     options: [],
//     scaleMin: 1,
//     scaleMax: 5,
//     scaleLabels: [],
//     matrixRows: [],
//     required: false,
//   });

//   /* ---------- advanced settings ---------- */
//   const [themeChoice, setThemeChoice] = useState("default");
//   const [themeFile, setThemeFile] = useState(null);

//   const [responseMode, setResponseMode] = useState("anonymous");
//   const [emailMode, setEmailMode] = useState("external");

//   const [thankyouTimeout, setThankyouTimeout] = useState("5");
//   const [idleTimeoutValue, setIdleTimeoutValue] = useState("10");
//   const [idleTimeoutUnit, setIdleTimeoutUnit] = useState("minutes");

//   const eventIdFromSession = decryptSession(
//     localStorage.getItem("selectedEventId")
//   );
//   const surveyOwnerEmail = decryptSession(
//     localStorage.getItem("email")
//   );
//   const masterSocket = "123jhv";

//   /* ===================================================== */
//   /* ===================== LOADERS ======================= */
//   /* ===================================================== */

//   useEffect(() => {
//     (async () => {
//       const res = await getAllEventCategoriesMinimal();
//       const list = Array.isArray(res?.data) ? res.data : [];
//       setCategories(list);
//       if (list.length) setCategoryId(list[0].eventCategoryId);
//     })();
//   }, []);

//   useEffect(() => {
//     if (!categoryId) return;
//     (async () => {
//       const res = await getEventsByCategoryMinimal(categoryId);
//       const list = Array.isArray(res?.data) ? res.data : [];
//       setEvents(list);
//       setEventId(list[0]?.eventId ?? null);
//     })();
//   }, [categoryId]);

//   useEffect(() => {
//     if (!categoryId) return;
//     (async () => {
//       const res = eventId
//         ? await getSurveyQuestionsByEventAndEventCategoryId(
//             categoryId,
//             eventId
//           )
//         : await getSurveyQuestionsByEventCategoryId(categoryId);

//       if (res?.success === false) {
//         setPreviousQuestions([]);
//         return;
//       }

//       setPreviousQuestions(Array.isArray(res?.data) ? res.data : []);
//     })();
//   }, [categoryId, eventId]);

//   /* ===================================================== */
//   /* =================== DERIVED ========================= */
//   /* ===================================================== */

//   const filteredPrevious = useMemo(() => {
//     if (!deferredSearch) return previousQuestions;
//     return previousQuestions.filter((q) =>
//       q.surveyQuestion
//         ?.toLowerCase()
//         .includes(deferredSearch.toLowerCase())
//     );
//   }, [previousQuestions, deferredSearch]);

//   /* ===================================================== */
//   /* ================== SIDEBAR ADD ====================== */
//   /* ===================================================== */

//   const addPreviousQuestion = (pq) => {
//     const exists = questions.some(
//       (q) => normalize(q.text) === normalize(pq.surveyQuestion)
//     );
//     if (exists) {
//       error("Question already added");
//       return;
//     }

//     setQuestions((prev) => [
//       ...prev,
//       {
//         id: `${pq.surveyQuestionId}-${prev.length + 1}`,
//         text: pq.surveyQuestion,
//         type: pq.surveyQuestionType,
//         options:
//           ["checkbox", "radio", "dropdown"].includes(
//             pq.surveyQuestionType
//           )
//             ? pq.surveyCheckBoxOptions || []
//             : [],
//         scaleMin: pq.scaleMin ?? 1,
//         scaleMax: pq.scaleMax ?? 5,
//         scaleLabels: pq.scaleLabels || [],
//         matrixRows: pq.matrixQnLabels || [],
//         required: !!pq.required,
//         displayOrder: prev.length + 1,
//       },
//     ]);

//     success("Question added");
//     setShowSidebar(false);
//   };

//   /* ===================================================== */
//   /* ================== ADD NEW QUESTION ================= */
//   /* ===================================================== */

//   const handleAddQuestion = () => {
//     if (!newQuestion.text.trim()) {
//       error("Question text is required");
//       return;
//     }

//     if (
//       questions.some(
//         (q) =>
//           normalize(q.text) === normalize(newQuestion.text)
//       )
//     ) {
//       error("Question already exists");
//       return;
//     }

//     if (
//       ["checkbox", "radio", "dropdown"].includes(
//         newQuestion.type
//       ) &&
//       newQuestion.options.length === 0
//     ) {
//       error("Add at least one option");
//       return;
//     }

//     if (
//       ["rating", "slider", "star"].includes(
//         newQuestion.type
//       ) &&
//       Number(newQuestion.scaleMin) >=
//         Number(newQuestion.scaleMax)
//     ) {
//       error("Scale min must be less than max");
//       return;
//     }

//     if (
//       newQuestion.type === "matrix" &&
//       newQuestion.matrixRows.length === 0
//     ) {
//       error("Matrix requires rows");
//       return;
//     }

//     setQuestions((prev) => [
//       ...prev,
//       {
//         ...newQuestion,
//         id: `new-${prev.length + 1}`,
//         displayOrder: prev.length + 1,
//       },
//     ]);

//     success("Question added");

//     setNewQuestion({
//       text: "",
//       type: "comment",
//       options: [],
//       scaleMin: 1,
//       scaleMax: 5,
//       scaleLabels: [],
//       matrixRows: [],
//       required: false,
//     });
//   };

//   /* ===================================================== */
//   /* ====================== DND ========================== */
//   /* ===================================================== */

//   const onDragEnd = ({ active, over }) => {
//     if (!over || active.id === over.id) return;
//     setQuestions((prev) =>
//       arrayMove(
//         prev,
//         prev.findIndex((q) => q.id === active.id),
//         prev.findIndex((q) => q.id === over.id)
//       ).map((q, i) => ({ ...q, displayOrder: i + 1 }))
//     );
//   };

//   /* ===================================================== */
//   /* ===================== SUBMIT ======================== */
//   /* ===================================================== */

//   const launchSurvey = async () => {
//     const thankyou = Math.min(
//       30,
//       Math.max(0, Number(thankyouTimeout))
//     );

//     const idle = Number(idleTimeoutValue);
//     if (
//       (idleTimeoutUnit === "minutes" && idle < 10) ||
//       (idleTimeoutUnit === "hours" && idle < 1)
//     ) {
//       error("Invalid idle timeout");
//       return;
//     }

//     const apiQuestions = questions.map((q, idx) => ({
//       surveyQuestion: q.text,
//       surveyQuestionType: q.type,
//       surveyCheckBoxOptions: q.options || [],
//       scaleMin: q.scaleMin,
//       scaleMax: q.scaleMax,
//       scaleLabels: q.scaleLabels || [],
//       matrixQnLabels: q.matrixRows || [],
//       required: !!q.required,
//       displayOrder: idx + 1,
//     }));

//     const formData = new FormData();
//     formData.append("eventId", eventIdFromSession);
//     formData.append("surveyOwnerEmail", surveyOwnerEmail);
//     formData.append("masterSocket", masterSocket);
//     formData.append(
//       "isAnonymousSurvey",
//       responseMode === "anonymous"
//     );
//     formData.append("emailMode", emailMode);
//     formData.append("thankyouTimeout", thankyou);
//     formData.append("idleTimeoutValue", idle);
//     formData.append("idleTimeoutUnit", idleTimeoutUnit);
//     formData.append("questions", JSON.stringify(apiQuestions));

//     if (themeChoice === "custom" && themeFile) {
//       formData.append("backgroundTheme", themeFile);
//     }

//     await addSurveyQuestionsAndLaunchFeedback(formData);
//     success("Survey launched");
//   };

//   /* ===================================================== */
//   /* ===================== RENDER ======================== */
//   /* ===================================================== */

//   return (
//     <div className="flex min-h-screen bg-gray-100 overflow-hidden">
//       {/* ================= SIDEBAR ================= */}
//       <aside className="hidden md:flex w-96 bg-white border-r flex-col">
//         <Sidebar />
//       </aside>

//       {showSidebar && (
//         <div className="fixed inset-0 z-40 bg-white md:hidden">
//           <div className="p-3 border-b flex justify-between">
//             <h2 className="font-semibold">Previous Questions</h2>
//             <button onClick={() => setShowSidebar(false)}>
//               <PanelRightClose />
//             </button>
//           </div>
//           <Sidebar />
//         </div>
//       )}

//       {/* ================= MAIN ================= */}
//       <main className="flex-1 p-6 overflow-y-auto space-y-8">
//         <header className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-[#27235c]">
//             Survey Builder
//           </h1>
//           <button
//             onClick={() => setShowSidebar(true)}
//             className="md:hidden bg-[#27235c] text-white px-3 py-2 rounded-lg"
//           >
//             Browse Questions
//           </button>
//         </header>

//         {/* ================= SETTINGS & CONFIG ================= */}
// <section className="bg-white p-6 rounded-xl shadow space-y-6">
//   <h2 className="text-lg font-semibold text-[#27235c]">
//     Survey Settings
//   </h2>

//   {/* ---------- Response Mode ---------- */}
//   <div>
//     <p className="text-sm font-medium mb-2">Response Mode</p>
//     <div className="flex gap-4">
//       <button
//         onClick={() => setResponseMode("anonymous")}
//         className={`px-4 py-2 rounded-lg border transition ${
//           responseMode === "anonymous"
//             ? "bg-[#27235c] text-white"
//             : "bg-white text-gray-700"
//         }`}
//       >
//         Anonymous
//       </button>

//       <button
//         onClick={() => setResponseMode("email")}
//         className={`px-4 py-2 rounded-lg border transition ${
//           responseMode === "email"
//             ? "bg-[#27235c] text-white"
//             : "bg-white text-gray-700"
//         }`}
//       >
//         Email Based
//       </button>
//     </div>

//     {responseMode === "email" && (
//       <div className="mt-3 flex gap-3">
//         <label className="flex items-center gap-2 text-sm">
//           <input
//             type="radio"
//             checked={emailMode === "external"}
//             onChange={() => setEmailMode("external")}
//           />
//           External
//         </label>
//         <label className="flex items-center gap-2 text-sm">
//           <input
//             type="radio"
//             checked={emailMode === "internal"}
//             onChange={() => setEmailMode("internal")}
//           />
//           Internal
//         </label>
//       </div>
//     )}
//   </div>

//   {/* ---------- Background Theme ---------- */}
//   <div>
//     <p className="text-sm font-medium mb-2">Background Theme</p>

//     <div className="flex gap-4">
//       <button
//         onClick={() => {
//           setThemeChoice("default");
//           setThemeFile(null);
//         }}
//         className={`px-4 py-2 rounded-lg border ${
//           themeChoice === "default"
//             ? "bg-[#27235c] text-white"
//             : "bg-white"
//         }`}
//       >
//         Default Theme
//       </button>

//       <button
//         onClick={() => setThemeChoice("custom")}
//         className={`px-4 py-2 rounded-lg border ${
//           themeChoice === "custom"
//             ? "bg-[#27235c] text-white"
//             : "bg-white"
//         }`}
//       >
//         Custom Theme
//       </button>
//     </div>

//     {themeChoice === "custom" && (
//       <div className="mt-3">
//         <label className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
//           <div className="flex items-center gap-2">
//             <Upload size={18} />
//             <span className="text-sm">
//               {themeFile ? themeFile.name : "Upload GIF / MP4"}
//             </span>
//           </div>
//           <FileVideo2 size={18} />
//           <input
//             type="file"
//             accept="image/gif,video/mp4"
//             className="hidden"
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (!file) return;

//               if (
//                 !["image/gif", "video/mp4"].includes(file.type)
//               ) {
//                 error("Only GIF or MP4 allowed");
//                 return;
//               }
//               if (file.size > 50 * 1024 * 1024) {
//                 error("Max size is 50MB");
//                 return;
//               }
//               setThemeFile(file);
//             }}
//           />
//         </label>

//         {themeFile && (
//           <button
//             className="mt-2 text-sm text-red-600 flex items-center gap-1"
//             onClick={() => setThemeFile(null)}
//           >
//             <Trash2 size={14} /> Remove file
//           </button>
//         )}
//       </div>
//     )}
//   </div>

//   {/* ---------- Timeouts ---------- */}
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     <div>
//       <label className="block text-sm mb-1">
//         Thank You Screen Timeout (0–30 sec)
//       </label>
//       <input
//         type="text"
//         value={thankyouTimeout}
//         onChange={(e) =>
//           setThankyouTimeout(e.target.value.replace(/\D/g, ""))
//         }
//         onBlur={() =>
//           setThankyouTimeout((v) =>
//             Math.min(30, Math.max(0, Number(v))).toString()
//           )
//         }
//         className="w-full border rounded-lg px-3 py-2 focus:outline-none"
//       />
//     </div>

//     <div>
//       <label className="block text-sm mb-1">
//         Idle Timeout
//       </label>
//       <div className="flex gap-3">
//         <input
//           type="text"
//           value={idleTimeoutValue}
//           onChange={(e) =>
//             setIdleTimeoutValue(e.target.value.replace(/\D/g, ""))
//           }
//           onBlur={() => {
//             const min =
//               idleTimeoutUnit === "minutes" ? 10 : 1;
//             if (Number(idleTimeoutValue) < min) {
//               error(
//                 `Minimum ${
//                   idleTimeoutUnit === "minutes"
//                     ? "10 minutes"
//                     : "1 hour"
//                 }`
//               );
//               setIdleTimeoutValue(min.toString());
//             }
//           }}
//           className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
//         />

//         <select
//           value={idleTimeoutUnit}
//           onChange={(e) =>
//             setIdleTimeoutUnit(e.target.value)
//           }
//           className="border rounded-lg px-3 py-2 focus:outline-none"
//         >
//           <option value="minutes">Minutes</option>
//           <option value="hours">Hours</option>
//         </select>
//       </div>
//     </div>
//   </div>
// </section>

//         {/* ================= CREATE QUESTION ================= */}
//         <section className="bg-white p-6 rounded-lg shadow">
//           <h2 className="font-semibold mb-4">
//             Create New Question
//           </h2>

//           <input
//             className="w-full border rounded-lg px-3 py-2 focus:outline-none"
//             placeholder="Question text"
//             value={newQuestion.text}
//             onChange={(e) =>
//               setNewQuestion({
//                 ...newQuestion,
//                 text: e.target.value,
//               })
//             }
//           />

//           <select
//             className="w-full mt-3 border rounded-lg px-3 py-2 focus:outline-none"
//             value={newQuestion.type}
//             onChange={(e) =>
//               setNewQuestion({
//                 ...newQuestion,
//                 type: e.target.value,
//                 options: [],
//                 scaleLabels: [],
//                 matrixRows: [],
//               })
//             }
//           >
//             <option value="comment">Comment</option>
//             <option value="checkbox">Checkbox</option>
//             <option value="radio">Radio</option>
//             <option value="dropdown">Dropdown</option>
//             <option value="rating">Rating</option>
//             <option value="slider">Slider</option>
//             <option value="star">Star</option>
//             <option value="matrix">Matrix</option>
//           </select>

//           <div className="mt-4">
//             <SortableItem
//               id="new"
//               question={newQuestion}
//               onUpdate={(_, ch) =>
//                 setNewQuestion((q) => ({ ...q, ...ch }))
//               }
//               hideDrag
//               hideDelete
//             />
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               onClick={handleAddQuestion}
//               className="bg-[#27235c] text-white px-4 py-2 rounded-lg"
//             >
//               Add Question
//             </button>
//           </div>
//         </section>

//         {/* ================= QUESTIONS LIST ================= */}
//         <DndContext
//           collisionDetection={closestCenter}
//           onDragEnd={onDragEnd}
//         >
//           <SortableContext
//             items={questions.map((q) => q.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {questions.map((q) => (
//               <SortableItem
//                 key={q.id}
//                 id={q.id}
//                 question={q}
//                 onUpdate={(id, ch) =>
//                   setQuestions((prev) =>
//                     prev.map((qq) =>
//                       qq.id === id ? { ...qq, ...ch } : qq
//                     )
//                   )
//                 }
//                 onDelete={(id) =>
//                   setQuestions((prev) =>
//                     prev.filter((qq) => qq.id !== id)
//                   )
//                 }
//               />
//             ))}
//           </SortableContext>
//         </DndContext>

//         {/* ================= LAUNCH ================= */}
//         <div className="flex justify-end">
//           <button
//             onClick={launchSurvey}
//             className="bg-green-600 text-white px-6 py-2 rounded-lg"
//           >
//             Launch Survey
//           </button>
//         </div>
//       </main>
//     </div>
//   );

//   /* ================= SIDEBAR CONTENT ================= */
//   function Sidebar() {
//     return (
//       <>
//         <EventFilterBar
//           categories={categories}
//           events={events}
//           categoryId={categoryId}
//           eventId={eventId}
//           onCategoryChange={setCategoryId}
//           onEventChange={setEventId}
//         />

//         <input
//           className="m-3 p-2 border rounded-lg focus:outline-none"
//           placeholder="Search questions..."
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         {filteredPrevious.length === 0 ? (
//           <p className="p-4 text-sm text-gray-500">
//             No questions found
//           </p>
//         ) : (
//           <Virtuoso
//             data={filteredPrevious}
//             itemContent={(i, q) => (
//               <div
//                 onClick={() => addPreviousQuestion(q)}
//                 className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50"
//               >
//                 <p className="text-sm font-medium">
//                   {q.surveyQuestion}
//                 </p>
//                 <span className="text-xs text-blue-600">
//                   {q.surveyQuestionType}
//                 </span>
//               </div>
//             )}
//           />
//         )}
//       </>
//     );
//   }
// }

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useDeferredValue,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  PanelRightOpen,
  PanelRightClose,
  Upload,
  Trash2,
  X,
  Plus,
  XIcon,
} from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import SortableItem from "./SortableItem";
import EventFilterBar from "./EventFilterBar";
import {
  getAllEventCategoriesMinimal,
  getEventsByCategoryMinimal,
  getSurveyQuestionsByEventCategoryId,
  getSurveyQuestionsByEventAndEventCategoryId,
  addSurveyQuestionsAndLaunchFeedback,
} from "../../../services/Services";
import { decryptSession } from "../../../utils/SessionCrypto";
import { useToast } from "../../../utils/useToast";
import { SearchX, ChevronDown, ChevronUp, Check } from "lucide-react";
import SurveyLivePreview from "../SurveyPreview/SurveyLivePreview";
import ThemePreviewModalSurvey from "./ThemePreviewModalSurvey";
import { Settings, FilePlus2, ListChecks, History } from "lucide-react";
import SurveyButtonLoader from "../../../utils/SurveyButtonLoader";

/* ---------- helpers ---------- */

/* ===================================================== */
/* ================= SURVEY BUILDER PAGE =============== */
/* ===================================================== */
export default function SurveyBuilderPage() {
  const { success, error } = useToast();
  const thankRef = useRef(null);
  const idleValRef = useRef(null);

  const [savingTimeouts, setSavingTimeouts] = useState(false);

  const handleTimeoutSave = async () => {
    const ty = Math.min(30, Math.max(0, Number(thankyouTimeout || "0")));
    if (!Number.isFinite(ty) || String(ty) !== thankyouTimeout) {
      error("Thankyou timeout must be between 0–30 seconds.");
      thankRef.current?.focus?.();
      return;
    }
    const idleNum = Number(idleTimeoutValue || "0");
    const min = idleTimeoutUnit === "hours" ? 1 : 10;
    if (!Number.isFinite(idleNum) || idleNum < min) {
      error(`Idle Timeout must be at least ${min} ${idleTimeoutUnit}.`);
      idleValRef.current?.focus?.();
      return;
    }
    setSavingTimeouts(true);
    // (Optionally persist to backend if you add an endpoint later)
    setTimeout(() => {
      setSavingTimeouts(false);
      setIsEditingTimeouts(false);
    }, 400);
  };

  // Robust text normalization for dedupe
  const normalize = (s = "") => s.toLowerCase().replace(/\s+/g, " ").trim();

  const uniqueTrimmed = (arr = []) => {
    const seen = new Set();
    return arr
      .map((x) => (typeof x === "string" ? x.trim() : ""))
      .filter((x) => {
        if (!x) return false;
        const k = x.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
  };

  const [loadingCategroies, setLoadingCategories] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingPrev, setLoadingPrev] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [emailMode, setEmailMode] = useState("external");
  const [isEditingTimeouts, setIsEditingTimeouts] = useState(false);
  const [selectedPrev, setSelectedPrev] = useState(new Set());
  const [showThemePreview, setShowThemePreview] = useState(false);

  const sessionCategoryId = Number(
    decryptSession(localStorage.getItem("eventCategoryId")),
  );
  const sessionEventId = Number(
    decryptSession(localStorage.getItem("selectedEventId")),
  );
  const surveyOwnerEmail = decryptSession(localStorage.getItem("email"));
  const masterSocket =
    decryptSession(localStorage.getItem("masterSocket")) || "123jhv";

  /* ---------- Filters (left sidebar) ---------- */
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [categoryId, setCategoryId] = useState(sessionCategoryId || null);
  const [eventId, setEventId] = useState(sessionEventId || null);

  /* ---------- Previous questions sidebar ---------- */
  const [showSidebar, setShowSidebar] = useState(true);
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  /* ---------- Builder state ---------- */
  const [questions, setQuestions] = useState([]);

  /* ---------- Survey settings (functionality unchanged) ---------- */
  const [responseMode, setResponseMode] = useState("anonymous"); // anonymous | email
  const [themeChoice, setThemeChoice] = useState("default"); // default | custom
  const [themeFile, setThemeFile] = useState(null); // file only, no JSON
  const [thankyouTimeout, setThankyouTimeout] = useState("5"); // 0–30 sec
  const [idleTimeoutValue, setIdleTimeoutValue] = useState("10"); // ≥10 min or ≥1 hr
  const [idleTimeoutUnit, setIdleTimeoutUnit] = useState("minutes"); // minutes | hours
  const [showPreview, setShowPreview] = useState(false);
  const [prevViewMode, setPrevViewMode] = useState(
    sessionEventId ? "event" : "all",
  );

  /* ---------- New Question editor ---------- */
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "comment",
    options: [],
    matrixRows: [],
    scaleLabels: [],
    scaleMin: 1,
    scaleMax: 5,
    required: false,
  });

  /* ===================================================== */
  /* ===================== LOADERS ======================= */
  /* ===================================================== */
  useEffect(() => {
    (async () => {
      setLoadingCategories(true);
      try {
        const res = await getAllEventCategoriesMinimal();
        const list = Array.isArray(res?.data) ? res.data : [];
        setCategories(list);
        if (!categoryId && list.length) setCategoryId(list[0].eventCategoryId);
      } catch (err) {
        console.log(err);
        return;
      } finally {
        setLoadingCategories(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    (async () => {
      setLoadingEvents(true);
      try {
        const res = await getEventsByCategoryMinimal(categoryId);
        const list = Array.isArray(res?.data) ? res.data : [];
        setEvents(list);
      } catch {
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;
    setLoadingPrev(true);
    const api = eventId
      ? getSurveyQuestionsByEventAndEventCategoryId(categoryId, eventId)
      : getSurveyQuestionsByEventCategoryId(categoryId); // All Events => category-level

    api
      .then((res) => {
        if (res?.success === false) {
          setPreviousQuestions([]);
          return;
        }
        setPreviousQuestions(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => setPreviousQuestions([]))
      .finally(() => setLoadingPrev(false));
  }, [categoryId, eventId]);

  /* ===================================================== */
  /* =================== DERIVED ========================= */
  /* ===================================================== */

  const filteredPrevious = useMemo(() => {
    const list = Array.isArray(previousQuestions) ? previousQuestions : [];
    const needle = (search || "").toLowerCase().trim();
    if (!needle) return list;
    return list.filter((q) =>
      (q.surveyQuestion || "").toLowerCase().includes(needle),
    );
  }, [previousQuestions, search]);

  /* ===================================================== */
  /* =============== ADD FROM SIDEBAR ==================== */
  /* ===================================================== */

  const addPreviousQuestion = useCallback(
    (pq) => {
      const exists = questions.some(
        (q) =>
          normalize(q.text) === normalize(pq.surveyQuestion) &&
          q.type === pq.surveyQuestionType,
      );
      if (exists) {
        error("Same question with same type already added.");
        return;
      }
      setQuestions((prev) => [
        ...prev,
        {
          id: `${pq.surveyQuestionId || Date.now()}-${prev.length + 1}`,
          text: pq.surveyQuestion,
          type: pq.surveyQuestionType,
          options: ["checkbox", "radio", "dropdown"].includes(
            pq.surveyQuestionType,
          )
            ? uniqueTrimmed(pq.surveyCheckBoxOptions || [])
            : [],
          matrixRows: uniqueTrimmed(pq.matrixQnLabels || []),
          scaleLabels: uniqueTrimmed(pq.scaleLabels || []),
          scaleMin:
            ["rating", "slider", "star", "matrix"].includes(
              pq.surveyQuestionType,
            ) && typeof pq.scaleMin === "number"
              ? pq.scaleMin
              : 1,
          scaleMax:
            ["rating", "slider", "star", "matrix"].includes(
              pq.surveyQuestionType,
            ) && typeof pq.scaleMax === "number"
              ? pq.scaleMax
              : 5,
          required: !!pq.required,
          displayOrder: prev.length + 1,
        },
      ]);
      success("Question added from previous list.");
      // DO NOT close sidebar here; only via the close icon
    },
    [questions, error, success],
  );

  const nextUniqueText = (base, list, type, selfId = null) => {
    const exists = (txt) =>
      list.some(
        (q) =>
          (selfId ? q.id !== selfId : true) &&
          normalize(q.text) === normalize(txt) &&
          q.type === type,
      );
    if (!exists(base)) return base;
    let i = 1;
    while (exists(`${base} (${i})`)) i++;
    return `${base} (${i})`;
  };

  /* ===================================================== */
  /* ================== NEW QUESTION ===================== */
  /* ===================================================== */

  const addNewQuestion = () => {
    const text = newQuestion.text.trim();
    if (!text) {
      error("Question text is required.");
      return;
    }

    // Prevent duplicates: same normalized text + same type
    const isDup = questions.some(
      (q) =>
        normalize(q.text) === normalize(text) && q.type === newQuestion.type,
    );
    if (isDup) {
      error("Same question with same type already exists.");
      return;
    }

    // Sanitize lists
    let options = uniqueTrimmed(newQuestion.options);
    let matrixRows = uniqueTrimmed(newQuestion.matrixRows);
    let scaleLabels = uniqueTrimmed(newQuestion.scaleLabels);

    if (["checkbox", "radio", "dropdown"].includes(newQuestion.type)) {
      if (!options.length) {
        error("Add at least one non-empty option.");
        return;
      }
    }

    if (newQuestion.type === "matrix") {
      if (!matrixRows.length || !scaleLabels.length) {
        error("Matrix needs at least one Row and one Column.");
        return;
      }
    }

    // Scale guard
    let scaleMin = 1;
    let scaleMax =
      newQuestion.type === "matrix" && scaleLabels.length > 0
        ? scaleLabels.length
        : 5;

    if (["rating", "slider", "star"].includes(newQuestion.type)) {
      scaleMin = Number(newQuestion.scaleMin) || 1;
      scaleMax = Number(newQuestion.scaleMax) || 5;
      if (scaleMin >= scaleMax) {
        error("Scale min must be less than max.");
        return;
      }
    }

    setQuestions((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        text,
        type: newQuestion.type,
        options,
        matrixRows,
        scaleLabels,
        scaleMin,
        scaleMax,
        required: !!newQuestion.required,
        displayOrder: prev.length + 1,
      },
    ]);

    setNewQuestion({
      text: "",
      type: "comment",
      options: [],
      matrixRows: [],
      scaleLabels: [],
      scaleMin: 1,
      scaleMax: 5,
      required: false,
    });

    success("Question added.");
  };

  /* ===================================================== */
  /* ====================== DnD ========================== */
  /* ===================================================== */
  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setQuestions((prev) =>
      arrayMove(
        prev,
        prev.findIndex((q) => q.id === active.id),
        prev.findIndex((q) => q.id === over.id),
      ).map((q, i) => ({ ...q, displayOrder: i + 1 })),
    );
  };

  const validateQuestionsBeforeSubmit = () => {
    for (const q of questions) {
      const text = (q.text || "").trim();
      if (!text) return "Each question must have text.";
      if (["checkbox", "radio", "dropdown"].includes(q.type)) {
        const opts = uniqueTrimmed(q.options || []);
        if (!opts.length)
          return "Choice questions must have at least one option.";
      }
      if (q.type === "matrix") {
        const rows = uniqueTrimmed(q.matrixRows || []);
        const cols = uniqueTrimmed(q.scaleLabels || []);
        if (!rows.length || !cols.length)
          return "Matrix needs rows and columns.";
      }
      if (["rating", "slider", "star"].includes(q.type)) {
        const min = Number(q.scaleMin ?? 1);
        const max = Number(q.scaleMax ?? 5);
        if (!(Number.isFinite(min) && Number.isFinite(max) && min < max)) {
          return "Rating/Slider/Star must have a valid min < max.";
        }
      }
    }
    return null;
  };

  const onDuplicate = (q) => {
    const uniqueText = nextUniqueText(q.text, questions, q.type);
    const copy = {
      ...q,
      id: `copy-${Date.now()}`,
      text: uniqueText,
      displayOrder: questions.length + 1,
    };
    setQuestions((prev) => [...prev, copy]);
    success("Question duplicated.");
  };

  const onUpdate = (id, changes) =>
    setQuestions((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, ...changes } : q));
      const edited = next.find((q) => q.id === id);
      if (!edited) return prev;

      const textChanged = Object.prototype.hasOwnProperty.call(changes, "text");
      const typeChanged = Object.prototype.hasOwnProperty.call(changes, "type");

      if (textChanged || typeChanged) {
        const desired = (edited.text || "").trim();
        if (desired) {
          const dupExists = next.some(
            (qq) =>
              qq.id !== id &&
              qq.type === edited.type &&
              (qq.text || "").trim().toLowerCase() === desired.toLowerCase(),
          );
          // set flag; don't block typing
          edited.dupWarning = dupExists;
        } else {
          edited.dupWarning = false;
        }
      }
      return next.map((q) => (q.id === id ? edited : q));
    });

  const onDelete = (id) =>
    setQuestions((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, i) => ({ ...q, displayOrder: i + 1 })),
    );

  /* ===================================================== */
  /* ===================== SUBMIT ======================== */
  /* ===================================================== */
  const launchSurvey = async () => {
    if (themeChoice === "custom" && !themeFile) {
      error("Please upload a background theme or switch to Default.");
      return;
    }

    const errMsg = validateQuestionsBeforeSubmit();
    if (errMsg) {
      error(errMsg);
      return;
    }

    if (questions.some((q) => q.dupWarning)) {
      error("Resolve duplicate questions before launching.");
      return;
    }

    const ty = Math.min(
      30,
      Math.max(0, Number(String(thankyouTimeout || "0"))),
    );
    const idle = Number(String(idleTimeoutValue || "0"));
    const unit = idleTimeoutUnit === "hours" ? "hours" : "minutes";

    if ((unit === "minutes" && idle < 10) || (unit === "hours" && idle < 1)) {
      error("Idle timeout must be ≥ 10 minutes or ≥ 1 hour.");
      return;
    }
    if (!questions.length) {
      error("Add at least one question.");
      return;
    }

    setLaunching(true);

    const apiQuestions = questions.map((q, idx) => {
      const isMatrix = q.type === "matrix";
      const cols = (q.scaleLabels || []).filter(Boolean);
      const min = ["rating", "slider", "star"].includes(q.type)
        ? q.scaleMin
        : isMatrix
          ? 1
          : undefined;
      const max = ["rating", "slider", "star"].includes(q.type)
        ? q.scaleMax
        : isMatrix
          ? Math.max(1, cols.length || 1)
          : undefined;

      return {
        surveyQuestion: q.text,
        surveyQuestionType: q.type,
        surveyCheckBoxOptions: ["checkbox", "radio", "dropdown"].includes(
          q.type,
        )
          ? q.options || []
          : [],
        matrixQnLabels: isMatrix ? q.matrixRows || [] : [],
        scaleLabels: ["rating", "slider", "star", "matrix"].includes(q.type)
          ? q.scaleLabels || []
          : [],
        scaleMin: min,
        scaleMax: max,
        required: !!q.required,
        displayOrder: idx + 1,
      };
    });

    const formData = new FormData();
    formData.append("eventId", String(eventId ?? sessionEventId ?? ""));
    formData.append("surveyOwnerEmail", surveyOwnerEmail ?? "");
    formData.append("masterSocket", masterSocket ?? "");
    formData.append("isAnonymousSurvey", String(responseMode === "anonymous"));
    formData.append("thankyouTimeout", String(ty));
    formData.append("idleTimeoutValue", String(idle));
    formData.append("idleTimeoutUnit", unit);
    formData.append("questions", JSON.stringify(apiQuestions));
    formData.append("emailMode", emailMode);

    if (themeChoice === "custom" && themeFile) {
      formData.append("backgroundTheme", themeFile);
    }

    try {
      await addSurveyQuestionsAndLaunchFeedback(formData);
      success("Survey launched!");
    } catch (e) {
      console.error(e);
      error("Failed to launch survey.");
    } finally {
      setLaunching(false);
    }
  };

  function Spinner({ size = 16 }) {
    return (
      <span
        className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-[#27235c]"
        style={{ width: size, height: size }}
      />
    );
  }

  function OptionList({ value, onChange, placeholder = "Option" }) {
    const list = value || [];

    const add = () => onChange([...list, ""]);
    const update = (i, v) => {
      const next = [...list];
      next[i] = v;
      onChange(next);
    };
    const remove = (i) => {
      const next = [...list];
      next.splice(i, 1);
      onChange(next);
    };
    const onKeyDown = (i, e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const last = (list[list.length - 1] || "").trim();
        if (last) add();
      }
      if (e.key === "Backspace" && !list[i]) {
        if (list.length > 1) {
          e.preventDefault();
          remove(i);
        }
      }
    };

    return (
      <div className="space-y-2">
        {list.map((opt, i) => (
          <div
            key={i}
            className="group flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#27235c] text-xs font-semibold text-white">
              {i + 1}
            </span>
            <input
              value={opt}
              onChange={(e) => update(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              placeholder={`${placeholder} ${i + 1}`}
              className="flex-1 border-0 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="opacity-70 hover:opacity-100 text-red-600 text-sm"
              aria-label="Remove option"
              title="Remove option"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="text-sm text-[#27235c] hover:underline"
        >
          + Add option
        </button>
      </div>
    );
  }

  function toKeyed(arr = []) {
    return arr.map((t) => ({ id: crypto.randomUUID(), text: t }));
  }
  function fromKeyed(list = []) {
    return list.map((x) => x.text);
  }

  function RowField({
    index,
    total,
    value,
    onChange,
    onRemove,
    onMoveUp,
    onMoveDown,
    placeholder,
    onLastTypedFirstChar, // called when last field receives first char
    autoFocusIfEmptyLast, // focus newly added last field
  }) {
    const ref = useRef(null);

    // Focus the brand-new empty last field when created
    useEffect(() => {
      if (autoFocusIfEmptyLast && index === total - 1 && !value) {
        ref.current?.focus?.();
      }
    }, [autoFocusIfEmptyLast, index, total, value]);

    const handleChange = (e) => {
      const v = e.target.value;
      // If this is the last field and it was empty and we typed first char → notify parent
      if (index === total - 1 && !value && v) {
        onLastTypedFirstChar?.();
      }
      onChange(index, v);
    };

    const onKeyDown = (e) => {
      // Alt+↑/↓ moves
      if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        e.key === "ArrowUp" ? onMoveUp(index) : onMoveDown(index);
      }
      // Backspace on empty removes (if >1)
      if (e.key === "Backspace" && !value && total > 1) {
        e.preventDefault();
        onRemove(index);
        requestAnimationFrame(() => ref.current?.focus?.());
      }
    };

    return (
      <div className="group flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#27235c] text-xs font-semibold text-white">
          {index + 1}
        </span>
        <input
          ref={ref}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 border-0 focus:outline-none text-sm"
          aria-label={placeholder}
        />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMoveUp(index)}
            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
            aria-label="Move up"
          >
            {" "}
            <ChevronUp size={16} />{" "}
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(index)}
            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
            aria-label="Move down"
          >
            {" "}
            <ChevronDown size={16} />{" "}
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 rounded hover:bg-gray-100 text-red-600 cursor-pointer"
            aria-label="Remove"
          >
            {" "}
            <XIcon size={16} />{" "}
          </button>
        </div>
      </div>
    );
  }

  function toKeyedList(arr = []) {
    return arr.map((text) => ({ id: crypto.randomUUID(), text }));
  }
  function fromKeyedList(items = []) {
    return items.map((it) => it.text);
  }

  function TypeMenu({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const menuRef = React.useRef(null);
    const btnRef = React.useRef(null);

    const TYPES = [
      { v: "comment", label: "Comment" },
      { v: "checkbox", label: "Checkbox" },
      { v: "radio", label: "Radio" },
      { v: "dropdown", label: "Dropdown" },
      { v: "rating", label: "Rating" },
      { v: "slider", label: "Slider" },
      { v: "star", label: "Star" },
      { v: "matrix", label: "Matrix" },
    ];

    // Close on outside click / Esc
    useEffect(() => {
      const onClick = (e) => {
        if (!menuRef.current || !btnRef.current) return;
        if (
          open &&
          !menuRef.current.contains(e.target) &&
          !btnRef.current.contains(e.target)
        ) {
          setOpen(false);
        }
      };
      const onKey = (e) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onClick);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);

    // Keyboard navigation in menu
    const [active, setActive] = useState(0);
    const onMenuKey = (e) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (a + 1) % TYPES.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (a - 1 + TYPES.length) % TYPES.length);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onChange(TYPES[active].v);
        setOpen(false);
        btnRef.current?.focus();
      }
    };

    return (
      <div className="relative" onKeyDown={onMenuKey}>
        <label className="block text-xs text-gray-500 mb-1">
          Question Type
        </label>
        <button
          ref={btnRef}
          type="button"
          className="inline-flex items-center gap-2 border rounded px-3 py-2"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          <span>
            {TYPES.find((t) => t.v === value)?.label || "Select type"}
          </span>
          <ChevronDown size={16} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="absolute z-50 mt-2 w-48 rounded-md border bg-white shadow-lg"
              role="menu"
            >
              {TYPES.map((t, i) => (
                <button
                  key={t.v}
                  role="menuitem"
                  onClick={() => {
                    onChange(t.v);
                    setOpen(false);
                    btnRef.current?.focus();
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 ${
                    i === active ? "bg-gray-50" : ""
                  }`}
                >
                  <span>{t.label}</span>
                  {t.v === value && (
                    <Check size={16} className="text-[#27235c]" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  function AnimatedTextList({ value, onChange, placeholderBase }) {
    const [items, setItems] = useState(() => toKeyedList(value));

    useEffect(() => {
      if ((value || []).length !== items.length) {
        setItems(toKeyedList(value || []));
      } else {
        setItems((prev) => prev.map((it, i) => ({ ...it, text: value[i] })));
      }
    }, [value]);

    const commit = (next) => onChange(fromKeyedList(next));

    const add = () => {
      const next = [...items, { id: crypto.randomUUID(), text: "" }];
      setItems(next);
      commit(next);
    };

    const update = (i, text) => {
      const next = [...items];
      next[i] = { ...next[i], text };
      setItems(next);
      commit(next);
    };

    const remove = (i) => {
      if (items.length <= 1) return;
      const next = items.slice(0, i).concat(items.slice(i + 1));
      setItems(next);
      commit(next);
    };

    const move = (i, dir) => {
      const j = i + dir;
      if (j < 0 || j >= items.length) return;
      const next = [...items];
      const [it] = next.splice(i, 1);
      next.splice(j, 0, it);
      setItems(next);
      commit(next);
    };

    const autoAppendIfLast = () => {
      const last = items[items.length - 1];
      if (last && last.text.trim() !== "") add();
    };

    return (
      <div>
        <AnimatePresence initial={false}>
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="mb-2 max-w-full md:max-w-[560px]"
            >
              <RowField
                index={i}
                total={items.length}
                value={it.text}
                onChange={update}
                onRemove={remove}
                onMoveUp={(idx) => move(idx, -1)}
                onMoveDown={(idx) => move(idx, 1)}
                placeholder={`${placeholderBase} ${i + 1}`}
                autoAppendIfLast={autoAppendIfLast}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-sm text-[#27235c] hover:underline cursor-pointer"
        >
          <Plus size={16} /> Add {placeholderBase.toLowerCase()}
        </button>
      </div>
    );
  }
  // AnimatedOptionList — compact + arrows
  function AnimatedOptionList({ value, onChange }) {
    const [items, setItems] = useState(() => toKeyed(value || []));
    const [autoFocusLast, setAutoFocusLast] = useState(false);

    // Sync down carefully: preserve IDs when length matches
    useEffect(() => {
      const v = value || [];
      if (v.length !== items.length) {
        setItems(toKeyed(v));
      } else {
        setItems((prev) => prev.map((it, i) => ({ ...it, text: v[i] })));
      }
    }, [value]);

    const commit = (next) => onChange(fromKeyed(next));

    const add = () => {
      const next = [...items, { id: crypto.randomUUID(), text: "" }];
      setItems(next);
      commit(next);
      setAutoFocusLast(true);
    };

    const update = (i, text) => {
      const next = [...items];
      next[i] = { ...next[i], text };
      setItems(next);
      commit(next);
    };

    const remove = (i) => {
      if (items.length <= 1) return;
      const next = items.slice(0, i).concat(items.slice(i + 1));
      setItems(next);
      commit(next);
    };

    const move = (i, dir) => {
      const j = i + dir;
      if (j < 0 || j >= items.length) return;
      const next = [...items];
      const [it] = next.splice(i, 1);
      next.splice(j, 0, it);
      setItems(next);
      commit(next);
    };

    // Append when typing into the last field (first character only)
    const onLastTypedFirstChar = () => {
      const last = items[items.length - 1];
      if (last && last.text.trim() !== "") return; // already has content
      // create a new empty trailing field without stealing focus
      const next = [...items, { id: crypto.randomUUID(), text: "" }];
      setItems(next);
      commit(next);
      setAutoFocusLast(false); // keep focus on current field
    };

    return (
      <div>
        <p className="text-sm font-medium mb-2 text-gray-700">Options</p>
        <AnimatePresence initial={false}>
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="mb-2 max-w-full md:max-w-[560px]"
            >
              <RowField
                index={i}
                total={items.length}
                value={it.text}
                onChange={update}
                onRemove={remove}
                onMoveUp={(idx) => move(idx, -1)}
                onMoveDown={(idx) => move(idx, 1)}
                placeholder={`Option ${i + 1}`}
                onLastTypedFirstChar={onLastTypedFirstChar}
                autoFocusIfEmptyLast={autoFocusLast}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-sm border px-2 py-1 rounded cursor-pointer"
        >
          <Plus size={16} /> Add option
        </button>
      </div>
    );
  }

  // AnimatedTextList — for matrix rows/columns (same UI as options)
  function AnimatedTextList({ value, onChange, placeholderBase }) {
    const [items, setItems] = useState(() => toKeyed(value || []));
    const [autoFocusLast, setAutoFocusLast] = useState(false);

    useEffect(() => {
      const v = value || [];
      if (v.length !== items.length) {
        setItems(toKeyed(v));
      } else {
        setItems((prev) => prev.map((it, i) => ({ ...it, text: v[i] })));
      }
    }, [value]);

    const commit = (next) => onChange(fromKeyed(next));

    const add = () => {
      const next = [...items, { id: crypto.randomUUID(), text: "" }];
      setItems(next);
      commit(next);
      setAutoFocusLast(true);
    };

    const update = (i, text) => {
      const next = [...items];
      next[i] = { ...next[i], text };
      setItems(next);
      commit(next);
    };

    const remove = (i) => {
      if (items.length <= 1) return;
      const next = items.slice(0, i).concat(items.slice(i + 1));
      setItems(next);
      commit(next);
    };

    const move = (i, dir) => {
      const j = i + dir;
      if (j < 0 || j >= items.length) return;
      const next = [...items];
      const [it] = next.splice(i, 1);
      next.splice(j, 0, it);
      setItems(next);
      commit(next);
    };

    const onLastTypedFirstChar = () => {
      const last = items[items.length - 1];
      if (last && last.text.trim() !== "") return;
      const next = [...items, { id: crypto.randomUUID(), text: "" }];
      setItems(next);
      commit(next);
      setAutoFocusLast(false);
    };

    return (
      <div>
        <AnimatePresence initial={false}>
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="mb-2 max-w-full md:max-w-[560px]"
            >
              <RowField
                index={i}
                total={items.length}
                value={it.text}
                onChange={update}
                onRemove={remove}
                onMoveUp={(idx) => move(idx, -1)}
                onMoveDown={(idx) => move(idx, 1)}
                placeholder={`${placeholderBase} ${i + 1}`}
                onLastTypedFirstChar={onLastTypedFirstChar}
                autoFocusIfEmptyLast={autoFocusLast}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-sm border px-2 py-1 rounded cursor-pointer"
        >
          <Plus size={16} /> Add {placeholderBase.toLowerCase()}
        </button>
      </div>
    );
  }

  /* Animated text list (for matrix rows & columns) */
  function AnimatedTextList({ value, onChange, placeholderBase }) {
    const list = value || [];
    const add = () => onChange([...list, ""]);
    const update = (i, v) => {
      const next = [...list];
      next[i] = v;
      onChange(next);
    };
    const remove = (i) => {
      const next = [...list];
      next.splice(i, 1);
      onChange(next);
    };
    const onKeyDown = (i, e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const last = (list[list.length - 1] || "").trim();
        if (last) add();
      }
      if (e.key === "Backspace" && !list[i]) {
        if (list.length > 1) {
          e.preventDefault();
          remove(i);
        }
      }
    };

    return (
      <div>
        <AnimatePresence initial={false}>
          {list.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="group flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm mb-2"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#27235c] text-xs font-semibold text-white">
                {i + 1}
              </span>
              <input
                value={val}
                onChange={(e) => update(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                placeholder={`${placeholderBase} ${i + 1}`}
                className="flex-1 border-0 focus:outline-none"
                aria-label={`${placeholderBase} ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="opacity-70 hover:opacity-100 text-red-600 text-sm"
                aria-label={`Remove ${placeholderBase.toLowerCase()} ${i + 1}`}
                title="Remove"
              >
                Remove
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          type="button"
          onClick={add}
          className="text-sm text-[#27235c] hover:underline"
        >
          + Add {placeholderBase.toLowerCase()}
        </button>
      </div>
    );
  }

  /* ===================================================== */
  /* ===================== RENDER ======================== */
  /* ===================================================== */
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {/* ============== SIDEBAR (Previous Questions) ============== */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            className="fixed md:static inset-0 md:inset-auto z-40 md:z-auto w-full md:w-96 bg-white border-r flex flex-col h-screen md:h-auto"
          >
            <div className="flex justify-between p-4 border-b">
              <h3 className="font-semibold text-[#27235c] flex items-center gap-2">
                <History size={16} /> Previous Questions
              </h3>

              <button
                onClick={() => setShowSidebar(false)}
                aria-label="Close sidebar"
                title="Close Sidebar"
                className="p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                <X />
              </button>
            </div>

            {/* Filters */}
            <EventFilterBar
              categories={categories}
              events={events}
              categoryId={categoryId}
              eventId={eventId}
              onCategoryChange={setCategoryId}
              onEventChange={setEventId}
            />

            {/* Search */}
            <div className="p-3">
              <label className="block text-xs text-gray-500 mb-1">Search</label>
              <input
                placeholder="Search questions..."
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none"
                aria-label="Search previous questions"
              />
            </div>

            {/* List (ensure it fills) */}
            <div className="flex-1 min-h-0">
              {filteredPrevious.length === 0 ? (
                <div className="h-full flex items-center justify-center p-6 text-center text-gray-500">
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <SearchX className="text-blue-500" size={28} />
                    </div>
                    <p className="text-sm font-medium">No questions found</p>
                    <p className="text-xs">
                      Try changing the Event or the search term.
                    </p>
                  </div>
                </div>
              ) : (
                <Virtuoso
                  data={filteredPrevious}
                  style={{ height: "100%" }}
                  itemContent={(i, q) => {
                    const k = q.surveyQuestionId ?? `${q.surveyQuestion}-${i}`;
                    const checked = selectedPrev.has(k);
                    return (
                      <div className="px-4 py-3 border-b hover:bg-gray-50 transition flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="mt-1 cursor-pointer"
                          checked={checked}
                          onChange={() => {
                            const normalized = (q.surveyQuestion || "")
                              .trim()
                              .toLowerCase();
                            const alreadyAdded = questions.some(
                              (qq) =>
                                qq.type === q.surveyQuestionType &&
                                (qq.text || "").trim().toLowerCase() ===
                                  normalized,
                            );
                            if (alreadyAdded) {
                              error("This question is already added.");
                              return; // don't toggle this selection
                            }
                            setSelectedPrev((prev) => {
                              const n = new Set(prev);
                              if (n.has(k)) n.delete(k);
                              else n.add(k);
                              return n;
                            });
                          }}
                          aria-label={`Select: ${q.surveyQuestion}`}
                        />

                        <button
                          onClick={() => addPreviousQuestion(q)}
                          className="flex-1 text-left cursor-pointer"
                          aria-label={`Add question: ${q.surveyQuestion}`}
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {q.surveyQuestion}
                          </p>
                          <span className="text-xs text-blue-600">
                            {q.surveyQuestionType}
                          </span>
                        </button>
                      </div>
                    );
                  }}
                />
              )}
            </div>

            {/* Footer action */}
            <div className="border-t p-3">
              <button
                className="w-full bg-[#27235c] text-white text-sm py-2 rounded-lg disabled:opacity-50 cursor-pointer"
                disabled={selectedPrev.size === 0}
                onClick={() => {
                  const arr = Array.from(selectedPrev);
                  let added = 0;
                  arr.forEach((key) => {
                    const q = filteredPrevious.find(
                      (item, idx) =>
                        (item.surveyQuestionId ??
                          `${item.surveyQuestion}-${idx}`) === key,
                    );
                    if (!q) return;
                    const normalized = (q.surveyQuestion || "")
                      .trim()
                      .toLowerCase();
                    const exists = questions.some(
                      (qq) =>
                        qq.type === q.surveyQuestionType &&
                        (qq.text || "").trim().toLowerCase() === normalized,
                    );
                    if (!exists) {
                      addPreviousQuestion(q);
                      added++;
                    }
                  });
                  if (added === 0)
                    error("All selected questions are already added.");
                  else
                    success(`Added ${added} question${added > 1 ? "s" : ""}.`);
                  setSelectedPrev(new Set());
                }}
              >
                Add Selected ({selectedPrev.size})
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ===================== MAIN ===================== */}

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="mx-auto w-full max-w-screen-2xl space-y-8">
          <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#27235c]">
              Survey Builder
            </h1>

            <button
              onClick={() => setShowSidebar(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-[#27235c]"
              aria-label="Open previous questions"
            >
              <PanelRightOpen size={18} />
              Previous Questions
            </button>
          </header>

          {/* ================= Settings (UI-only changes; logic unchanged) ================= */}
          <motion.section className="bg-transparent p-0">
            <h2 className="text-lg font-semibold text-[#27235c] flex items-center gap-2">
              <Settings size={18} /> Survey Settings
            </h2>

            {/* Three cards in one row */}
            <section className="grid md:grid-cols-3 gap-6">
              {/* Response Mode */}
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm font-medium mb-2 text-gray-700">
                  Response Mode
                </p>
                <div className="inline-flex rounded-lg overflow-hidden border">
                  {["anonymous", "email"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setResponseMode(m)}
                      className={`px-4 py-2 text-sm cursor-pointer ${
                        responseMode === m
                          ? "bg-[#27235c] text-white"
                          : "bg-white"
                      }`}
                    >
                      {m === "anonymous" ? "Anonymous" : "Email-based"}
                    </button>
                  ))}
                </div>

                {responseMode === "email" && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 border rounded px-3 py-2 cursor-pointer">
                      <input
                        type="radio"
                        name="email-mode"
                        className="cursor-pointer"
                        checked={emailMode === "external"}
                        onChange={() => setEmailMode("external")}
                      />
                      <span className="text-sm">External</span>
                    </label>
                    <label className="flex items-center gap-2 border rounded px-3 py-2 cursor-pointer">
                      <input
                        type="radio"
                        name="email-mode"
                        className="cursor-pointer"
                        checked={emailMode === "internal"}
                        onChange={() => setEmailMode("internal")}
                      />
                      <span className="text-sm">Internal</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Background Theme */}
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm font-medium mb-2 text-gray-700">
                  Background Theme
                </p>
                <div className="inline-flex rounded-lg overflow-hidden border">
                  <button
                    type="button"
                    onClick={() => {
                      setThemeChoice("default");
                      setThemeFile(null);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer ${
                      themeChoice === "default"
                        ? "bg-[#27235c] text-white"
                        : "bg-white"
                    }`}
                    aria-pressed={themeChoice === "default"}
                  >
                    Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeChoice("custom")}
                    className={`px-4 py-2 text-sm cursor-pointer ${
                      themeChoice === "custom"
                        ? "bg-[#27235c] text-white"
                        : "bg-white"
                    }`}
                    aria-pressed={themeChoice === "custom"}
                  >
                    Custom
                  </button>
                </div>

                {themeChoice === "custom" && (
                  <div
                    className="mt-3 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-white hover:bg-gray-50"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (!f) return;
                      if (!["image/gif", "video/mp4"].includes(f.type)) {
                        error("Theme must be GIF or MP4.");
                        return;
                      }
                      if (f.size > 50 * 1024 * 1024) {
                        error("Max size is 50MB.");
                        return;
                      }
                      setThemeFile(f);
                    }}
                    onClick={() =>
                      document.getElementById("theme-file-input")?.click()
                    }
                    role="button"
                    aria-label="Drop or click to upload theme"
                  >
                    <p className="text-sm text-gray-700">
                      Drag &amp; drop GIF/MP4 here or click to browse
                    </p>
                    <input
                      id="theme-file-input"
                      type="file"
                      accept="image/gif,video/mp4"
                      hidden
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        if (!["image/gif", "video/mp4"].includes(f.type)) {
                          error("Theme must be GIF or MP4.");
                          return;
                        }
                        if (f.size > 50 * 1024 * 1024) {
                          error("Max size is 50MB.");
                          return;
                        }
                        setThemeFile(f);
                      }}
                    />
                    {themeFile && (
                      <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                        <span className="truncate">{themeFile.name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 text-xs rounded border cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowThemePreview(true);
                            }}
                          >
                            Preview
                          </button>
                          {/* Ensure ThemePreviewModalSurvey is imported / renamed to ThemePreviewModal */}
                          <ThemePreviewModalSurvey
                            open={showThemePreview}
                            onClose={() => setShowThemePreview(false)}
                            file={themeFile}
                            choice={themeChoice}
                          />
                          <button
                            className="px-2 py-1 text-xs rounded border text-red-600 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setThemeFile(null);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Timeouts */}
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm font-medium mb-2 text-gray-700">
                  Timeouts
                </p>

                {!isEditingTimeouts && (
                  <div className="space-y-1 text-sm text-gray-800">
                    <div>
                      Thank you timeout: <strong>{thankyouTimeout}s</strong>
                    </div>
                    <div>
                      Idle Timeout:{" "}
                      <strong>
                        {idleTimeoutValue} {idleTimeoutUnit}
                      </strong>
                    </div>
                    <button
                      className="mt-2 text-sm border px-2 py-1 rounded cursor-pointer"
                      onClick={() => setIsEditingTimeouts(true)}
                    >
                      Edit
                    </button>
                  </div>
                )}

                {isEditingTimeouts && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Thank you timeout (0–30 sec)
                      </label>
                      <input
                        type="text"
                        ref={thankRef}
                        value={thankyouTimeout}
                        onChange={(e) =>
                          setThankyouTimeout(e.target.value.replace(/\D/g, ""))
                        }
                        onBlur={() => {
                          const before = Number(thankyouTimeout || "0");
                          const after = Math.min(30, Math.max(0, before));
                          if (after !== before)
                            error("Thankyou timeout limit is 0–30 seconds.");
                          setThankyouTimeout(after.toString());
                        }}
                        className="w-28 border rounded px-3 py-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Idle Timeout
                      </label>
                      <div className="flex gap-3">
                        <input
                          ref={idleValRef}
                          type="text"
                          value={idleTimeoutValue}
                          onChange={(e) =>
                            setIdleTimeoutValue(
                              e.target.value.replace(/\D/g, ""),
                            )
                          }
                          onBlur={() => {
                            const n = Number(idleTimeoutValue || "0");
                            const min = idleTimeoutUnit === "hours" ? 1 : 10;
                            if (n < min)
                              error(`Minimum is ${min} ${idleTimeoutUnit}.`);
                            setIdleTimeoutValue(Math.max(min, n).toString());
                          }}
                          className="w-28 border rounded px-3 py-2 focus:outline-none"
                          placeholder={idleTimeoutUnit === "hours" ? "1" : "10"}
                        />
                        <select
                          value={idleTimeoutUnit}
                          onChange={(e) => setIdleTimeoutUnit(e.target.value)}
                          className="w-32 border rounded px-3 py-2 focus:outline-none cursor-pointer"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <SurveyButtonLoader
                        isLoading={savingTimeouts}
                        onClick={handleTimeoutSave}
                        variant="primary"
                        size="sm"
                        loadingLabel="Saving..."
                      >
                        Save
                      </SurveyButtonLoader>

                      <SurveyButtonLoader
                        onClick={() => setIsEditingTimeouts(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </SurveyButtonLoader>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </motion.section>

          {/* ================= Create Question (UI refresh only) ================= */}

          <motion.section className="bg-white rounded-xl p-6 shadow space-y-5">
            <h3 className="font-semibold text-[#27235c] flex items-center gap-2">
              <FilePlus2 size={16} /> Create Question
            </h3>

            {/* Question text (50% on md+), Type button menu, Required */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-xs text-gray-500 mb-1">
                  Question
                </label>
                <input
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion((q) => ({ ...q, text: e.target.value }))
                  }
                  placeholder="Enter question"
                  className="w-full border rounded px-3 py-2 focus:outline-none"
                  aria-label="Question text"
                />
              </div>

              <TypeMenu
                value={newQuestion.type}
                onChange={(t) =>
                  setNewQuestion((q) => ({
                    ...q,
                    type: t,
                    options: ["checkbox", "radio", "dropdown"].includes(t)
                      ? [""]
                      : [],
                    matrixRows: t === "matrix" ? [""] : [],
                    scaleLabels: t === "matrix" ? [""] : [],
                    // Auto scales: Rating/Slider/Star editable below; Matrix derived from columns
                    scaleMin: 1,
                    scaleMax: 5,
                  }))
                }
              />

              <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newQuestion.required}
                  onChange={(e) =>
                    setNewQuestion((q) => ({
                      ...q,
                      required: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
                Required
              </label>
            </div>

            {/* Dynamic fields */}
            {/* Options for checkbox/radio/dropdown (denser, animated) */}

            {["checkbox", "radio", "dropdown"].includes(newQuestion.type) && (
              <AnimatedOptionList
                value={newQuestion.options}
                onChange={(opts) =>
                  setNewQuestion((q) => ({ ...q, options: opts }))
                }
              />
            )}

            {/* Rating/Slider/Star: scale inputs */}
            {["rating", "slider", "star"].includes(newQuestion.type) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Scale Min
                  </label>
                  <input
                    type="text"
                    value={newQuestion.scaleMin}
                    onChange={(e) =>
                      setNewQuestion((q) => ({
                        ...q,
                        scaleMin: Math.min(
                          100,
                          Math.max(
                            0,
                            Number((e.target.value || "").replace(/\D/g, "")),
                          ),
                        ),
                      }))
                    }
                    className="w-28 border rounded px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Scale Max
                  </label>
                  <input
                    type="text"
                    value={newQuestion.scaleMax}
                    onChange={(e) =>
                      setNewQuestion((q) => ({
                        ...q,
                        scaleMax: Math.min(
                          100,
                          Math.max(
                            0,
                            Number((e.target.value || "").replace(/\D/g, "")),
                          ),
                        ),
                      }))
                    }
                    className="w-28 border rounded px-3 py-2 focus:outline-none"
                  />
                  ``
                </div>
              </div>
            )}

            {/* Matrix: rows + columns (columns drive scale automatically) */}
            {newQuestion.type === "matrix" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2 text-gray-700">Rows</p>
                  <AnimatedTextList
                    value={newQuestion.matrixRows}
                    placeholderBase="Row"
                    onChange={(rows) =>
                      setNewQuestion((q) => ({ ...q, matrixRows: rows }))
                    }
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-gray-700">
                    Columns
                  </p>
                  <AnimatedTextList
                    value={newQuestion.scaleLabels}
                    placeholderBase="Column"
                    onChange={(cols) =>
                      setNewQuestion((q) => ({
                        ...q,
                        scaleLabels: cols,
                        scaleMin: 1,
                        scaleMax: Math.max(
                          1,
                          (cols || []).filter(Boolean).length || 1,
                        ),
                      }))
                    }
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Scale is auto‑calculated from number of columns.
                  </p>
                </div>
              </div>
            )}

            {/* Add Question */}
            <div className="flex justify-end">
              <button
                onClick={addNewQuestion}
                className="bg-[#27235c] text-white px-6 py-2 rounded-lg cursor-pointer"
                aria-label="Add question"
              >
                Add Question
              </button>
            </div>
          </motion.section>

          {/* ================= Added Questions (DnD) ================= */}

          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-sm font-semibold text-[#27235c] mb-4 flex items-center gap-2">
              <ListChecks size={16} /> Added Questions
            </h2>

            {questions.length <= 1 ? (
              // No DnD for a single item → prevents drifting
              <div className="space-y-3">
                {questions.map((q) => (
                  <SortableItem
                    key={q.id}
                    id={q.id}
                    question={q}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    disableDrag // pass a prop; your SortableItem can hide handle if true
                  />
                ))}
              </div>
            ) : (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              >
                <SortableContext
                  items={questions.map((q) => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                    {questions.map((q) => (
                      <SortableItem
                        key={q.id}
                        id={q.id}
                        question={q}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </section>

          {/* ================= Launch ================= */}

          <div className="flex justify-end gap-2">
            <SurveyButtonLoader
              disabled={launching}
              onClick={() => setShowPreview(true)}
              className="border px-4 py-2 rounded-lg"
              aria-label="Open live preview"
            >
              Live Preview
            </SurveyButtonLoader>
            <SurveyButtonLoader
              disabled={launching}
              isLoading={launching}
              onClick={launchSurvey}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Launch Survey
            </SurveyButtonLoader>
          </div>
        </div>

        <SurveyLivePreview
          open={showPreview}
          onClose={() => setShowPreview(false)}
          questions={questions}
          themeChoice={themeChoice}
          themeFile={themeFile}
          responseMode={responseMode}
          emailMode={emailMode}
          thankyouTimeout={thankyouTimeout}
          idleTimeoutValue={idleTimeoutValue}
          idleTimeoutUnit={idleTimeoutUnit}
        />
      </main>
    </div>
  );
}
