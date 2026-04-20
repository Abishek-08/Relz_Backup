// src/components/AppliedFilterChips.jsx
import React from 'react';
import { CalendarDays, X } from 'lucide-react';

export default function AppliedFilterChips({ range = {}, onClear = () => {}, align = 'left' }) {
  const chips = [];
  if (range.from) chips.push({ key: 'from', label: `From: ${range.from}` });
  if (range.to) chips.push({ key: 'to', label: `To: ${range.to}` });

  if (!chips.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
      <div className="text-xs text-white flex items-center gap-1">
        <CalendarDays size={14} /> Applied:
      </div>
      {chips.map((c) => (
        <span key={c.key} className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
          {c.label}
          <button
            onClick={() => onClear(c.key)}
            className="text-indigo-700 hover:text-indigo-900"
            title="Clear"
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
}