import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import capLogo from "../../../assets/user-module-assets/Caplogo.png";
import "../../../styles/learning_assessment_styles/KnowledgeNavbar.css";
import { evaluateLearningAssessment } from "../../../services/learning_assessment_service/EngineGetAllTypeQuestionService";
import { setGenuinity } from "../../../services/user_module_service/GenuinityService";
import useFullScreen from "../../user_module_components/Proctoring/useFullScreen";
import {
  resetQuiz,
  setQuizCompleted,
} from "../../../redux/actions/learning_assesment_actions/Action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { setProctoring } from "../../../redux/actions/user_module_actions/ProctoringAction";

function KnowledgeAssessmentNavbar({ attempt, report, resultWaited }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hasAlertBeenShown, setHasAlertBeenShown] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [topicNameValue, setTopicNameValue] = useState("");
  const [alertMinute, setAlertMinute] = useState();
  const location = useLocation();

  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullScreen();

  const assessmentDurationMinutes = useSelector(
    (state) => state.quizEngine.assessmentDurationMinutes
  );
  const questions = useSelector((state) => state.quizEngine.questions);

  const selectedAnswers = useSelector(
    (state) => state.quizEngine.selectedAnswers
  );

  const getExpiryTime = () => {
    const storedExpiryTime = localStorage.getItem("expiryTime");
    if (storedExpiryTime) {
      return parseInt(storedExpiryTime, 10);
    } else {
      const newExpiryTime = Date.now() + assessmentDurationMinutes * 60 * 1000;
      localStorage.setItem("expiryTime", newExpiryTime);
      return newExpiryTime;
    }
  };

  console.log(enterFullscreen);

  const getStartTime = () => {
    const storedStartTime = localStorage.getItem("startTime");
    if (storedStartTime) {
      return parseInt(storedStartTime, 10);
    } else {
      const newStartTime = Date.now();
      localStorage.setItem("startTime", newStartTime);
      return newStartTime;
    }
  };

  useEffect(() => {
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  const [expiryTime, setExpiryTime] = useState(getExpiryTime());
  const [startTime, setStartTime] = useState(getStartTime());
  const getTotalDuration = () => assessmentDurationMinutes * 60 * 1000; // Total duration in milliseconds

  useEffect(() => {
    if (questions.length > 0) {
      const question = questions[0];
      console.log(question.topicName + "topicName");
      setTopicNameValue(question.topicName);
    }
  }, [questions]);

  useEffect(() => {
    // Update the evaluation object whenever selectedAnswers or other dependencies change
    setEvaluation((prevEvaluation) => ({
      ...prevEvaluation,
      selectedAnswer: selectedAnswers,
      topicName: topicNameValue,
    }));
  }, [selectedAnswers, questions, topicNameValue]);

  const [evaluation, setEvaluation] = useState({
    selectedAnswer: selectedAnswers || localStorage.setItem("selectedAnswers"),
    userId: JSON.parse(localStorage.getItem("assessmentData")).userId,
    assessmentId: JSON.parse(localStorage.getItem("assessmentData"))
      .assessmentId,
    schedulingId: JSON.parse(localStorage.getItem("assessmentData"))
      .scheduledAssessmentId,
    type: JSON.parse(localStorage.getItem("assessmentData")).type,
    noOfQuestions: questions.length,
    topicName: localStorage.getItem("topicName") || topicNameValue,
    questionContent: questions,
  });

  const switchCount = useSelector((state) => state.proctoring?.tabSwitch ?? 0);
  const copyPasteCount = useSelector(
    (state) => state.proctoring?.copyPaste ?? 0
  );

  const genuinity = {
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

  const handleWarning = (minutes) => {
    if (!hasAlertBeenShown) {
      setOpenModal(true);
      setAlertMinute(minutes);
      setHasAlertBeenShown(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleResetQuiz = async () => {
    try {
      const proctoringStatus = JSON.parse(
        localStorage.getItem("proctoringEnable")
      );

      console.log("Proctoring Status:", proctoringStatus);
      console.log("Evaluation Data:", evaluation);

      if (proctoringStatus) {
        await setGenuinity(genuinity);
        localStorage.removeItem("proctoringEnable");
      }
      await evaluateLearningAssessment(evaluation);
      dispatch(resetQuiz());
      sessionStorage.removeItem("isTakeAssessment");
      localStorage.removeItem("timeLeft");
      sessionStorage.removeItem("timeLeft");
      localStorage.removeItem("topicId");
      localStorage.removeItem("quizStartTime");
      localStorage.removeItem("startTime");
      localStorage.removeItem("topicName");
      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("expiryTime");
      localStorage.removeItem("isShownAlert");
      dispatch(setQuizCompleted());
      dispatch(setProctoring());

      if (isFullscreen) {
        exitFullscreen();
      }
      navigate("/feedback");
    } catch (error) {
      console.error("Error resetting quiz:", error);
    } finally {
      Swal.fire({
        title: "Your allotted time has elapsed",
        text: "Relax, the assessment data has been automatically submitted.Next time, remember to submit manually.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      handleResetQuiz();
      return null; // Do not render anything when completed
    } else {
      const isLessThan5Minutes = hours === 0 && minutes < 5;

      const isShownAlert = localStorage.getItem("isShownAlert");
      if (isLessThan5Minutes && !isShownAlert) {
        handleWarning(minutes);
        localStorage.setItem("isShownAlert", true);
      }

      const totalDuration = getTotalDuration(); // Total duration in milliseconds
      const elapsedTime = Date.now() - startTime; // Elapsed time in milliseconds
      const progress = (elapsedTime / totalDuration) * 100; // Percentage of elapsed time

      return (
        <div
          className={`knowledge-assessment-navbar-timer ${isLessThan5Minutes ? "blinking" : ""}`}
        >
          <Typography
            className={
              isLessThan5Minutes
                ? "knowledge-assessment-timer-blinking-text"
                : ""
            }
          >
            <FontAwesomeIcon icon={faClock} />{" "}
            {`${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
            <div
              className={`knowledge-navbar-progress-bar-container ${isLessThan5Minutes ? "blinking" : ""}`}
            >
              <div
                className={`knowledge-navbar-progress-bar ${
                  isLessThan5Minutes ? "blinking" : ""
                }`}
                style={{ width: `${100 - progress}%` }} // Reduce progress as time passes
              />
            </div>
          </Typography>
        </div>
      );
    }
  };

  useEffect(() => {
    setExpiryTime(getExpiryTime());
  }, [assessmentDurationMinutes]);

  const handleSubmit = () => {
    navigate("/preview");
  };

  const isKnowledgeExamScreen = location.pathname === "/knowledgeEngineScreen";

  return (
    <div id="knowledge-navbar-container">
      <ul id="knowledge-navbar-nav">
        <Grid item xs={4} container>
          <img
            src={capLogo}
            alt="cap_logo"
            style={{ width: "30px", height: "25px", marginLeft: "1%" }}
          />
          <div id="knowledge-code-heading">Knowledge Assessment</div>
        </Grid>
        {attempt ? (
          <Grid item xs={8} container justifyContent={"end"} mr={1}>
            <Button
              href="/codingassessmentpage"
              variant="outlined"
              style={{
                color: "white",
                borderColor: "white",
                backgroundColor: "transparent",
                marginTop: 2,
              }}
            >
              <ReplyIcon />
              Back
            </Button>
          </Grid>
        ) : report ? (
          <Grid item xs={8} container justifyContent={"end"} mr={1}>
            <Button
              href="/userdashboard"
              variant="outlined"
              style={{
                color: "white",
                borderColor: "white",
                backgroundColor: "transparent",
                marginTop: 2,
              }}
            >
              Go to Dashboard
            </Button>
          </Grid>
        ) : resultWaited ? (
          ""
        ) : (
          <>
            <Grid
              item
              xs={4}
              container
              justifyContent="center"
              alignContent={"center"}
            >
              <Countdown date={expiryTime} renderer={renderer} />
            </Grid>
            {isKnowledgeExamScreen && (
              <Grid item xs={4} container justifyContent="flex-end">
                <Button
                  variant="outlined"
                  style={{
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "transparent",
                  }}
                  id="knowledge_module_submit_btn"
                  onClick={handleSubmit}
                >
                  Preview
                </Button>
              </Grid>
            )}
          </>
        )}
      </ul>

      {/* Warning Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ position: "absolute", top: "20px", right: "20px" }}
      >
        <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
        <DialogContent>
          <Typography>
            You have only {`${alertMinute}`} more minutes left.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default KnowledgeAssessmentNavbar;
