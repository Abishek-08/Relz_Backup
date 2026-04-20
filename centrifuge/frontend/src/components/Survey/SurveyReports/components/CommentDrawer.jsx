import React, { useMemo, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { MessageSquareText, X, Search } from 'lucide-react';

export default function CommentDrawer({ comments = [] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const firstFew = comments.slice(0, 2);

  const filtered = useMemo(() => {
    if (!q) return comments;
    const s = q.toLowerCase();
    return comments.filter((c) => String(c).toLowerCase().includes(s));
  }, [q, comments]);

  return (
    <div>
      {firstFew.map((c, i) => (
        <div key={i} className="text-sm text-gray-900 border-b py-1">{c}</div>
      ))}
      {comments.length > 2 && (
        <button
          onClick={() => setOpen(true)}
          className="mt-2 text-sm underline cursor-pointer hover:opacity-80 text-[#27235c]"
        >
          View all ({comments.length})
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute left-0 right-0 bottom-0 rounded-t-2xl bg-white p-4 shadow-xl max-h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-800 font-medium">
                <MessageSquareText size={16} /> All comments
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-600 text-sm cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2 border rounded-md px-2 py-1">
              <Search size={16} className="text-gray-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search comments"
                className="flex-1 text-sm outline-none"
              />
            </div>

            <div className="mt-3 h-[50vh]">
              {filtered.length > 20 ? (
                <Virtuoso
                  totalCount={filtered.length}
                  itemContent={(index) => (
                    <div className="py-2 border-b text-sm text-gray-900">{filtered[index]}</div>
                  )}
                  increaseViewportBy={200}
                />
              ) : (
                <div className="max-h-full overflow-auto">
                  {filtered.map((c, i) => (
                    <div key={i} className="py-2 border-b text-sm text-gray-900">{c}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}