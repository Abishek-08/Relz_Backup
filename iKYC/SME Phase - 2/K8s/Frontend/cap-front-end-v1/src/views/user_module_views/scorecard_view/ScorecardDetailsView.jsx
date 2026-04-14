import React from "react";
import UserNavbar from "../../../components/user_module_components/user_components/UserNavbar";
import ScoreCardDetails from "../../../components/user_module_components/user_components/scorecard/ScoreCardDetails";

const ScorecardDetailsView = ({ type }) => {
  return (
    <div>
      <div style={{ position: "fixed", zIndex: "1000" }}><UserNavbar /></div>
      <div><ScoreCardDetails type={type} /></div>
      
      
    </div>
  );
};

export default ScorecardDetailsView;
