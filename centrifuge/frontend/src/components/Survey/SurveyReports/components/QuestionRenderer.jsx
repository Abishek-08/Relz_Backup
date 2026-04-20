import React, { useState } from 'react';
import { sanitizeInlineHTML, toDisplayHTML } from '../../../../utils/richText.jsx';

export default React.memo(function QuestionRenderer({ answer, primaryColor = '#27235c' }) {
  const { questionType, value } = answer || {};
  const Label = null; // Label is now rendered by the card; keep body minimal.

  if (value == null || value === '') {
    return <div className="text-gray-400 italic text-sm">No answer</div>;
  }

  if (questionType === 'radio' || questionType === 'dropdown') {
    return (
      <div className="mt-1">
        <span className="inline-block px-3 py-1 rounded-full text-sm text-white" style={{ background: primaryColor }}>
  <span dangerouslySetInnerHTML={{ __html: toDisplayHTML(String(value || '')) }} />
</span>
      </div>
    );
  }

  if (questionType === 'checkbox') {
    const arr = Array.isArray(value) ? value : [];
    if (!arr.length) return <div className="text-gray-400 italic text-sm">No selection</div>;
    return (
      <div className="mt-1 flex flex-wrap gap-2">
        {arr.map((opt, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-sm bg-white">
  <input aria-label="selected" type="checkbox" checked readOnly className="accent-gray-600" />
  <span dangerouslySetInnerHTML={{ __html: toDisplayHTML(String(opt || '')) }} />
</span>
        ))}
      </div>
    );
  }

  if (questionType === 'star') {
    const n = Number(value) || 0;
    const total = Math.max(5, n);
    return (
      <div className="mt-1 flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <svg key={i} width="18" height="18" viewBox="0 0 24 24"
            fill={i < n ? primaryColor : 'none'} stroke={primaryColor} strokeWidth="1.5" aria-hidden="true">
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-700">{n}</span>
      </div>
    );
  }

  if (questionType === 'slider') {
    const n = Number(value) || 0;
    return (
      <div className="mt-2 flex items-center gap-3">
        <input aria-label="slider" type="range" min="0" max="10" value={n} disabled className="w-64 accent-gray-500" />
        <span className="text-sm text-gray-700">{n}</span>
      </div>
    );
  }

  if (questionType === 'rating') {
    const n = Number(value) || 0; // 0-10
    return (
      <div className="mt-1 flex items-center gap-1 flex-wrap">
        {Array.from({ length: 11 }).map((_, i) => (
          <span
            key={i}
            className={`px-2 py-1 text-xs rounded border ${i === n ? 'text-white' : 'text-gray-700'}`}
            style={{
              borderColor: i === n ? primaryColor : '#e5e7eb',
              background: i === n ? primaryColor : 'white'
            }}
            aria-current={i === n ? 'true' : undefined}
          >
            {i}
          </span>
        ))}
      </div>
    );
  }

  if (questionType === 'matrix') {
    const matrix = value || {};
    const rows = Object.keys(matrix);
    const setCols = new Set();
    rows.forEach((r) => Object.keys(matrix[r] || {}).forEach((c) => setCols.add(c)));
    const cols = Array.from(setCols);

    if (!rows.length || !cols.length) return <div className="text-gray-400 italic text-sm">No selection</div>;

    return (
      <div className="mt-2 overflow-x-auto">
        <table className="min-w-[520px] text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 border-b text-left sticky left-0 bg-gray-50 z-10" />
              {cols.map((c) => <th key={c} className="px-3 py-2 border-b text-left">
  <span dangerouslySetInnerHTML={{ __html: toDisplayHTML(String(c || '')) }} />
</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2 border-b font-medium sticky left-0 bg-inherit">
  <span dangerouslySetInnerHTML={{ __html: toDisplayHTML(String(r || '')) }} />
</td>
                {cols.map((c) => {
                  const selected = !!matrix[r]?.[c];
                  return (
                    <td key={c} className="px-3 py-2 border-b">
                      {selected ? (
                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: primaryColor }} />
                      ) : <span className="inline-block w-3 h-3 rounded-full border border-gray-300" />}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Fallback for structured objects or text
  if (typeof value === 'object') {
    return <pre className="text-xs bg-gray-50 rounded border p-2 overflow-auto max-h-40">{JSON.stringify(value, null, 2)}</pre>;
  }

  return <div className="mt-1 text-sm text-gray-800">{String(value)}</div>;
});