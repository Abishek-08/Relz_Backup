import {
  ADD_CATEGORY_URL,
  ADD_CODING_QUESTION_URL,
  ADD_LANGUAGE_URL,
  DELETE_CODING_QUESTION_URL,
  GET_ALL_CATEGORY,
  GET_ALL_CODING_QUESTION_URL,
  GET_ALL_LANGUAGE_URL,
  GET_CODING_QUESTION_URL,
  QUESTION_FILTER_BY_CATEGORY,
  QUESTION_FILTER_BY_LANGUAGE,
  QUESTION_FILTER_BY_LEVEL,
  REFERENCE_DOCUMENT_URL,
  SKILL_BASE_URL,
  UPDATE_CODING_QUESTION_URL,
} from "../../../constants/skill_assessment_constants/APIConstants";
import axiosInstance from "../../axiosInstance";

const fetchLanguages = () => {
  return axiosInstance.get(
    `${SKILL_BASE_URL}` + GET_ALL_LANGUAGE_URL
  );
};

const fetchCategories = () => {
  return axiosInstance.get(
    `${SKILL_BASE_URL}` + GET_ALL_CATEGORY
  );
};

const addLanguage = (data) => {
  return axiosInstance.post(
    `${SKILL_BASE_URL}` + ADD_LANGUAGE_URL,
    data
  );
};

const addCategory = (data) => {
  return axiosInstance.post(
    `${SKILL_BASE_URL}` + ADD_CATEGORY_URL,
    data
  );
};

const uploadCodingQuestion = (formData) => {
  return axiosInstance.post(
    `${SKILL_BASE_URL}` + ADD_CODING_QUESTION_URL,
    formData
  );
};

const getReferenceDocumentUrl = () => {
  return `${SKILL_BASE_URL}` + REFERENCE_DOCUMENT_URL;
};

const getCodingQuestion = (questionId) => {
  return axiosInstance.get(
    `${SKILL_BASE_URL}` +
      GET_CODING_QUESTION_URL +
      questionId
  );
};

const deleteCodingQuestion = (questionId) => {
  return axiosInstance.delete(
    `${SKILL_BASE_URL}` +
      DELETE_CODING_QUESTION_URL +
      questionId
  );
};

const getAllCodingQuestion = () => {
  return axiosInstance.get(
    `${SKILL_BASE_URL}` + GET_ALL_CODING_QUESTION_URL
  );
};

const updateCodingQuestion = (data) => {
  return axiosInstance.put(
    `${SKILL_BASE_URL}` + UPDATE_CODING_QUESTION_URL,
    data
  );
};

const filterByLanguage = (languageId) => {
  return axiosInstance.get(
    `${SKILL_BASE_URL}${QUESTION_FILTER_BY_LANGUAGE}/${languageId}`
  );
};

const filterByCategory = (categoryId) => {
  return axiosInstance.get(
    `${SKILL_BASE_URL}${QUESTION_FILTER_BY_CATEGORY}/${categoryId}`
  );
};

const filterByLevel = (categoryId, level) => {
  return axiosInstance.get(
    `${SKILL_BASE_URL}${QUESTION_FILTER_BY_LEVEL}/${categoryId}/${level}`
  );
};

export {
  addCategory,
  addLanguage,
  deleteCodingQuestion,
  fetchCategories,
  fetchLanguages,
  filterByCategory,
  filterByLanguage,
  filterByLevel,
  getAllCodingQuestion,
  getCodingQuestion,
  getReferenceDocumentUrl,
  updateCodingQuestion,
  uploadCodingQuestion,
};
