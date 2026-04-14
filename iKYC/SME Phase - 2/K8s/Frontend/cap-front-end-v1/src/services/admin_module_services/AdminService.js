import {
  ADD_BULK_USER,
  ASSESSMENT_NAME,
  BATCH_NAME,
  BATCH_URL,
  BATCH_USER,
  CAP_ADMIN,
  GET_SKILL_ASSESSMENTS,
  GET_UNMAPPED_USERS,
} from "../../constants/admin_module_constants/APIConstants";
import axiosInstance from "../axiosInstance";

export const addBatch = (data) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}${BATCH_URL}`,
      data
    );
  } catch (error) {
    return error;
  }
};

export const getBatchById = (batchId) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${BATCH_URL}/${batchId}`
    );
  } catch (error) {
    return error;
  }
};

export const updateBatch = (batchData) => {
  try {
    return axiosInstance.put(
      `${process.env.REACT_APP_BASE_URL}${BATCH_URL}`,
      batchData
    );
  } catch (error) {
    return error;
  }
};

export const getAllBatch = () => {
  try {
    return axiosInstance.get(`${process.env.REACT_APP_BASE_URL}${BATCH_URL}`);
  } catch (error) {
    return error;
  }
};

export const removeBatch = (batchId) => {
  try {
    return axiosInstance.delete(
      `${process.env.REACT_APP_BASE_URL}${BATCH_URL}/${batchId}`
    );
  } catch (error) {
    return error;
  }
};

export const checkBatchName = (batchName) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${BATCH_NAME}/${batchName}`
    );
  } catch (error) {
    return error;
  }
};

export const getAllSkillAssessments = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${GET_SKILL_ASSESSMENTS}`
    );
  } catch (error) {
    return error;
  }
};

export const checkBatchNameExists = (assessmentName) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${CAP_ADMIN}${ASSESSMENT_NAME}/${assessmentName}`
    );
  } catch (error) {
    return error;
  }
};

export const addBulkUsers = (data) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}${ADD_BULK_USER}`,
      data
    );
  } catch (error) {
    return error;
  }
};

// export const getAssessmentDetails = (data) => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_USER_BASE_URL}${GET_ALL_ASSESSMENTS}/${data}`
//     );
//   } catch (error) {
//     return error;
//   }
// };
