import React from "react";
import AdminNavbar from "../Adminnavbar";
import KnowledgeAssessmentSchedule from "../../../components/admin_module_components/Skill_Assessment_Admin/AssessmentSchedule_Learning_Redux";

function KnowledgeAssessmentScheduleViewStep() {
  return (
    <div>
      <div className="container-fluid d-flex m-0 p-0" style={{backgroundColor: "#f5f5f5", height: "100vh", overflowY: "hidden"}}>
        <div>
          <AdminNavbar />
        </div>
        <div style={{ width: "100%", marginTop: "50px" }}>
          <KnowledgeAssessmentSchedule />
        </div>
      </div>
    </div>
  );
}

export default KnowledgeAssessmentScheduleViewStep;
