import React from "react";
import UserNavbar from "../../../components/user_module_components/user_components/UserNavbar";
import ScheduledAssessments from "../../../components/user_module_components/user_components/assessments/ScheduledAssessments";

const ScheduledLearningAssessmentView = ({ assessmentType }) => {
  return (
    <div>
      <div style={{ position: "fixed", zIndex: "1000" }}>
        <UserNavbar />
      </div>
      <div>
        <ScheduledAssessments assessmentType={assessmentType} />
      </div>
    </div>
  );
};

export default ScheduledLearningAssessmentView;
