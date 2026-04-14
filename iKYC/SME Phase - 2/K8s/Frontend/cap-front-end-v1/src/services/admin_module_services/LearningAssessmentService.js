import {
  ADMIN,
  ASSESSMENT,
  LEVEL_THREE_ASSESSMENT,
  LEVEL_ZERRO_LEARNING_ASSESSMENT,
  MODERATE_LEARNING_ASSESSMENT,
  QUICK_LEARNING_ASSESSMENT,
} from "../../constants/admin_module_constants/APIConstants";
import axiosInstance from "../axiosInstance";

export const submitQuickAssessment = (quickAssessment) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}${ADMIN}${QUICK_LEARNING_ASSESSMENT}`,
      quickAssessment
    );
  } catch (error) {
    return error;
  }
};

export const submitModerateAssessment = (moderateAssessment) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}${ADMIN}${MODERATE_LEARNING_ASSESSMENT}`,
      moderateAssessment
    );
  } catch (error) {
    return error;
  }
};

export const PostLevelZeroAssessment = (LevelZeroAssessment) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}${ADMIN}${LEVEL_ZERRO_LEARNING_ASSESSMENT}`,
      LevelZeroAssessment
    );
  } catch (error) {
    return error;
  }
};

export const addLevelThreeLearningAssessment = (payload) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}${ADMIN}${LEVEL_THREE_ASSESSMENT}`,
      payload
    );
  } catch (error) {
    return error;
  }
};

export const getAllL0KnowledgeAssessment = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${ADMIN}${LEVEL_ZERRO_LEARNING_ASSESSMENT}`
    );
  } catch (error) {
    return error;
  }
};

export const getAllL1KnowledgeAssessment = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${ADMIN}${QUICK_LEARNING_ASSESSMENT}`
    );
  } catch (error) {
    return error;
  }
};

export const getAllL2KnowledgeAssessment = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${ADMIN}${MODERATE_LEARNING_ASSESSMENT}`
    );
  } catch (error) {
    return error;
  }
};

export const createAssessment = (data) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}${ADMIN}${ASSESSMENT}`,
      data
    );
  } catch (error) {
    return error;
  }
};
