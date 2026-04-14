import React from "react";
import AdminNavbar from "../Adminnavbar";
import ProctorSkill from "../../../components/admin_module_components/Skill_Assessment_Admin/ProctorSkill";

function ProctorSkillViewStep() {
  return (
    <div className="container-fluid d-flex m-0 p-0" style={{backgroundColor: "#f5f5f5", height: "100vh", overflowY: "hidden"}}>
      <div>
        <AdminNavbar />
      </div>
      <div style={{ width: "100%", height: "100%", marginTop: "50px" }}>
        <ProctorSkill />
      </div>
    </div>
  );
}

export default ProctorSkillViewStep;
