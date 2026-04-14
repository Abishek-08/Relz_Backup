import React  from "react";
import UserNavbar from "../../components/user_module_components/user_components/UserNavbar";
import { useParams } from "react-router-dom";
import LearningAssessmentDetailedReport from "../../components/learningassessment_module_components/user_detailed_report/LearningAssessmentDetailedReport";

const KnowledgeAssessmentDetailReportView = () => {
  const { schedulingId, userId } = useParams();

  return (
    <div className="d-flex">
      <UserNavbar />
        <LearningAssessmentDetailedReport userId={userId} schedulingId={schedulingId} />
    </div>
  );
};

export default KnowledgeAssessmentDetailReportView;
