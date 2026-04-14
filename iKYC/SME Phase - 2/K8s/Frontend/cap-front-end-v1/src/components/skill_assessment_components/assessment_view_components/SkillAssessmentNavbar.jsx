import ReplyIcon from "@mui/icons-material/Reply";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import capLogo from "../../../assets/user-module-assets/Caplogo.png";
import "../../../styles/skill_assessment_styles/coding_question_styles/SkillAssessmentNavbar.css";
import useFullScreen from "../../user_module_components/Proctoring/useFullScreen";
import CodeAssessmentTimeOut from "./CodeAssessmentTimeOut";

/**
 * @author vinolisha.vijayakumar, Srinivasan S, Sanjay Khanna
 * @since 22-07-2024
 * @version 1.0
 */

/**
 * @author Sanjay Khanna, Srinivasan S
 * @since 24-08-2024
 * @version 2.0
 */

function SkillAssessmentNavbar({
  attempt,
  report,
  instruction,
  resultWaited,
  showTimePopup,
  onNextPopup,
  showFinishPopup,
  onClosePopup,
}) {
  // Retrieve duration from session storage or default to 60 minutes
  const duration = sessionStorage.getItem("duration") || 60;
  const startTime = sessionStorage.getItem("startTime");

  // Hook for navigation
  const navigate = useNavigate();

  // Custom hook for managing fullscreen mode
  const { isFullscreen, enterFullscreen } = useFullScreen();

  // Handler for submitting the assessment and navigating to the attempt status page
  const handleSubmit = () => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen(); // Ensure fullscreen mode is applied
    }
    navigate("/attemptstatus");
  };

  // Handler for navigating back to the coding assessment page
  const handleBackButton = () => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen(); // Ensure fullscreen mode is applied
    }
    navigate("/codingassessmentpage");
  };

  // Handler for navigating to the report or scorecard page based on user type
  const handleCodeReport = () => {
    const userType = localStorage.getItem("userType");
    if (userType === "ADMIN") {
      navigate("/admindashboard");
    } else {
      if (sessionStorage.getItem("reportPage") !== null) {
        sessionStorage.removeItem("reportPage");
      }
      navigate("/scorecard");
    }
  };

  return (
    <div id="skill-navbar-container">
      <ul id="skill-navbar-nav">
        <Grid item xs={4} container>
          <img
            src={capLogo}
            alt="cap_logo"
            style={{ width: "30px", height: "25px", marginLeft: "1%" }}
          />
          <div id="skill-code-heading">Skill Assessment</div>
        </Grid>
        {attempt ? (
          <Grid item xs={8} container justifyContent="end" mr={1}>
            <Button
              variant="outlined"
              style={{
                color: "white",
                borderColor: "white",
                backgroundColor: "transparent",
                marginTop: 2,
              }}
              onClick={handleBackButton}
            >
              <ReplyIcon />
              Back
            </Button>
          </Grid>
        ) : instruction ? (
          ""
        ) : report ? (
          <>
            <Grid item xs={3} container justifyContent="end">
              <div id="skill-code-heading">Detailed Report</div>
            </Grid>
            <Grid item xs={5} container justifyContent="end" mr={1}>
              <Button
                variant="outlined"
                style={{
                  color: "white",
                  borderColor: "white",
                  backgroundColor: "transparent",
                  marginTop: 3,
                  marginRight: 3,
                  height: "25px",
                  width: "105px",
                }}
                onClick={handleCodeReport}
              >
                <ReplyIcon />
                Back
              </Button>
            </Grid>
          </>
        ) : resultWaited ? (
          ""
        ) : (
          <>
            <Grid item xs={4} container justifyContent="center">
              {/* Component to display time-out information */}
              <CodeAssessmentTimeOut
                duration={duration}
                startTime={startTime}
              />
              {/* Popup message for time schedule */}
              {showTimePopup && (
                <Box sx={{ position: "relative", width: 50 }}>
                  {/* Arrow for popup card */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 33, // Position the arrow above the card, adjust as needed
                      right: 100,
                      transform: "translateX(-50%)", // Center alignment adjustment
                      width: 0,
                      height: 0,
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderBottom: "10px solid rgba(0,0,0,0.9)", // Arrow color
                    }}
                  />
                  {/* Popup card */}
                  <Card
                    sx={{
                      position: "absolute",
                      top: "43px", // Adjust as needed to position the card below the arrow
                      right: 100, // Center horizontally relative to the Box
                      transform: "translateX(50%)", // Center the card horizontally
                      width: 180,
                      backgroundColor: "rgba(0,0,0,0.9)",
                      fontSize: "12px",
                      color: "white",
                      boxShadow: 10,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                      zIndex: 10,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "17px", fontWeight: "bold", mb: 1 }}
                      >
                        Attention: Time Schedule
                      </Typography>
                      <Typography variant="body1">
                        Finish the Assessment within the given time
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          mt: 1,
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                        }}
                        onClick={onNextPopup}
                      >
                        Next
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Grid>

            <Grid item xs={4} container justifyContent="flex-end">
              <Button
                variant="outlined"
                style={{
                  color: "white",
                  borderColor: "#dad4d4",
                  backgroundColor: "transparent",
                }}
                id="skill_module_submit_btn"
                onClick={handleSubmit}
              >
                Finish Assessment
              </Button>
            </Grid>

            {/* Popup message for finishing the assessment */}
            {showFinishPopup && (
              <Box sx={{ top: "7%", right: 100, position: "relative" }}>
                {/* Arrow for popup card */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 20, // Position the arrow above the card, adjust as needed
                    left: "50%", // Center horizontally relative to the card
                    transform: "translateX(-50%)", // Center alignment adjustment
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderBottom: "10px solid rgba(0,0,0,0.9)", // Arrow color
                  }}
                />
                {/* Popup card */}
                <Card
                  sx={{
                    position: "absolute",
                    top: "30px", // Adjust as needed to position the card below the arrow
                    right: "50%", // Center horizontally relative to the Box
                    transform: "translateX(50%)", // Center the card horizontally
                    width: 180,
                    backgroundColor: "rgba(0,0,0,0.9)",
                    fontSize: "12px",
                    color: "white",
                    boxShadow: 10,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    zIndex: 10,
                  }}
                >
                  <CardContent sx={{ padding: "8px 16px" }}>
                    {/* Adjusted padding */}
                    <Typography
                      sx={{ fontSize: "17px", fontWeight: "bold", mb: 1 }}
                    >
                      Attention: Finish Assessment
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Use this button to finish the assessment
                    </Typography>
                    <Button
                      color="inherit"
                      variant="outlined"
                      sx={{
                        color: "white",
                        borderColor: "white",
                        backgroundColor: "transparent",
                      }}
                      onClick={onClosePopup}
                    >
                      Close
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            )}
          </>
        )}
      </ul>
    </div>
  );
}

export default SkillAssessmentNavbar;
