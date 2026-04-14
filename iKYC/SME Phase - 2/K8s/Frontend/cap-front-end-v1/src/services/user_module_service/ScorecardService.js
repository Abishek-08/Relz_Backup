import {
  GET_SKILL_SCORECARDS_API,
  GET_LEARNING_SCORECARDS_API,
  GET_GENUINITY_SCORE,
  GET_GENUINITY_SCORE_PERFORMANCE,
} from "../../constants/user_module_constants/APIConstants";
import axiosInstance from "../axiosInstance";

const getSkillScore = async (userId) => {
  const url = `${GET_SKILL_SCORECARDS_API}${userId}`;
  try {
    const response = await axiosInstance.get(url);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching skill assessments.");
  }
};

const getLearningScore = async (userId) => {
  const url = `${GET_LEARNING_SCORECARDS_API}${userId}`;
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw Error("Error fetching learning assessments.");
  }
};

/**
 * @author Srinivasan.S 12113
 * @since 30-07-2024
 */
const getGenuinityScore = async (schedulingId, userId) => {
  const url = `${GET_GENUINITY_SCORE}/${schedulingId}/${userId}`;
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw Error("Error fetching genuinity score.");
  }
};

const getGenunityPerformance = async (userId) => {
  console.log(userId, typeof userId);
  const url = `${GET_GENUINITY_SCORE_PERFORMANCE}${userId}`;
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching genunity scores .");
  }
};

export {
  getSkillScore,
  getLearningScore,
  getGenuinityScore,
  getGenunityPerformance,
};
