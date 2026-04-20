import { AnimatePresence, motion } from "framer-motion";
import { PanelRightClose } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";

export default function PreviousQuestionsSidebar({
  open,
  onClose,
  categories,
  events,
  categoryId,
  eventId,
  onCategoryChange,
  onEventChange,
  questions,
  onSelect,
}) {
  const [search, setSearch] = useState("");
  const deferred = useDeferredValue(search);
 
  const filtered = useMemo(() => {
    if (!deferred) return questions;
    return questions.filter((q) =>
      normalize(q.surveyQuestion || "").includes(normalize(deferred))
    );
  }, [questions, deferred]);
  
 
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -380 }}
          animate={{ x: 0 }}
          exit={{ x: -380 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="fixed md:static inset-0 z-40 md:z-auto w-full md:w-96 bg-white border-r flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Previous Questions</h2>
            <button onClick={onClose}>
              <PanelRightClose />
            </button>
          </div>
 
          <div className="p-3 space-y-3">
            <select
              value={categoryId ?? ""}
              onChange={(e) => onCategoryChange(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2 focus:outline-none"
            >
              {categories.map((c) => (
                <option
                  key={c.eventCategoryId}
                  value={c.eventCategoryId}
                >
                  {c.eventCategoryName}
                </option>
              ))}
            </select>
 
            <select
              value={eventId ?? ""}
              onChange={(e) =>
                onEventChange(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="w-full border rounded-md px-3 py-2 focus:outline-none"
            >
              <option value="">All Events</option>
              {events.map((e) => (
                <option key={e.eventId} value={e.eventId}>
                  {e.eventName}
                </option>
              ))}
            </select>
 
            <input
              placeholder="Search questions"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none"
            />
          </div>
 
          <div className="flex-1 min-h-0">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                No questions found
              </p>
            ) : (
              <Virtuoso
                data={filtered}
                style={{ height: "100%" }}
                itemContent={(i, q) => (
                  <div
                    onClick={() => onSelect(q)}
                    className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50"
                  >
                    <p className="text-sm font-medium">
                      {q.surveyQuestion}
                    </p>
                    <span className="text-xs text-blue-600">
                      {q.surveyQuestionType}
                    </span>
                  </div>
                )}
              />
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}