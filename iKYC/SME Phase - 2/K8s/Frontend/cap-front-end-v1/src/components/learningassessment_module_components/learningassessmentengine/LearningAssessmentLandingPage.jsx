import React, { useEffect, useState } from "react";
import "../../../styles/learning_assessment_styles/LearningAssessmentLandingPage.css";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { Card } from "@mui/material";
import { Toaster } from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  setLearningAssessmentDurationMinutes,
  learningAssessmentStartTime,
} from "../../../redux/actions/learning_assesment_actions/Action";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import moment from "moment";
import { Parser } from "html-to-react";
import {
  addCompletionStatus,
  getAllTypeQuestions,
} from "../../../services/learning_assessment_service/EngineGetAllTypeQuestionService";
import { loadQuestions } from "../../../redux/actions/learning_assesment_actions/Action";
import QuizIcon from "@mui/icons-material/Quiz";
import useFullScreen from "../../user_module_components/Proctoring/useFullScreen";

const LearningAssessmentLandingPage = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [duration, setDuration] = useState();
  const [learningInstructions, setLearningInstructions] = useState("");
  const [learningAssessmentName, setLearningAssessmentName] = useState("");
  const [timeUntilStart, setTimeUntilStart] = useState(null);
  const [show, setShow] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  //Proctoring
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullScreen();

  useEffect(() => {
    const response = JSON.parse(localStorage.getItem("assessmentData"));

    setDuration(response.duration);
    setLearningInstructions(response.assessmentInstruction);
    setLearningAssessmentName(response.assessmentName);
    dispatch(setLearningAssessmentDurationMinutes(response.duration));
    dispatch(learningAssessmentStartTime(response.startTime));

    const assessmentStartTime = moment(response.startTime, "h:mm A");
    const endTime = assessmentStartTime.clone().add(15, "minutes");

    const updateTimer = () => {
      const currentTime = moment();
      const duration = moment.duration(assessmentStartTime.diff(currentTime));
      const hours = Math.floor(duration.asHours());
      const minutes = Math.floor(duration.asMinutes()) % 60;
      const seconds = Math.floor(duration.asSeconds()) % 60;

      if (duration.asMilliseconds() <= 0) {
        setTimeUntilStart(null);
      } else {
        const timeString = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        setTimeUntilStart(timeString);
      }

      // Enable or disable the button based on the current time
      if (currentTime.isBetween(assessmentStartTime, endTime)) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [dispatch]);

  const assessmentDurationMinutes = useSelector(
    (state) => state.quizEngine.assessmentDurationMinutes
  );

  const handleStartAttempt = async () => {
    sessionStorage.setItem("isTakeAssessment", true);
    const res = await getAllTypeQuestions(
      JSON.parse(localStorage.getItem("assessmentData")).assessmentId,
      JSON.parse(localStorage.getItem("assessmentData")).type
    );

    const response = await addCompletionStatus(
      JSON.parse(localStorage.getItem("assessmentData")).scheduledAssessmentId,
      JSON.parse(localStorage.getItem("assessmentData")).userId
    );

    console.log("question Loading");
    dispatch(loadQuestions(res));
    //Proctoring Full screen
    if (!isFullscreen || isFullscreen) {
      enterFullscreen();
      navigate("/knowledgeEngineScreen");
    } else {
      exitFullscreen();
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setOpen(true);
    setShow(true);
  };

  return (
    <Card id="learning-assessment-landing-container" elevation={3} sx={{}}>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="learning-header-container">
        <h1>
          <QuizIcon id="learning-quizicon" />
          {learningAssessmentName}
        </h1>
      </div>
      <div id="learning-landing-remaining-timer-div">
        {timeUntilStart && (
          <div id="learning-landing-remaining-timer">
            <label style={{ color: "#04264a", fontWeight: "bold" }}>
              Assessment Starts in:
            </label>{" "}
            {timeUntilStart}
          </div>
        )}
      </div>

      <div id="learning-duration-container">
        <Tooltip
          title="Total Duration"
          placement="top"
          className="Learning-assessment-tooltips"
        >
          <AccessAlarmsIcon id="learning-timealaram" /> {duration} Minutes
        </Tooltip>
      </div>

      <h5 id="learning-guidelines-header">
        📝<span>Assessment Guidelines</span>
      </h5>

      {Parser().parse(learningInstructions)}

      {sessionStorage.getItem("isTakeAssessment") ? (
        <h6>
          <Button
            onClick={() => {
              if (!isFullscreen) {
                enterFullscreen();
                navigate("/knowledgeEngineScreen");
              } else {
                exitFullscreen();
              }
            }}
            id="learning-assessment-landingpage-startAttempt"
          >
            Continue Assessment
          </Button>
        </h6>
      ) : (
        <>
          <Button
            onClick={handleShow}
            id="learning-assessment-landingpage-startAttempt"
            disabled={!isButtonEnabled}
          >
            Start Assessment
          </Button>
        </>
      )}

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
            <p>
              ⚠️ Please note that your assessment has a time limit of{" "}
              {assessmentDurationMinutes} minutes. Time will count from the
              moment you start your assessment
            </p>
            <p>
              <b>Are you sure that you wish to start now?</b>
            </p>
            <div className="learning-modal-buttons">
              <Button id="learning-modal-button-no" onClick={handleClose}>
                No
              </Button>
              <Button
                id="learning-modal-button-yes"
                onClick={handleStartAttempt}
                disabled={!isButtonEnabled}
              >
                Yes
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default LearningAssessmentLandingPage;
