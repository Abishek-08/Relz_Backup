import React from "react";
import UserNavbar from "../../../components/user_module_components/user_components/UserNavbar";
import SubmissionSkill from "../../../components/user_module_components/user_components/submissions/SubmissionSkill";

const SkillSubmissionView = () => {
  return (
    <div>
      <div style={{ position: "relative" , zIndex:"1000"}}>
        <UserNavbar />
      </div>
      <div>
        <SubmissionSkill />
      </div>
    </div>
  );
};

export default SkillSubmissionView;
