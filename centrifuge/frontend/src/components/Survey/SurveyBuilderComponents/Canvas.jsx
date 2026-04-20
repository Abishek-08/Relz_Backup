import React, { useLayoutEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import SortableItem from "./SortableItem";
import { LucideBadgeQuestionMark } from "lucide-react";

export default function Canvas({
  questions,
  onReorder,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  setActiveQuestionId,
  isDraggable = true,
}) {
  const sensors = useSensors(useSensor(TouchSensor), useSensor(PointerSensor));

  const listRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  const remember = () => {
    if (listRef.current) lastScrollTopRef.current = listRef.current.scrollTop;
  };

  useLayoutEffect(() => {
    if (listRef.current && Number.isFinite(lastScrollTopRef.current)) {
      listRef.current.scrollTop = lastScrollTopRef.current;
    }
  }, [questions]);

  const preserveCanvasScroll = (fn) => {
    const el = document.querySelector("[data-canvas-scroll]");
    const y = el ? el.scrollTop : null;
    fn();
    requestAnimationFrame(() => {
      if (el && y !== null) el.scrollTop = y;
    });
  };

  const ListWrapper = ({ children }) => (
    <div
      ref={listRef}
      data-canvas-scroll
      className="space-y-3 max-h-[70vh] overflow-y-auto pr-1"
    >
      {children}
    </div>
  );

  const ids = questions.map((q) => q.id);

  useLayoutEffect(() => {
  if (listRef.current && Number.isFinite(lastScrollTopRef.current)) {
    listRef.current.scrollTop = lastScrollTopRef.current;
  }
}, [ids]);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    const reordered = arrayMove(questions, oldIndex, newIndex).map((q, i) => ({
      ...q,
      displayOrder: i + 1,
    }));
    onReorder?.(reordered);
  };

  const renderRow = (q, idx) => (
    <SortableItem
      key={q.id} 
      id={q.id} 
      question={q}
      index={idx}
      total={questions.length}
      onUpdate={(changes) => {
        remember();
        preserveCanvasScroll(() => onUpdate(q.id, changes));
      }}
      onDelete={() => {
        remember();
        preserveCanvasScroll(() => onDelete(q.id));
      }}
      onDuplicate={() => {
        remember();
        preserveCanvasScroll(() => onDuplicate(q));
      }}
      onMoveUp={() => {
        remember();
        preserveCanvasScroll(() => onMoveUp(q.id));
      }}
      onMoveDown={() => {
        remember();
        preserveCanvasScroll(() => onMoveDown(q.id));
      }}
      onSelect={() => {
        remember();
        preserveCanvasScroll(() => setActiveQuestionId(q.id));
      }}
      disableDrag={false}
    />
  );

  return (
    <section className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-sm font-semibold text-[#274c77] mb-4 flex items-center gap-2">
        Added Questions ({questions.length})
      </h2>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 shadow-sm">
            <LucideBadgeQuestionMark className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-sm text-gray-600 max-w-xs">
            No questions added yet. Use{" "}
            <span className="font-medium">“Create Question”</span>
          </p>
          <div className="text-gray-400 text-xs font-semibold tracking-wide">
            or
          </div>
          <p className="text-sm text-gray-600 max-w-xs">
            Pick from <span className="font-medium">Previous Questions</span>.
          </p>
        </div>
      ) : !isDraggable || questions.length <= 1 ? (
        <ListWrapper>{questions.map(renderRow)}</ListWrapper>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[
            restrictToVerticalAxis,
            restrictToFirstScrollableAncestor,
          ]}
          autoScroll={true} // smooths long drags in scroll container
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <ListWrapper>{questions.map(renderRow)}</ListWrapper>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
