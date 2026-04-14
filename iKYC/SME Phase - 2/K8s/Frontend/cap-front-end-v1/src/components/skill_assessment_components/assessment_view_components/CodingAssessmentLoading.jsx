import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import sessionStorage from "redux-persist/es/storage/session";
import {
  getCurrentLanguageSkeleton,
  getSkillAssessmentQuestions,
} from "../../../redux/actions/skill_assessment_actions/assessment_views_actions/CodingAssessmentAction";
import { getCodeAssessmentQuestions } from "../../../redux/actions/skill_assessment_actions/coding_question_actions/CodeAssessmentAction";
import {
  getAssessmentCodingQuestion,
  mapCodingQuestion,
} from "../../../services/skill_assessment_services/assessment_view_services/AssessmentViewService";

/**
 * @author sanjay.subramani
 * @since 11-07-2024
 * @version 1.0
 */

/**
 *
 * @author Sanjay khanna, Srinivasan S
 * @since 24-08-2024
 * @version 2.0
 */

const CodingAssessmentLoading = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [questionFlag, setQuestionFlag] = useState(false);
  var assessmentData = JSON.parse(localStorage.getItem("assessmentData"));
  var scheduledId = assessmentData.scheduledAssessmentId;
  var duration = assessmentData.duration;
  var userId = assessmentData.userId;
  const questions = useSelector(state => state.skillQuestion.questions)


  useEffect(() => {
    console.log(questions)
    if (questions.length > 0) {
      navigate("/codingassessmentpage")
    }
    else {
      setQuestionFlag(true)
    }
  }, [setQuestionFlag, navigate, questions]);
  
  if (questionFlag) {
    setQuestionFlag(false);
    console.log("check 0");
    mapCodingQuestion(userId, scheduledId)
      .then((response) => {
        console.log("check 1");
        console.log(response);
        localStorage.setItem("attemptId", response.data);
        getAssessmentCodingQuestion(response.data).then((res) => {
          console.log(res.data);
          dispatch(getSkillAssessmentQuestions(res.data));
          dispatch(
            getCodeAssessmentQuestions({ ...res.data[0], currentQuestion: 0 })
          );
          dispatch(
            getCurrentLanguageSkeleton({
              ...res.data[0].codingQuestionSkeletonDtos[0],
            })
          );
          res.data.forEach((item) => {
            localStorage.setItem(
              item.questionId,
              item.codingQuestionSkeletonDtos[0].languageName
            );
            item.codingQuestionSkeletonDtos.map((data) =>
              localStorage.setItem(
                item.questionId + "_" + data.languageName,
                data.codeSkeleton
              )
            );
          });
          sessionStorage.setItem("startTime", new Date().getTime());
          sessionStorage.setItem("duration", duration);
          navigate("/codingassessmentpage")
        });
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="position-fixed top-50  start-50 translate-middle">
      <RingLoader color="#25235c" loading={true} size={200} />
      <Typography variant="h5">Loading Questions...</Typography>
    </div>
  );
};

export default CodingAssessmentLoading;
