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
    <div className="top-0 bg-white p-3 space-y-3 rounded-t-xl">
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
