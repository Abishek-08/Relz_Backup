import React from "react";
import defaultPicture from "../../../assets/user-module-assets/DefaultProfileImage.png";
import { GiLaurelCrown } from "react-icons/gi";
import "../../../styles/user_module_styles/user_dashboard_styles/LeaderboardStyle.css";

const LeaderboardCard = ({ user, rank, place, totalScore }) => {
  const { userImageData, userName } = user || {};
  const imageSrc = userImageData
    ? `data:image/jpeg;base64,${userImageData}`
    : defaultPicture;

  const rankLabels = ["Master", "Grand Master", "Veteran"];
  const rankLabel = rankLabels[place] || "";

  return (
    <div
      className={`user-leaderboard-card `}
      id={`leaderboard_user_card_rank${place + 1}`}
      style={{
        marginTop: place === 1 ? "-1.5em" : place === 0 ? "-0.5em" : "0",
      }}
    >
      <div id="leaderboard_user_card_place_number">
        <strong>
          <p style={{ marginBottom: "0em" }}>{rankLabel}</p>
        </strong>
      </div>
      <div className="row">
        <div className="col-8 d-flex justify-content-end">
          <img
            src={imageSrc}
            alt={userName}
            className="img-fluid"
            id="user_display_image_leaderboard"
          />
        </div>
        <div className="col-4">
          <GiLaurelCrown id={`crown_icon_place_${rank + 1}`} />
        </div>
      </div>
      <h3 id="user_module_leaderboard_scorecars_names">{userName}</h3>
      <p id="user_module_leaderboard_scorecars_scores">Score {totalScore}%</p>
    </div>
  );
};

export default LeaderboardCard;
