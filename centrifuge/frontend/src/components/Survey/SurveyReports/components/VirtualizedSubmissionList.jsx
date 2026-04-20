import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import IndividualSubmissionCard from './IndividualSubmissionCard.jsx';
import EmptyState from './EmptyState.jsx';

export default React.memo(function VirtualizedSubmissionList({ items = [] }) {
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

  return (
    <div className="w-full">
      <Virtuoso
        useWindowScroll
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