import React, { useMemo } from 'react';
import AggregatedQuestionCard from './AggregatedQuestionCard.jsx';
import SkeletonCard from './SkeletonCard.jsx';
import { Virtuoso } from 'react-virtuoso';

function buildRows(questions = []) {
  const rows = [];
  let pending = null;
  const sorted = [...questions].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  for (const q of sorted) {
    if (q.questionType === 'matrix') {
      if (pending) { rows.push([pending]); pending = null; }
      rows.push([q]);
      continue;
    }
    if (!pending) pending = q;
    else { rows.push([pending, q]); pending = null; }
  }
  if (pending) rows.push([pending]);
  return rows;
}

export default React.memo(function AggregatedReportView({
  primaryColor = '#27235c',
  totalResponses = 0,
  surveyInfo,
  questions = [],
  isLoadingCards = false,
}) {
  const rows = useMemo(() => buildRows(questions), [questions]);

  if (isLoadingCards) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-md text-center bg-white border rounded-xl p-8">
          <div className="text-xl font-semibold text-gray-900">No questions found</div>
          <div className="text-gray-600 mt-1">Try adjusting filters.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      <Virtuoso
        useWindowScroll
        totalCount={rows.length}
        style={{height: '100%'}}
        itemContent={(rowIndex) => {
          const row = rows[rowIndex];
          const isMatrixRow = row.length === 1 && row[0].questionType === 'matrix';
          return (
            <div className={`grid grid-cols-1 ${isMatrixRow ? '' : 'lg:grid-cols-2'} gap-4 mb-4`}>
              {row.map((q, idx) => (
                <AggregatedQuestionCard
                  key={(q.questionId || `${rowIndex}-${idx}`)}
                  index={q.displayOrder || (rowIndex * 2 + idx + 1)}
                  question={q}
                  primaryColor={primaryColor}
                  totalResponses={totalResponses}
                />
              ))}
            </div>
          );
        }}
      />
    </div>
  );
});