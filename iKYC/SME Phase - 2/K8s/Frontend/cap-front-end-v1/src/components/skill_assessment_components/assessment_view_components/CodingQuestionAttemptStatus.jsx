import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getCurrentLanguageSkeleton,
  getSkillAssessmentQuestions,
  resetCurrentLanguageSkeleton,
} from "../../../redux/actions/skill_assessment_actions/assessment_views_actions/CodingAssessmentAction";
import { getCodeAssessmentQuestions, resetCodeAssessmentQuestions } from "../../../redux/actions/skill_assessment_actions/coding_question_actions/CodeAssessmentAction";
import { setProctoring } from "../../../redux/actions/user_module_actions/ProctoringAction";
import { submitCode } from "../../../services/skill_assessment_services/assessment_view_services/AssessmentViewService";
import { setGenuinity } from "../../../services/user_module_service/GenuinityService";
import "../../../styles/skill_assessment_styles/assessment_view_styles/CodingQuestionAttemptStatus.css";
import useFullScreen from "../../user_module_components/Proctoring/useFullScreen";
import FinalAssessmentAlert from "./FinalAssessmentAlert";
import SkillAssessmentNavbar from "./SkillAssessmentNavbar";

const CodingQuestionAttemptStatus = () => {
  // Proctoring
  const { isFullscreen, enterFullscreen } = useFullScreen();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questions = useSelector((state) => state.skillQuestion.questions);
  const [open, setOpen] = useState(false);
  const [requestFlag, setRequestFlag] = useState(false);
  const attemptId = parseInt(localStorage.getItem("attemptId"));
  const startTime = parseInt(sessionStorage.getItem("startTime"));
  const [series, setSeries] = useState([]);
  var attemptedCount = 0;
  var notAttemptedCount = 0;
  const palette = ["#28a745", "#e80932"];
  questions.forEach((question) => {
    question.codingQuestionSkeletonDtos.forEach((item) => {
      if (item.languageName === localStorage.getItem(question.questionId)) {
        item.codeSkeleton ===
          localStorage.getItem(question.questionId + "_" + item.languageName)
          ? notAttemptedCount++
          : attemptedCount++;
      }
    });
  });
  // Proctoring code starts here
  const switchCount = useSelector((state) => state.proctoring?.tabSwitch ?? 0);
  const copyPasteCount = useSelector(
    (state) => state.proctoring?.copyPaste ?? 0
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

  useEffect(() => {
    if (
      localStorage.getItem("abruptStop") === "true" ||
      sessionStorage.getItem("TimesUp") === "true"
    ) {
      console.log("abrupt");
      setRequestFlag(true);
    }
  }, []);

  useEffect(() => {
    if (questions.length === 0) {
      navigate("/feedback");
    }
  }, [questions])

  //Proctoring ends here

  const handlePrevious = (question, index) => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen();
    }
    dispatch(getCodeAssessmentQuestions({ ...question, currentQuestion: index }));
    var language = localStorage.getItem(question.questionId);
    question.codingQuestionSkeletonDtos.forEach((item) =>
      item.languageName === language
        ? dispatch(getCurrentLanguageSkeleton(item))
        : ""
    );
    navigate("/codingassessmentpage");
  };

  const clearCodeHistory = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("codeHistory_")) {
        localStorage.removeItem(key);
      }
      if (key.startsWith("saveCount_")) {
        localStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    setSeries([
      {
        value: attemptedCount,
        label: "Attempted",
      },
      {
        value: notAttemptedCount,
        label: "Not Attempted",
      },
    ]);
  }, [attemptedCount, notAttemptedCount]);

  if (requestFlag) {
    const data = {
      attemptId: attemptId,
      completedTime: new Date().getTime(),
      startTime: startTime,
      codingResponseDtos: questions.map((question) => {
        var language = localStorage.getItem(question.questionId);
        return {
          questionId: question.questionId,
          code: localStorage.getItem(question.questionId + "_" + language),
          language: language,
        };
      }),
    };
    console.log(data);
    navigate("/feedback");
    submitCode(data)
      .then((res) => {
        console.log(res.data);
        handleGenuinity();
        console.log("working fine.....");
      })
      .catch((error) => {
        console.log("Error sending code", error);
      })
      .finally(() => {
        questions.forEach((question) => {
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(question.questionId)) {
              localStorage.removeItem(key);
            }
          });
        });
        localStorage.removeItem("attemptId");
        sessionStorage.removeItem("startTime");
        sessionStorage.removeItem("duration");
        sessionStorage.removeItem("TimesUp");
        localStorage.removeItem("isSkillAssessment");
        localStorage.removeItem("proctoringEnable");
        localStorage.removeItem("codeNotes");
        dispatch(getSkillAssessmentQuestions([]));
        dispatch(resetCurrentLanguageSkeleton());
        dispatch(resetCodeAssessmentQuestions());
        clearCodeHistory();
        dispatch(setProctoring());
        setRequestFlag(false);
      });
  }
  // genuinity calc starts here
  const handleGenuinity = () => {
    const proctoringStatus = JSON.parse(
      localStorage.getItem("proctoringEnable")
    );
    console.log(proctoringStatus);
    if (proctoringStatus) {
      setGenuinity(genuinity);
      console.log("proctoring working fine.....");
      if (localStorage.getItem("abruptStop") === "true") {
        questions.forEach((question) => {
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(question.questionId)) {
              localStorage.removeItem(key);
            }
          });
        });
        localStorage.removeItem("proctoringEnable");
        localStorage.removeItem("attemptId");
        localStorage.removeItem("userType");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("jwt");
        localStorage.removeItem("abruptStop");
        localStorage.removeItem("isSkillAssessment");
        sessionStorage.removeItem("TimesUp");
        sessionStorage.clear();
        dispatch(getSkillAssessmentQuestions([]));
        dispatch(resetCurrentLanguageSkeleton());
        dispatch(resetCodeAssessmentQuestions());
        dispatch(setProctoring());
        setRequestFlag(false);
        navigate("/login")
      }
    }
  };
  //  genuinity calc ends here
  const handleSubmit = (e) => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen();
    }
    e.preventDefault();
    setOpen(true);
  };

  const renderAttemptedStatus = (question) => {
    let lang = localStorage.getItem(question.questionId);
    let code = "";
    question.codingQuestionSkeletonDtos.forEach((item) =>
      item.languageName === lang ? (code = item.codeSkeleton) : ""
    );

    if (code === localStorage.getItem(question.questionId + "_" + lang))
      return <span className="text-danger">Not Attempted</span>;
    else return <span className="text-success">Attempted</span>;
  };

  const renderTestResult = (question) => {
    let lang = localStorage.getItem(question.questionId);
    let testResult = JSON.parse(
      localStorage.getItem(question.questionId + "_" + lang + "_run")
    );
    if (testResult !== null) {
      if (testResult.wasSuccessful) {
        return (
          <span className="text-success">
            {testResult.testCount + "/" + testResult.testCount} Passed{" "}
            <TaskAltIcon />
          </span>
        );
      } else if (testResult.testCount === testResult.failureCount) {
        return (
          <span className="text-danger">
            {testResult.testCount + "/" + testResult.testCount} Failed{" "}
            <CancelIcon />
          </span>
        );
      } else if (
        testResult.testCount === 0 &&
        testResult.failureList.length > 0
      ) {
        return (
          <span className="text-danger">
            Error <CancelIcon />
          </span>
        );
      } else {
        return (
          <span className="text-warning">
            {testResult.testCount -
              testResult.failureCount +
              "/" +
              testResult.testCount}{" "}
            Passed <ErrorOutlineIcon />
          </span>
        );
      }
    } else {
      return <span className="text-danger">Not Executed</span>;
    }
  };

  return (
    <div>
      <Grid item xs={12} className="top-panel">
        <div className="fixed-navbar">
          <SkillAssessmentNavbar />
        </div>
      </Grid>
      <Typography
        variant="h4"
        textAlign={"center"}
        fontWeight={"500"}
        mt={2}
        sx={{
          textTransform: "camelcase",
          letterSpacing: "0.5x",
          color: "#112A46",
        }}
      >
        Skill Assessment Preview
      </Typography>
      <Grid container mt={2}>
        <Grid item xs={4} sx={{ height: "83vh", pt: 3 }}>
          <Typography variant="h6" fontWeight={"bold"} pl={5} my={2}>
            {
              JSON.parse(localStorage.getItem("assessmentData"))
                .assessmentName
            }
          </Typography>
          <Typography variant="h6" pl={5} my={2}>
            Date :{" "}
            {
              JSON.parse(localStorage.getItem("assessmentData"))
                .assessmentDate
            }
          </Typography>
          <Typography variant="h6" pl={5} my={2}>
            Duration:{" "}
            {JSON.parse(localStorage.getItem("assessmentData")).duration}{" "}
            minutes
          </Typography>
          <Typography variant="h6" pl={5} my={2}>
            Total Question : {questions.length}
          </Typography>
          <Box sx={{ py: 5, alignItems: "center" }}>
            <PieChart
              colors={palette}
              series={[
                {
                  data: series,
                },
              ]}
              width={450}
              height={200}
            />
          </Box>
          <div className="mx-auto px-5 mt-5">
            {/*Final submit button for finishing assessment */}
            <Button
              fullWidth
              id="skill_module_attempt_question_btn"
              onClick={handleSubmit}
            >
              Submit Assessment
            </Button>
          </div>
        </Grid>
        <Grid item xs={8} sx={{ overflowY: "auto", height: "83vh" }}>
          <Stack
            direction={"column"}
            spacing={3}
            mt={2}
            alignItems={"center"}
          >
            {questions.map((question, index) => (
              <Card
                key={index}
                elevation={12}
                id="skill_module_card_attempt"
                sx={{ width: "90%", px: 3 }}
              >
                <Grid container>
                  <Grid item xs={5} my={2}>
                    <Typography
                      variant="h6"
                      sx={{ wordBreak: "break-word" }}
                      mb={2}
                    >
                      {question.questionTitle}
                    </Typography>
                    <Typography>
                      {question.categoryName + ", " + question.level}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <div className="my-3">
                      {/* For knowing question attempted or not attempted status */}
                      <Typography my={1}>
                        Question Status : {renderAttemptedStatus(question)}
                      </Typography>
                      {/* For knowing sample test case has passed or failed */}
                      <Typography my={1}>
                        Sample Test status : {renderTestResult(question)}
                      </Typography>
                      {/* For displaying the user attempted coding language */}
                      <Typography my={1}>
                        Answered Language:{" "}
                        {localStorage.getItem(question.questionId)}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={3} my={4} textAlign={"end"}>
                    {/* For navigating to the respective question in the assessment */}
                    <Button
                      id="skill_module_attempt_question_btn"
                      onClick={() => handlePrevious(question, index)}
                    >
                      Go to Question
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
      {open && (
        <FinalAssessmentAlert
          open={open}
          setOpen={setOpen}
          setRequestFlag={setRequestFlag}
        />
      )}
    </div>
  );
};

export default CodingQuestionAttemptStatus;
