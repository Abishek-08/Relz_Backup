import { Card, CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  answerMultiQuestion,
  answerQuestion,
  clearAnswer,
  nextQuestion,
  previousQuestion,
  setCurrentQuestionIndex,
  toggleFlag,
} from "../../../redux/actions/learning_assesment_actions/Action";

import PropagateLoader from "react-spinners/PropagateLoader";

import { faFlag, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/learning_assessment_styles/LearningAssessmentEngineMain.css";
import useFullScreen from "../../user_module_components/Proctoring/useFullScreen";
import LearningAssessmentEngineNavbar from "./LearningAssessmentEngineNavigation";
import useTabSwitchCounter from "../../user_module_components/Proctoring/useTabSwitchCounter";
import { setAllowedViolations } from "../../../redux/actions/user_module_actions/ProctoringAction";
import { getProctoring } from "../../../services/user_module_service/Proctoring";
import ViolationModal from "../../user_module_components/Proctoring/ViolationModal";
import useCopyPaste from "../../user_module_components/Proctoring/useCopyPaste";

/**
 *
 * @author Durgesh Nandhini
 * @since 11-07-2024
 *
 */

const LearningAssessmentEngineMain = () => {

  // Here, the questions 
  const questions = useSelector((state) => state.quizEngine.questions);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [isCountingActive, setIsCountingActive] = useState(false);
  const [isCopyActive, setIsCopyActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  useTabSwitchCounter(isCountingActive, setModalOpen);
  useCopyPaste(isCopyActive, setModalOpen);

  //Proctoring
  useEffect(() => {
    const loadProctoring = async () => {
      const assessmentData = JSON.parse(
        localStorage.getItem("assessmentData") || "{}"
      );
      if (assessmentData.assessmentId) {
        await getProctoring(assessmentData.assessmentId)
          .then((res) => {
            console.log(res);
            if (res.violationCount || res.copyPasteWarning) {
              localStorage.setItem("proctoringEnable", true);
            } else {
              localStorage.setItem("proctoringEnable", false);
            }
            dispatch(setAllowedViolations(res.violationCount));
            setIsCountingActive(res.tabSwitchingWarning);
            setIsCopyActive(res.copyPasteWarning);
          })
          .catch(() => {
            localStorage.setItem("proctoringEnable", false);
            console.log("Error in fetching proctoring data");
          });
      }
    };
    loadProctoring();
  }, [dispatch, modalOpen]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [topicName, setTopicName] = useState("");
  const [completionStatus, setCompletionStatus] = useState("Not Yet Completed");
  const [progressPercentage, setProgressPercentage] = useState(0);

  //Proctoring
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullScreen();

  const currentQuestionIndex = useSelector(
    (state) => state.quizEngine.currentQuestionIndex
  );
  const selectedAnswers = useSelector(
    (state) => state.quizEngine.selectedAnswers
  );
  const flaggedQuestions = useSelector(
    (state) => state.quizEngine.flaggedQuestions
  );

  // to prevent from back option
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Required by some browsers
    };

    const handlePopState = (event) => {
      event.preventDefault(); // Prevent navigation
      window.history.pushState(null, "", window.location.href); // Reset to current URL
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const question = questions[0];
      setTopicName(question.topicName);
    }
  }, [questions]);

  useEffect(() => {
    localStorage.setItem("topicName", topicName);
  }, [topicName]);

  const warningOptions = () => {
    toast.warning("You have exceed Maximum limit of Selecting the options");
  };

  useEffect(() => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      setCurrentQuestion(currentQuestionIndex);
    } else {
      setCurrentQuestion(0); // or handle it as appropriate
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    const completedCount = Object.keys(selectedAnswers).length;
    const totalQuestions = questions.length;
    const percentage = (completedCount / totalQuestions) * 100;
    setProgressPercentage(percentage.toFixed(0) || 0);

    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      const question = questions[currentQuestion];
      const status = selectedAnswers.hasOwnProperty(question.questionId)
        ? "Answered"
        : "Not Yet Answered";
      setCompletionStatus(status);
    }
  }, [currentQuestion, selectedAnswers, questions]);

  const toggleFlagHandler = (questionId) => {
    dispatch(toggleFlag(questionId));
  };

  useEffect(() => {
    const filteredQuestions = questions.find((q) => q.topicName);
    setTopicName(filteredQuestions ? filteredQuestions.topicName : "null");
  }, [questions]);

  /**
   * 
   * This fuction is to manage the answers which is selected by the user and
   * store it in the redux store.
   * 
   */

  const handleAnswer = (questionId, index, optionContent, mark) => {
    if (questions[currentQuestion].questionType === "SSQ") {
      dispatch(answerQuestion(questionId, index, optionContent, mark));
    } else
      if (questions[currentQuestion].questionType === "MSQ") {
        let updatedAnswer = [...(selectedAnswers[questionId] || [])];
        const answerIndex = updatedAnswer.indexOf(optionContent);

        // Check if the option is already selected
        const isSelected = answerIndex !== -1;

        // Toggle selection
        if (isSelected) {
          return;
        } else {
          // We are keeping certain condition for MSQ type questions, that is they can select only max of 3 options
          if (updatedAnswer.length >= 3) {
            warningOptions(); // If the user try to select more than 3 option it shows the warning to the user
            return; // Exit early without updating state
          }
          updatedAnswer.push(optionContent);
        }

        dispatch(answerMultiQuestion(questionId, updatedAnswer, mark));
      }
  };

  /**
  * 
  * This function is the to clear the answers selected for the questions
  * 
  */

  const handleClearAnswer = (questionId) => {
    dispatch(clearAnswer(questionId));
  };

  /**
   * 
   * This function is the to move to the questions using the question navigation
   * 
   */

  const goToQuestion = (index) => {
    dispatch(setCurrentQuestionIndex(index));
    setCurrentQuestion(index);
  };

  /**
   * 
   * This function is to move to next question from the current question
   * 
   */

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      if (!isFullscreen || isFullscreen) {
        enterFullscreen();
      } else {
        exitFullscreen();
      }
      dispatch(nextQuestion());
    } else {
      navigate("/preview");
    }
  };

  /**
   * 
   * This function is to move to previous question from the current question
   * 
   */

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      if (!isFullscreen || isFullscreen) {
        enterFullscreen();
      } else {
        exitFullscreen();
      }
      dispatch(previousQuestion());
    }
  };

  /**
   * 
   * This hook is to use the keys for moving right and left
   * that means to move from question to question 
   * Previous or next
   * 
   */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 37) {
        // Left arrow key
        handlePreviousQuestion();
      } else if (event.keyCode === 39) {
        // Right arrow key
        handleNextQuestion();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePreviousQuestion, handleNextQuestion]);

  /**
   * 
   * This const values are created to count the number of questions attempted
   * number of questions not attempted,
   * number of flagged question which are attempted
   * number of flagges questions which are not attempted
   * 
   */

  const attemptedQuestionsCount = Object.keys(selectedAnswers).length;
  const notAttemptedQuestionsCount = questions.length - attemptedQuestionsCount;
  const flaggedQuestionsCount = Object.keys(flaggedQuestions).filter(
    (questionId) => flaggedQuestions[questionId] === true
  ).length;

  const flaggedAttemptedQuestionsCount = Object.keys(selectedAnswers).filter(
    (questionId) => flaggedQuestions[questionId] === true
  ).length;

  const flaggedNotAttemptedQuestionsCount = flaggedQuestionsCount - flaggedAttemptedQuestionsCount;

  const adjustedAttemptedQuestionsCount = attemptedQuestionsCount - flaggedAttemptedQuestionsCount;
  const notAttemptedNotFlaggedQuestionsCount = notAttemptedQuestionsCount - flaggedNotAttemptedQuestionsCount;

  /**
   * 
   * This is gif when there is no questions to show
   * 
   */

  if (
    !questions ||
    questions.length === 0 ||
    currentQuestionIndex < -1 ||
    currentQuestionIndex >= questions.length
  ) {
    return (
      <div>
        <h1>There are no questions</h1>
        <>
          <PropagateLoader
            color="#08168c"
            cssOverride={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
            size={20}
          />
        </>
        <div
          style={{
            marginTop: "-300px",
            fontFamily: "Verdana",
          }}
        >
          <center>
            {" "}
            <h2>Question Loading...</h2>
          </center>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  /** 
   * 
   * This function is to render the options based on the question
   * If the given question is SSQ (single selector question) then the radio button should be shown
   * If the given question is MSQ (multi-selector question) then the checkbox should be shown
   * 
   */

  const renderOptions = () => {
    return (
      <div>
        {currentQuestionData.optionContents.map((option, index) => {
          const isChecked = selectedAnswers[currentQuestionData.questionId]?.includes(option) || false;
          return (
            <Card
              id="learning-engine-option-card"
              key={index}
              variant="outlined"
              style={{
                transition: 'background-color 0.3s',
                backgroundColor:
                  questions[currentQuestion].questionType === "SSQ"
                    ? selectedAnswers[currentQuestionData.questionId] === option
                      ? "#ADD8E6"
                      : "#f0f0f0"
                    : isChecked
                      ? "#ADD8E6"
                      : "#f0f0f0",
              }}

              onClick={() =>
                handleAnswer(
                  currentQuestionData.questionId,
                  index,
                  option,
                  currentQuestionData.mark
                )
              }
            >
              <CardContent style={{ flex: 1, padding: '10px' }}>
                <Typography variant="body1">
                  {" "}
                  {currentQuestionData.questionType === "SSQ" ? (
                    <input
                      className="learning-engine-exam-option-ssq-radio"
                      type="radio"
                      id={`option-${index}`}
                      name={`answer-${currentQuestionData.questionId}`}
                      value={option}
                      onChange={() =>
                        handleAnswer(
                          currentQuestionData.questionId,
                          index,
                          option,
                          currentQuestionData.mark
                        )
                      }
                      checked={
                        selectedAnswers[currentQuestionData.questionId] === option
                      }
                    />
                  ) : (
                    <input
                      className="learning-engine-exam-option-msq-checkbox"
                      type="checkbox"
                      id={`option-${index}`}
                      name={`answer-${currentQuestionData.questionId}`}
                      value={option}
                      onChange={() =>
                        handleAnswer(
                          currentQuestionData.questionId,
                          index,
                          option,
                          currentQuestionData.mark
                        )
                      }
                      checked={isChecked}
                    />
                  )}{" "}
                  {option}
                </Typography>
              </CardContent>
            </Card>
          )
        })}
      </div>
    );
  };

  return (
    <div id="learning-engine-exam-screen">
      <ToastContainer />
      <ViolationModal open={modalOpen} onClose={handleCloseModal} />
      <Grid container spacing={3} id="learning-engine-container-main">
        <Grid item xs={12}>
          <div className="learning-engine-progress-bar-container">
            <>
              <p className="learning-engine-progress-bar-value">
                {progressPercentage}%
              </p>
              <p className="learning-engine-progress-bar-value-name">
                Completion Percentage
              </p>

              <div className="learning-engine-progress mt-0">
                <div
                  className="learning-engine-progress-bar"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </>
          </div>
        </Grid>
        <Grid container item xs id="learning-engine-status-container">
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs>
                  <Typography variant="body1" align="center">
                    <span className="learning-status-indicator answered"></span>
                    <span className="learning-status-count">{adjustedAttemptedQuestionsCount}</span>
                    <span className="learning-status-text">Attempted</span>
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" align="center">
                    <span className="learning-status-indicator not-attempted"></span>
                    <span className="learning-status-count">{notAttemptedNotFlaggedQuestionsCount}</span>
                    <span className="learning-status-text">Not Attempted</span>
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" align="center">
                    <span className="learning-status-indicator answered flagged"></span>
                    <span className="learning-status-count">{flaggedAttemptedQuestionsCount}</span>
                    <span className="learning-status-text">Attempted & Flagged</span>
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" align="center">
                    <span className="learning-status-indicator not-attempted flagged"></span>
                    <span className="learning-status-count">{flaggedNotAttemptedQuestionsCount}</span>
                    <span className="learning-status-text">Not Attempted & Flagged</span>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Navigation and Question Status */}
        <Grid item xs={12} lg={2} id="learning-engine-screen-main">
          <div id="learning-engine-quiz-navigation">
            <LearningAssessmentEngineNavbar
              questions={questions}
              selectedAnswers={selectedAnswers}
              flaggedQuestions={flaggedQuestions}
              toggleFlag={toggleFlagHandler}
              navigateToQuestion={goToQuestion}
              completionStatus={completionStatus}
              setCurrentQuestion={setCurrentQuestion}
              currentQuestionIndex={currentQuestionIndex}
            />
          </div>
        </Grid>
        <Grid item xs={12} lg={1} id="learning-engine-screen-main">
          <div id="learning-engine-question-status">
            <div className="ml-3" id="learning-engine-question-details">
              <h6>Question: {currentQuestion + 1}</h6>
              <h6
                style={{
                  color: completionStatus === "Answered" ? "#008000" : "",
                  fontWeight: completionStatus === "Answered" ? "bold" : "",
                }}
              >
                {completionStatus}
              </h6>
              <h6>Marked Out of {currentQuestionData.mark}.00</h6>
              <h6 className="learning-engine-flag-action">
                {flaggedQuestions[currentQuestionData.questionId] ? (
                  <FontAwesomeIcon
                    icon={faFlagCheckered}
                    color="red"
                    onClick={() =>
                      toggleFlagHandler(currentQuestionData.questionId)
                    }
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faFlag}
                    color="gray"
                    onClick={() =>
                      toggleFlagHandler(currentQuestionData.questionId)
                    }
                  />
                )}
                <button
                  id="learning-engine-flag-question-button"
                  onClick={() =>
                    toggleFlagHandler(currentQuestionData.questionId)
                  }
                >
                  {flaggedQuestions[currentQuestionData.questionId]
                    ? "Unflag"
                    : " Flag"}{" "}
                  Question
                </button>
              </h6>
            </div>
          </div>
        </Grid>

        {/* Main Question and Options */}
        <Grid item xs={12} lg={8} id="learning-engine-screen-main">
          <div id="learning-engine-quiz-content">
            <div id="learning-engine-quiz-main">
              <p id="learning-engine-quiz-question" style={{ marginLeft: 0 }}>
                {currentQuestion + 1}. {currentQuestionData.content}
              </p>
              <form id="learning-engine-exam-options">{renderOptions()}</form>
              <div>
                <Button
                  className="learning-engine-clear-answer-button"
                  onClick={() =>
                    handleClearAnswer(currentQuestionData.questionId)
                  }
                >
                  Clear Answer
                </Button>
              </div>
            </div>
          </div>
          <Grid xs={12}>
            <div>
              <Button
                id="learning-engine-next-buttons"
                onClick={handleNextQuestion}
              >
                {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
              </Button>
              <Button
                id="learning-engine-previous-buttons"
                className="btn mx-2"
                onClick={handlePreviousQuestion}
              >
                Previous
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default LearningAssessmentEngineMain;
