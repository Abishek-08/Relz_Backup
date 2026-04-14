import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Popover,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentLanguageSkeleton } from "../../../redux/actions/skill_assessment_actions/assessment_views_actions/CodingAssessmentAction";
import { getCodeAssessmentQuestions } from "../../../redux/actions/skill_assessment_actions/coding_question_actions/CodeAssessmentAction";
import "../../../styles/skill_assessment_styles/coding_question_styles/CodeAssessmentNavbar.css";

/**
 * @author Srinivasan.S 12113
 * @since 05-07-2024
 */

/**
 *
 * @author Vinolisha V 12126
 * @since 26-07-2024
 */

/**
 *
 * @author Sanjay khanna, Srinivasan S
 * @since 24-08-2024
 * @version 2.0
 */

function CodeAssessmentNavbar({ onHelpToggle, isHelpLocked }) {
  // State for managing the popover anchor element
  const [anchorEl, setAnchorEl] = useState(null);

  // State for dark mode
  const [darkMode] = useState(false);
  const dispatch = useDispatch();

  // Selector to get the currently selected question
  const question = useSelector((state) => state.code);

  // Selector to get all scheduled questions
  const questions = useSelector((state) => state.skillQuestion.questions);

  /**
   * Handles click event on the help icon to open the popover.
   * 
   * @param {object} event - The click event
   */
  const handleHelpIconClick = (event) => {
    // Set the anchor element for Popover
    setAnchorEl(event.currentTarget);
  };

  // Ref for the help icon
  const helpIconRef = useRef(null);

  /**
   * Handles the toggle of the help option by delegating to the parent handler.
   * 
   * @param {object} event - The change event
   */
  const handleHelpToggle = (event) => {
    // Delegate the toggle to the parent handler
    onHelpToggle(event);
  };

  /**
   * Closes the popover by setting the anchor element to null.
   */
  const handlePopoverClose = () => {
    // Close the popover
    setAnchorEl(null);
  };

  const handleChange = (data, index) => {
    dispatch(getCodeAssessmentQuestions({ ...data, currentQuestion: index }));
    var language = localStorage.getItem(data.questionId);
    data.codingQuestionSkeletonDtos.forEach((item) =>
      item.languageName === language
        ? dispatch(getCurrentLanguageSkeleton(item))
        : ""
    );
  };

  // Open state for Popover
  const open = Boolean(anchorEl);

  // Apply dark mode styles conditionally
  const popoverStyle = darkMode
    ? { backgroundColor: "#333", color: "#fff" }
    : { backgroundColor: "#fff", color: "#000" };

  return (
    <Grid id="codequestion-assessment-navbar" container>
      {questions.map((option, index) => {
        // Determine if the question is attended
        let attendedQuestion = false;
        option.codingQuestionSkeletonDtos.forEach((attended) => {
          if (
            attended.languageName === localStorage.getItem(option.questionId)
          ) {
            attendedQuestion =
              attended.codeSkeleton ===
              localStorage.getItem(
                option.questionId + "_" + attended.languageName
              );
          }
        });

        // Determine background color based on question selection and attendance
        const backgroundColor =
          question.questionId === option.questionId
            ? "green" // Selected question
            : attendedQuestion
              ? "#ebe4e4"
              : "#26245c";

        // Determine hover color for the card
        const hoverColor =
          question.questionId === option.questionId
            ? "darkgreen"
            : attendedQuestion
              ? "#073A87"
              : "#073A87";

        return (
          <Grid item xs={12} key={option.questionId}>
            <Tooltip title={`Question ${index + 1}`} placement="right">
              <Card
                id="code-assessment-navbar-btn"
                variant="outlined"
                sx={{
                  backgroundColor: backgroundColor,
                  color: backgroundColor === "#26245c" ? "white" : "black",
                  "&:hover": {
                    backgroundColor: hoverColor,
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleChange(option, index)}
              >
                <CardContent>
                  <Typography variant="body1" id="code-assessment-question">
                    <b> Q{index + 1}</b>
                  </Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>
        );
      })}

      {/* Help Icon */}
      <Tooltip title="Get Help" arrow>
        <IconButton
          ref={helpIconRef}
          style={{
            fontWeight: "bold",
            position: "absolute",
            bottom: 10,
            left: 5,
            backgroundColor: "#26245c",
            border: "1px solid #000000",
          }}
          onClick={handleHelpIconClick}
        >
          <HelpOutlineIcon style={{ color: "white" }} />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        style={{ marginTop: 10 }}
      >
        <div
          style={{
            padding: 16,
            position: "relative",
            ...popoverStyle,
          }}
        >
          <IconButton
            style={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
            onClick={handlePopoverClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Help Options</Typography>
          <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
            <Typography variant="body1" style={{ marginRight: 16 }}>
              {isHelpLocked ? "Help is On" : "Help is Off"}
            </Typography>
            <Switch
              checked={isHelpLocked}
              onChange={handleHelpToggle}
              color="primary"
              disabled={isHelpLocked}
            />
          </div>
        </div>
      </Popover>
    </Grid>
  );
}

export default CodeAssessmentNavbar;
