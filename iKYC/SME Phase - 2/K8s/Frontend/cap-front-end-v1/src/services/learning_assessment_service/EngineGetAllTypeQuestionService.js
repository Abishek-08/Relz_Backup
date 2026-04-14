import {
  GET_ALL_KNOWLEDGE_ASSESSMENT_QUESTIONS_BY_ID_AND_TYPE,
  EVALUATE_KNOWLEDGE_ASSESSMENT_MARK,
  ADD_COMPLETION_STATUS,
} from "../../constants/knowledge_assessment_constants/APIConstants";
import axiosInstance from "../axiosInstance";


export const getAllTypeQuestions = async (assessmentId, type) => {
  try {
    const response = await axiosInstance.get(
      `${GET_ALL_KNOWLEDGE_ASSESSMENT_QUESTIONS_BY_ID_AND_TYPE}/${type}/${assessmentId}`
    );
    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching assessment questions:", error);
    throw error;
  }
};

export const addCompletionStatus = async (scheduleId, userId) => {
  try {
    const response = await axiosInstance.post(
      `${ADD_COMPLETION_STATUS}/${scheduleId}/${userId}`
    );
    console.log("API Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching assessment questions:", error);
    throw error;
  }
};

export const evaluateLearningAssessment = async (evaluation) => {
  try {
    console.log(evaluation);
    const response = await axiosInstance.post(
      `${EVALUATE_KNOWLEDGE_ASSESSMENT_MARK}`,
      evaluation
    );
    return response.data;
  } catch (error) {
    console.error("Error evaluating learning assessment:", error);
    throw error;
  }
};
