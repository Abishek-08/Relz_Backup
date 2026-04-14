import React from "react";
import AdminNavbar from "../Adminnavbar";
import KnowledgeQuestionPick from "../../../components/admin_module_components/Skill_Assessment_Admin/AddLearningAssessmentQuestionAdminRedux";

function KnowledgeQuestionPickViewStep() {
  return (
    <div>
      <div className="container-fluid d-flex m-0 p-0"  style={{backgroundColor: "#f5f5f5", height: "100vh"}}>
        <div>
          <AdminNavbar />
        </div>
        <div style={{ width: "100%", marginTop: "50px" }}>
          <KnowledgeQuestionPick />
        </div>
      </div>
    </div>
  );
}

export default KnowledgeQuestionPickViewStep;
