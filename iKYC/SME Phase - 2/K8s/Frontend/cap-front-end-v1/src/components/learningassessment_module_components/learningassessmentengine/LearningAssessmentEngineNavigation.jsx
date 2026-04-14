import React, { useEffect, useRef } from "react";
import "../../../styles/learning_assessment_styles/LearningAssessmentEngineNavbar.css";
import { Card, CardContent, Grid, Typography } from "@mui/material";

/**
 *
 * @author Logesh Karthik, Durgesh Nandhini
 * @since 11-07-2024
 *
 */

const LearningAssessmentEngineNavbar = ({
  questions,
  selectedAnswers,
  flaggedQuestions,
  navigateToQuestion,
  currentQuestionIndex, // Add this prop
}) => {
  const currentIndexRef = useRef(currentQuestionIndex);

  useEffect(() => {
    currentIndexRef.current = currentQuestionIndex; // Update the ref when the currentQuestionIndex changes
  }, [currentQuestionIndex]);

  // const attemptedQuestionsCount = Object.keys(selectedAnswers).length;
  // const notAttemptedQuestionsCount = questions.length - attemptedQuestionsCount;
  // const flaggedQuestionsCount = Object.keys(flaggedQuestions).length;

  // const flaggedAttemptedQuestionsCount = Object.keys(flaggedQuestions).filter(
  //   (questionId) => selectedAnswers.hasOwnProperty(questionId)
  // ).length;

  // const flaggedNotAttemptedQuestionsCount = flaggedQuestionsCount - flaggedAttemptedQuestionsCount;

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          moveHighlight(-1);
          break;
        case "ArrowRight":
          moveHighlight(1);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [questions]);

  const moveHighlight = (step) => {
    const newIndex = currentIndexRef.current + step;
    if (newIndex >= 0 && newIndex < questions.length) {
      navigateToQuestion(newIndex);
    }
  };

  return (
    <div className="learning-engine-quiz-navbar">
      <div className="learning-engine-navbar-scrollable-content">
        <p id="learning-engine-quiz-navbar-name">Question Navigation</p>
        <p id="learning-engine-quiz-number-counts">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>

        <div className="learning-engine-question-number-navbar">
          {questions.map((question, index) => {
            const isAnswered = selectedAnswers.hasOwnProperty(question.questionId);
            const completionPercentage = isAnswered ? "50%" : "0%";
            const buttonStyle = {
              background: `linear-gradient(to top, #27235c ${completionPercentage}, #ddd ${completionPercentage})`,
            };
            const buttonClassName = `learning-engine-quiz-navbar-navitem-label ${flaggedQuestions[question.questionId] ? "flagged" : ""
              } ${isAnswered ? "answered" : ""} ${currentQuestionIndex === index ? "highlighted" : ""
              }`;

            return (
              <div key={index} id="learning-engine-quiz-navbar">
                <button
                  id="learning-engine-quiz-nav-button"
                  className={buttonClassName}
                  style={buttonStyle}
                  onClick={() => navigateToQuestion(index)}
                >
                  {index + 1}
                  {flaggedQuestions[question.questionId] && (
                    <div id="learning-engine-flag"></div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="learning-engine-navbar-static-content">
        <Grid container direction={"column"} id="learning-engine-status-container">
          <Card>
            <CardContent>
              <p>LEGENDS</p>
              <Grid container spacing={2}>
                <Grid item xs>
                  <Typography variant="body1" align="center">
                    <span className="status-indicator answered"></span>
                    <span className="status-count">{attemptedQuestionsCount}</span>
                    {" "} Attempted 
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" align="center">
                    <span className="status-indicator not-attempted"></span>
                    <span className="status-count">{notAttemptedQuestionsCount}</span>
                    {" "} <br></br>Not Attempted 
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" align="center">
                    <span className="status-indicator answered flagged"></span>
                    <span className="status-count">{flaggedAttemptedQuestionsCount}</span>
                    {" "} Attempted & Flagged 
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" align="center">
                    <span className="status-indicator not-attempted flagged"></span>
                    <span className="status-count">{flaggedNotAttemptedQuestionsCount}</span>
                    {" "} <br></br>Not Attempted & Flagged 
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </div> */}
    </div>
  );
};

export default LearningAssessmentEngineNavbar;
