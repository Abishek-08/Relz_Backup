import React from "react";
import Leaderboard from "../../../components/user_module_components/user_components/Leaderboard";
import UserNavbar from "../../../components/user_module_components/user_components/UserNavbar";

function LeaderboardView() {
  return (
    <div>
      <div style={{zIndex:"10", position:"fixed"}}>
        <UserNavbar />
      </div>
      <div style={{zIndex:"1"}}>
        <Leaderboard />
      </div>
    </div>
  );
}

export default LeaderboardView;
