import React from "react";
import AdminNavbar from "../Adminnavbar";
import CreateAssessmentRedux from "../../../components/admin_module_components/Skill_Assessment_Admin/CreateAssessmentRedux";
function CreateAssessmentViewStep() {
  return (
    <div className="container-fluid d-flex m-0 p-0"  style={{backgroundColor: "#f5f5f5", height: "100vh", overflowY: "hidden"}}>
      <div>
        <AdminNavbar />
      </div>
      <div style={{ width: "100%", marginTop: "50px" }}>
        <CreateAssessmentRedux />
      </div>
    </div>
  );
}

export default CreateAssessmentViewStep;
