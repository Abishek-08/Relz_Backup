
// import React from "react";

// export default function EventFilterBar({
//   categories = [],
//   events = [],
//   categoryId,
//   eventId,
//   viewMode = "event",
//   onCategoryChange,
//   onEventChange,
//   onViewModeChange,
// }) {
//   return (
//     <div className="sticky top-0 z-20 bg-white border-b p-3 space-y-3">
//       {/* Category */}
//       <div>
//         <label className="block text-xs text-gray-500 mb-1">Event Category</label>
//         <select
//           value={categoryId ?? ""}
//           onChange={(e) => onCategoryChange(Number(e.target.value))}
//           className="w-full border px-3 py-2 rounded-md focus:outline-none"
//           aria-label="Select event category"
//         >
//           {categories.map((c) => (
//             <option key={c.eventCategoryId} value={c.eventCategoryId}>
//               {c.eventCategoryName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Event */}
//       <div>
//         <label className="block text-xs text-gray-500 mb-1">Event</label>
//         <select
//           value={eventId ?? ""}
//           onChange={(e) => {
//             const val = e.target.value;
//             // If empty → All Events
//             if (!val) {
//               onEventChange(null);
//               onViewModeChange?.("all");
//             } else {
//               onEventChange(Number(val));
//               onViewModeChange?.("event");
//             }
//           }}
//           className="w-full border px-3 py-2 rounded-md focus:outline-none"
//           aria-label="Select event"
//         >
//           <option value="">All Events</option>
//           {events.map((e) => (
//             <option key={e.eventId} value={e.eventId}>
//               {e.eventName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* View toggle */}
//       <div>
//         <label className="block text-xs text-gray-500 mb-1">View</label>
//         <div className="inline-flex rounded-md overflow-hidden border">
//           <button
//             type="button"
//             onClick={() => onViewModeChange?.("all")}
//             className={`px-3 py-2 text-sm ${
//               viewMode === "all" ? "bg-[#27235c] text-white" : "bg-white"
//             }`}
//             aria-pressed={viewMode === "all"}
//             aria-label="All view"
//           >
//             All
//           </button>
//           <button
//             type="button"
//             onClick={() => onViewModeChange?.("event")}
//             className={`px-3 py-2 text-sm ${
//               viewMode === "event" ? "bg-[#27235c] text-white" : "bg-white"
//             }`}
//             aria-pressed={viewMode === "event"}
//             aria-label="Event view"
//           >
//             Event
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";

export default function EventFilterBar({
  categories = [],
  events = [],
  categoryId,
  eventId,
  onCategoryChange,
  onEventChange,
}) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b p-3 space-y-3">
      {/* Category */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Event Category</label>
        <select
          value={categoryId ?? ""}
          onChange={(e) => onCategoryChange(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded-md focus:outline-none cursor-pointer"
          aria-label="Select event category"
        >
          {categories.map((c) => (
            <option key={c.eventCategoryId} value={c.eventCategoryId}>
              {c.eventCategoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Event */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Event</label>
        <select
          value={eventId ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            onEventChange(val ? Number(val) : null); // null => All Events
          }}
          className="w-full border px-3 py-2 rounded-md focus:outline-none cursor-pointer"
          aria-label="Select event"
        >
          <option value="">All Events</option>
          {events.map((e) => (
            <option key={e.eventId} value={e.eventId}>
              {e.eventName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
