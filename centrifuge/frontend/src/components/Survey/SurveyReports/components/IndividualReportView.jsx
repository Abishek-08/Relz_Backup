// src/components/IndividualReportView.jsx
import React, { useEffect, useMemo, useRef } from 'react';
import PaginationControls from './PaginationControls.jsx';
import IndividualSubmissionCard from './IndividualSubmissionCard.jsx';
import EmptyState from './EmptyState.jsx';
import Pagination from './PaginationControls.jsx';

export default React.memo(function IndividualReportView({
  primaryColor = '#27235c',
  data = { items: [], total: 0, page: 1, limit: 20 },
  isLoading = false,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil((data.total || 0) / (data.limit || 20)));
  const scrollerRef = useRef(null);
  const page = data.page || 1;

  useEffect(() => {
    scrollerRef.current = document.getElementById('report-scroll');
  }, []);

  const go = (p) => {
    if (!p || p === page) return;
    onPageChange(p);
    const node = scrollerRef.current || window;
    node.scrollTo({ top: 0, behavior: 'smooth' });
    // move focus back to pagination for a11y
    const pg = document.getElementById('pagination-controls');
    if (pg) setTimeout(() => pg.focus(), 150);
  };

  // Keyboard: left/right for pagination
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft' && page > 1) { e.preventDefault(); go(page - 1); }
      if (e.key === 'ArrowRight' && page < totalPages) { e.preventDefault(); go(page + 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page, totalPages]);

  const content = useMemo(() => {
    if (!data.items?.length) {
      return (
        <EmptyState
          title="No submissions found"
          subtitle="There are no responses for the current selection."
          icon="Inbox"
          big
        />
      );
    }
    
const groups = new Map();
   data.items.forEach((sub) => {
     const email = sub?.user?.email || (sub?.user?.anonymous ? "Anonymous" : "Anonymous");
     if (!groups.has(email)) {
       groups.set(email, {
         user: { email },
         createdAt: sub.createdAt,
         answers: [],
         anonymous: sub?.anonymous,
       });
     }
     const g = groups.get(email);
     if (sub.createdAt && (!g.createdAt || new Date(sub.createdAt) > new Date(g.createdAt))) {
       g.createdAt = sub.createdAt;
     }
     g.answers = g.answers.concat(sub.answers || []);
   });

   const grouped = Array.from(groups.values());
   // Sort descending by latest submission time (optional)
   grouped.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

   return (
     <ul className="space-y-4">
       {grouped.map((sub, idx) => (
         <li key={sub.user.email + "|" + (sub.createdAt || idx)}>
           <IndividualSubmissionCard submission={sub} />
         </li>
       ))}
     </ul>
   );
  }, [data.items]);

  return (
    <div className="relative space-y-4" role="region" aria-label="Individual responses" aria-live="polite">
      {/* Top sticky pagination */}
      {/* <div className="sticky top-0 z-10">
        <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-md px-3 py-2 shadow-sm">
          <PaginationControls
            id="pagination-controls"
            page={page}
            totalPages={totalPages}
            onChange={go}
            primaryColor={primaryColor}
            isLoading={isLoading}
          />
        </div>
      </div> */}

      {/* Content */}
      {content}

      {/* Bottom sticky pagination */}
      {totalPages > 1 && (
  <div className="sticky bottom-0 z-10">
    <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-md px-3 py-2 shadow-sm">
      
<PaginationControls
        id="pagination-controls"
        page={page}
        totalPages={totalPages}
        onChange={go}
        primaryColor={primaryColor}
        isLoading={isLoading}
        siblingCount={2}
        boundaryCount={2}
      />
    </div>
  </div>
)}


      {/* Loading veil (keeps old content visible) */}
      {isLoading && (
        <div className="pointer-events-none absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
      )}
    </div>
  );
});