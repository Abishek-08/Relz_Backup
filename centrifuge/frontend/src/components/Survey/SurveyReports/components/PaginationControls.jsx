import React from 'react';
import { getPaginationRange } from '../utils/getPaginationRange'; // adjust path

export default React.memo(function PaginationControls({
  id,
  page,
  totalPages,
  onChange,
  primaryColor = '#27235c',
  isLoading = false,
  siblingCount = 2,   // ±2 around current
  boundaryCount = 2,  // first 2, last 2
}) {
  if (totalPages <= 1) return null;

  const prev = () => !isLoading && onChange(Math.max(1, page - 1));
  const next = () => !isLoading && onChange(Math.min(totalPages, page + 1));

  const pages = getPaginationRange({
    totalPages,
    currentPage: page,
    siblingCount,
    boundaryCount,
  });

  return (
    <div id={id} tabIndex={-1} className="flex items-center justify-center gap-2">
      <button
        onClick={prev}
        disabled={isLoading || page <= 1}
        className={`px-3 py-1 border rounded text-sm bg-white transition-colors
          ${isLoading || page <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'}`}
      >
        Prev
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`dots-${i}`} className="px-2 text-gray-500">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            disabled={isLoading}
            className={`px-3 py-1 border rounded text-sm transition
              ${p === page ? 'text-white' : 'text-gray-700'}
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}
            style={{ background: p === page ? primaryColor : 'white' }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={next}
        disabled={isLoading || page >= totalPages}
        className={`px-3 py-1 border rounded text-sm bg-white transition-colors
          ${isLoading || page >= totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'}`}
      >
        Next
      </button>
    </div>
  );
});