import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../styles/learning_assessment_styles/LearningEnginePreview.css";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "../../../assets/learning-module-assets/check-mark.png";
import ErrorIcon from "../../../assets/learning-module-assets/remove.png";
import {
  resetQuiz,
  setCurrentQuestionIndex,
} from "../../../redux/actions/learning_assesment_actions/Action";
import { setQuizCompleted } from "../../../redux/actions/learning_assesment_actions/Action";
import { evaluateLearningAssessment } from "../../../services/learning_assessment_service/EngineGetAllTypeQuestionService";
import ReplyIcon from "@mui/icons-material/Reply";
import useFullScreen from "../../user_module_components/Proctoring/useFullScreen";
import { setGenuinity } from "../../../services/user_module_service/GenuinityService";
import { setProctoring } from "../../../redux/actions/user_module_actions/ProctoringAction";
import ViolationModal from "../../user_module_components/Proctoring/ViolationModal";
import { updateUserStatus } from "../../../services/admin_module_services/UserService";

const LearningEnginePreview = () => {
  //Proctoring
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullScreen();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const questions = useSelector((state) => state.quizEngine.questions);
  const selectedAnswers = useSelector(
    (state) => state.quizEngine.selectedAnswers
  );
  const flaggedQuestions = useSelector(
    (state) => state.quizEngine.flaggedQuestions
  );

  const [completionStatuses, setCompletionStatuses] = useState({});
  const [open, setOpen] = React.useState(true);
  const [show, setShow] = useState(false);
  const [flaggedCount, setFlaggedCount] = useState(0);

  const [evaluation] = useState({
    selectedAnswer: selectedAnswers,
    userId: JSON.parse(localStorage.getItem("assessmentData")).userId,
    assessmentId: JSON.parse(localStorage.getItem("assessmentData"))
      .assessmentId,
    schedulingId: JSON.parse(localStorage.getItem("assessmentData"))
      .scheduledAssessmentId,
    type: JSON.parse(localStorage.getItem("assessmentData")).type,
    noOfQuestions: questions.length,
    topicName: localStorage.getItem("topicName"),
    questionContent: questions,
  });

  useEffect(() => {
    const statuses = {};
    questions.forEach((question) => {
      if (selectedAnswers[question.questionId]) {
        statuses[question.questionId] = "Completed";
      } else {
        statuses[question.questionId] = "Not Yet Completed";
      }
    });
    setCompletionStatuses(statuses);
  }, [questions, selectedAnswers]);

  useEffect(() => {
    const flaggedCount = Object.values(flaggedQuestions).filter(
      (value) => value === true
    ).length;
    setFlaggedCount(flaggedCount);
  }, [flaggedQuestions]);

  const goToQuestion = (index) => {
    if (!isFullscreen || isFullscreen) {
      enterFullscreen();
    }
    dispatch(setCurrentQuestionIndex(index));
    navigate("/knowledgeEngineScreen"); // Replace with your actual route
  };

  const handleReturn = () => {
    if (!isFullscreen) {
      enterFullscreen();
    }
    navigate("/knowledgeEngineScreen");
  };

  const switchCount = useSelector((state) => state.proctoring?.tabSwitch ?? 0);
  const copyPasteCount = useSelector(
    (state) => state.proctoring?.copyPaste ?? 0
  );
  const maxViolationCount = useSelector(
    (state) => state.proctoring?.allowedViolations ?? 0
  );

  let genuinity = {
    copyPaste: copyPasteCount,
    tabSwitch: switchCount,
    proctoring: {
      assessment: {
        assessmentId: JSON.parse(localStorage.getItem("assessmentData"))
          .assessmentId,
      },
    },
    scheduleAssessment: {
      schedulingId: JSON.parse(localStorage.getItem("assessmentData"))
        .scheduledAssessmentId,
    },
    user: {
      userId: JSON.parse(localStorage.getItem("assessmentData")).userId,
    },
  };

  // proctoring

  const [modalOpen, setModalOpen] = useState(false);
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const userId = user.userId;

  useEffect(() => {
    const handleSubmit = () => {
      const proctoringStatus = JSON.parse(
        localStorage.getItem("proctoringEnable")
      );
      console.log(proctoringStatus);
      if (proctoringStatus) {
        setGenuinity(genuinity);
        localStorage.removeItem("proctoringEnable");
      }
      evaluateLearningAssessment(evaluation);
      dispatch(resetQuiz());
      sessionStorage.removeItem("isTakeAssessment");
      sessionStorage.removeItem("timeLeft");
      localStorage.removeItem("timeLeft");
      localStorage.removeItem("topicId");
      localStorage.removeItem("topicName");
      localStorage.removeItem("quizStartTime");
      localStorage.removeItem("startTime");
      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("expiryTime");
      localStorage.removeItem("isShownAlert");
      // localStorage.removeItem("assessmentData");
      dispatch(setQuizCompleted());
      dispatch(setProctoring());

      updateUserStatus(userId, "INACTIVE").then((res) => {
        localStorage.clear();
        sessionStorage.clear();
      });
      if (isFullscreen || !isFullscreen) {
        enterFullscreen();
        setTimeout(() => {
          exitFullscreen();
        }, 2000);
        navigate("/feedback");
      }
    };
    console.log(
      maxViolationCount,
      switchCount,
      maxViolationCount,
      maxViolationCount > 0 && switchCount + copyPasteCount >= maxViolationCount
    );
    if (
      maxViolationCount > 0 &&
      switchCount + copyPasteCount >= maxViolationCount
    ) {
      localStorage.setItem("abruptStop", true);
      handleSubmit();
    }
  }, [
    copyPasteCount,
    dispatch,
    enterFullscreen,
    evaluation,
    exitFullscreen,
    genuinity,
    isFullscreen,
    maxViolationCount,
    navigate,
    switchCount,
    userId,
  ]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleResetQuiz = () => {
    const proctoringStatus = JSON.parse(
      localStorage.getItem("proctoringEnable")
    );
    console.log(proctoringStatus);
    if (proctoringStatus) {
      setGenuinity(genuinity);
      localStorage.removeItem("proctoringEnable");
    }
    evaluateLearningAssessment(evaluation);
    dispatch(resetQuiz());
    sessionStorage.removeItem("isTakeAssessment");
    sessionStorage.removeItem("timeLeft");
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("topicId");
    localStorage.removeItem("topicName");
    localStorage.removeItem("quizStartTime");
    localStorage.removeItem("startTime");
    localStorage.removeItem("expiryTime");
    localStorage.removeItem("selectedAnswers");
    localStorage.removeItem("isShownAlert");
    // localStorage.removeItem("assessmentData");
    dispatch(setQuizCompleted());
    dispatch(setProctoring());

    try {
      if (isFullscreen) {
        exitFullscreen();
        navigate("/feedback");
      } else {
        navigate("/feedback");
      }
    } catch (error) {
      console.log(error);
      navigate("/feedback");
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setOpen(true);
    setShow(true);
  };

  return (
    <div id="preview-container">
      <ViolationModal open={modalOpen} onClose={handleCloseModal} />
      <div id="preview-header">
        <h1>Knowledge Assessment Preview</h1>
      </div>
      <div id="preview-body">
        {questions.map((question, index) => (
          <div key={question.questionId} id="preview-question">
            <h5>
              Question No: {index + 1}{" "}
              {flaggedQuestions[question.questionId] ? "🚩" : ""}
            </h5>
            <br></br>
            <h6>
              {completionStatuses[question.questionId] === "Completed" ? (
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  sx={{
                    borderRadius: "15px",
                    fontWeight: "bold",
                    marginTop: "-3%",
                  }}
                >
                  <div className="me-2"> Answered</div>
                  <img
                    src={CheckIcon}
                    style={{ width: "20px", height: "20px" }}
                  ></img>
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{
                    borderRadius: "15px",
                    fontWeight: "bold",
                    marginTop: "-3%",
                  }}
                >
                  <div className="me-2"> Not Answered</div>
                  <img
                    src={ErrorIcon}
                    style={{ width: "20px", height: "20px" }}
                    alt="null"
                  />
                </Button>
              )}{" "}
            </h6>

            <h6>
              <i>
                <b>Marked Out of {question.mark}.00</b>
              </i>
            </h6>

            <Button
              style={{ marginLeft: "80%", marginTop: "-19%" }}
              variant="outlined"
              size="small"
              onClick={() => goToQuestion(index)}
            >
              <div className="me-2">
                Go to Question <ReplyIcon />
              </div>
            </Button>

            <h4>{question.content}</h4>
            {question.questionType === "SSQ" && (
              <ul id="answer-options">
                {question.optionContents.map((option, optIndex) => (
                  <li key={optIndex} id="answer-option">
                    <input
                      type="radio"
                      id={`${question.questionId}-${optIndex}`}
                      name={`preview-${question.questionId}`}
                      checked={selectedAnswers[question.questionId] === option}
                      readOnly
                    />
                    <label htmlFor={`${question.questionId}-${optIndex}`}>
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {question.questionType === "MSQ" && (
              <ul id="answer-options">
                {question.optionContents.map((option, optIndex) => (
                  <li key={optIndex} id="answer-option">
                    <input
                      type="checkbox"
                      id={`${question.questionId}-${optIndex}`}
                      name={`preview-${question.questionId}`}
                      checked={selectedAnswers[question.questionId]?.includes(
                        option
                      )}
                      readOnly
                    />
                    <label htmlFor={`${question.questionId}-${optIndex}`}>
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            )}

            <hr />
          </div>
        ))}
      </div>
      {/* Static Footer */}
      <footer id="learning-engine-preview-footer">
        <Button
          id="learning-engine-preview-footer-back-quiz-button"
          className="btn btn-sm"
          onClick={handleReturn}
        >
          Back to Assessment Screen
        </Button>
        <Button
          id="learning-engine-preview-footer-finish-quiz-button"
          className="btn btn-sm"
          onClick={handleShow}
        >
          Finish Attempt
        </Button>
      </footer>

      <Modal
        id="learning-assessment-landingPage"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        style={{ transition: "opacity 2.5s" }}
      >
        <Modal.Body>
          <div className="learning-quiz-modal-content">
            <p>⚠️Please double-check your answers before submitting.</p>
            {flaggedCount > 0 && (
              <p>
                <b className="text-danger">
                  <b> You have {flaggedCount} 🚩 flagged question</b>
                  {flaggedCount > 1 ? "s" : ""}.
                </b>
              </p>
            )}
            <p>
              <b>Are you sure you want to submit your assessment?</b>
            </p>
            <div className="learning-modal-buttons">
              <button id="learning-modal-button-no" onClick={handleClose}>
                No
              </button>
              <button id="learning-modal-button-yes" onClick={handleResetQuiz}>
                Yes
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LearningEnginePreview;
