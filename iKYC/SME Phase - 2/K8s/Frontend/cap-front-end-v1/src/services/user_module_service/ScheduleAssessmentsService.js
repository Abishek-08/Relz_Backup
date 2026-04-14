import {
  SECHEDULED_LEARNING_ASSESSMENT,
  SECHEDULED_SKILL_ASSESSMENT,
  SECRET_KEY_VERIFICATION,
} from "../../constants/user_module_constants/APIConstants";

import axiosInstance from "../axiosInstance";

export const fetchLearningAssessments = async (email) => {
  console.log(email);
  try {
    const url = `${SECHEDULED_LEARNING_ASSESSMENT}?userEmail=${email}`;
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchSkillAssessments = async (userEmail) => {
  try {
    const url = `${SECHEDULED_SKILL_ASSESSMENT}${userEmail}`;
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifySecretKey = async (secretKey) => {
  try {
    const response = await axiosInstance
      .post(
        `${SECRET_KEY_VERIFICATION}`,
        secretKey
      )
      .then((res) => res)
      .catch((err) => err);
    return response;
  } catch (error) {
    throw error;
  }
};
