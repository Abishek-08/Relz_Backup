import {
  FETCH_ASSESSMENT_REPORT_BY_SCHEDULING_ID,
  FETCH_SCORE_CARD_DETAILS_BY_SCHEDULING_ID,
} from "../../constants/knowledge_assessment_constants/APIConstants";
import { GET_GENUINITY_SCORE } from "../../constants/user_module_constants/APIConstants";
import axiosInstance from "../axiosInstance";


export const fetchAssessmentReport = async (schedulingId, userId) => {
  try {
    const response = await axiosInstance.get(
      `${FETCH_ASSESSMENT_REPORT_BY_SCHEDULING_ID}/${schedulingId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching assessment report:", error);
    throw error;
  }
};

export const fetchScorecardDetails = async (schedulingId, userId) => {
  try {
    const response = await axiosInstance.get(
      `${FETCH_SCORE_CARD_DETAILS_BY_SCHEDULING_ID}/${schedulingId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching scorecard details:", error);
    throw error;
  }
};

export const fetchProctorDetails = async (schedulingId, userId) => {
  try {
    const response = await axiosInstance.get(
      `${GET_GENUINITY_SCORE}/${schedulingId}/${userId}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching proctor details:", error);
    throw error;
  }
};
