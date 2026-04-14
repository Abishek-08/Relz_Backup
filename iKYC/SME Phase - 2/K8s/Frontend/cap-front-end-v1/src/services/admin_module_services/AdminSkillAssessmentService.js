import {
  CATEGORY,
  CODING_REQUEST,
  EXISTING_REQUEST,
  GET_COUNT,
  LANGUAGE,
  REQUEST_DETAILS,
  SKILL_ASSESSMENT,
} from "../../constants/admin_module_constants/APIConstants";
import axiosInstance from "../axiosInstance";

export const validateQuestionCount = (
  languageId,
  categoryValue,
  complexity
) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}/skill${GET_COUNT}/${categoryValue}/${complexity}`
    );
  } catch (error) {
    return error;
  }
}; 

export const validateLangaugeQuestionCount = (languageId) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}/skill${GET_COUNT}/${languageId}`
    );
  } catch (error) {
    return error;
  }
};

export const validateCategoryQuestionCount = (categoryId) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}/skill/count/${categoryId}`
    );
  } catch (error) {
    return error;
  }
};

export const getQuestions = (skillAssessmentId) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}/admin${REQUEST_DETAILS}/${skillAssessmentId}`
    );
  } catch (error) {
    return error;
  }
};

export const addQuestionRequest = (request) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}/admin${CODING_REQUEST}`,
      request
    );
  } catch (error) {
    return error;
  }
};

export const getCategoryList = (languageId) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}/skill${CATEGORY}`
    );
  } catch (error) {
    return error;
  }
};

export const getLanguageList = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}/skill${LANGUAGE}`
    );
  } catch (error) {
    return error;
  }
};

export const deleteQuestion = (requestId) => {
  try {
    return axiosInstance.delete(
      `${process.env.REACT_APP_BASE_URL}${CODING_REQUEST}/${requestId}`
    );
  } catch (error) {
    return error;
  }
};

export const checkQuestionExistence = (
  count,
  level,
  categoryId,
  skillAssessmentId
) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${EXISTING_REQUEST}/${count}/${level}/${categoryId}/${skillAssessmentId}`
    );
  } catch (error) {
    return error;
  }
};

export const addSkillAssessment = (skillAssessment) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}/admin${SKILL_ASSESSMENT}`,
      skillAssessment
    );
  } catch (error) {
    return error;
  }
};

export const addSkillProctoring = (skillAssessmentData) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}/admin/skillassessment`,
      skillAssessmentData
    );
  } catch (error) {
    return error;
  }
};
