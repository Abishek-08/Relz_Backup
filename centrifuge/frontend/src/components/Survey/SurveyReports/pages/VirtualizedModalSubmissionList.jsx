import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import IndividualSubmissionCard from '../../SurveyReports/components/IndividualSubmissionCard.jsx';
import EmptyState from './EmptyState.jsx';

export default React.memo(function VirtualizedModalSubmissionList({ items = [], scrollParentRef }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No submissions found"
        subtitle="There are no responses for the current selection."
        icon="Inbox"
        big
      />
    );
  }

  const useWindow = !scrollParentRef;

  return (
    <div className="w-full">
      <Virtuoso
        useWindowScroll={useWindow}
        customScrollParent={scrollParentRef?.current}
        totalCount={items.length}
        itemContent={(index) => (
          <div className="mb-4">
            <IndividualSubmissionCard submission={items[index]} />
          </div>
        )}
        increaseViewportBy={600}
      />
    </div>
  );
});