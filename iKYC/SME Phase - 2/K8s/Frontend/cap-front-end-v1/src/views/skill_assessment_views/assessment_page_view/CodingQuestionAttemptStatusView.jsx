import React from 'react';
import CodingQuestionAttemptStatus from '../../../components/skill_assessment_components/assessment_view_components/CodingQuestionAttemptStatus';
const CodingQuestionAttemptStatusView = () => {

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevents the context menu from appearing
  };

  return (
    <div onContextMenu={handleContextMenu}>
      <CodingQuestionAttemptStatus />
    </div>
  )
}

export default CodingQuestionAttemptStatusView;
