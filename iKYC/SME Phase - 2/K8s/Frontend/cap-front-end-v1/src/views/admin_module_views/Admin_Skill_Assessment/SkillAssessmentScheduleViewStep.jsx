import React from "react";
import AdminNavbar from "../Adminnavbar";
import SkillAssessmentSchedule from "../../../components/admin_module_components/Skill_Assessment_Admin/AssessmentScheduleRedux";
function SkillAssessmentScheduleViewStep() {
  return (
    <div className="container-fluid d-flex m-0 p-0"  style={{backgroundColor: "#f5f5f5", height: "100vh", overflowY: "hidden"}}>
      <div>
        <AdminNavbar />
      </div>
      <div style={{ width: "100%", marginTop: "50px" }}>
        <SkillAssessmentSchedule />
      </div>
    </div>
  );
}

export default SkillAssessmentScheduleViewStep;
