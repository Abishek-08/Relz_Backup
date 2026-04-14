import moment from "moment";
import axiosInstance from "../axiosInstance";

import {
  ADD_WORKEXPERIENCE_DETAILS,
  UPDATE_PROFILE_DETAILS_API,
  UPDATE_PROFILE_PICTURE_API,
  GET_PROFILE_DETAILS_API,
  UPDATE_ACADEMIC_DETAILS_API,
  UPDATE_SKILLANDLINKS_DETAILS_API,
  ADD_ACADEMIC_DETAILS,
  SEND_OTP_API,
  SEND_SECURITY_QUESTIONS,
  ADD_CERTIFICATE_DETAILS_API,
  GET_USER_DETAILS,
  ADD_SKILLANDLINKS_DETAILS,
  UPDATE_WORKEXPERIENCE_DETAILS,
  DELETE_DETAILS_API,
  GET_OVERALL_SCORE_API,
} from "../../constants/user_module_constants/APIConstants";

export const fetchOverallscores = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `${GET_OVERALL_SCORE_API}${userId}`
    );
    return response; // Assuming response.data contains the education details
  } catch (error) {
    throw error; // Propagate the error to the calling function or component
  }
};

export const getProfileDetails = async (id) => {
  const response = await axiosInstance.get(`${GET_PROFILE_DETAILS_API}${id}`);
  return response;
};

export const updateProfileDetails = async (user) => {
  try {
    const response = await axiosInstance.put(
      `${UPDATE_PROFILE_DETAILS_API}`,
      user
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const updateProfilePicture = async (userId, formData) => {
  try {
    const response = await axiosInstance.put(
      `${UPDATE_PROFILE_PICTURE_API}${userId}`,
      formData
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const addEducation = async (education, userId) => {
  try {
    const response = await axiosInstance
      .post(`${ADD_ACADEMIC_DETAILS}${userId}`, education)
      .then((resp) => resp)
      .catch((err) => err);
    return response;
  } catch (error) {
    return error;
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await axiosInstance.post(`${SEND_OTP_API}${email}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendSecurityQuestions = async (email) => {
  try {
    const response = await axiosInstance.get(
      `${SEND_SECURITY_QUESTIONS}${email}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addWorkExperience = async (workExperienceData, userId) => {
  try {
    const response = await axiosInstance
      .post(`${ADD_WORKEXPERIENCE_DETAILS}${userId}`, workExperienceData)
      .then((resp) => resp)
      .catch((err) => err);
    return response;
  } catch (error) {
    return error;
  }
};

export const fetchProfileInfomrations = async (userId) => {
  try {
    const response = await axiosInstance.get(`${GET_USER_DETAILS}${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addUserSkillsAndLinks = async (data) => {
  const response = await axiosInstance.post(
    `${ADD_SKILLANDLINKS_DETAILS}`,
    data
  );
  return response.data;
};

export const updateWorkExperience = async (
  workExperienceData,
  workExperienceId
) => {
  try {
    const fromYearFormatted = formatDate(workExperienceData.fromYear);
    const toYearFormatted = formatDate(workExperienceData.toYear);
    const response = await axiosInstance.put(
      `${UPDATE_WORKEXPERIENCE_DETAILS}${workExperienceId}`,
      {
        ...workExperienceData,
        fromYear: fromYearFormatted,
        toYear: toYearFormatted,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const formatDate = (date) => {
  if (!date) return "";
  if (date === "Present") {
    return date;
  }
  if (moment.isMoment(date)) {
    return date.format("MMM-YYYY");
  }
  const momentDate = moment(date);
  if (momentDate.isValid()) {
    return momentDate.format("MMM-YYYY");
  }

  return "";
};

export const updateUserSkillsAndLinks = async (skillsId, data) => {
  try {
    const response = await axiosInstance.put(
      `${UPDATE_SKILLANDLINKS_DETAILS_API}${skillsId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEducation = async (academicId, educationData) => {
  try {
    const response = await axiosInstance.put(
      `${UPDATE_ACADEMIC_DETAILS_API}${academicId}`,
      educationData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDetails = async (label, detailId) => {
  try {
    await axiosInstance.delete(`${DELETE_DETAILS_API}${label}/${detailId}`);
    return true;
  } catch (error) {
    throw error;
  }
};

export const addCertification = async (certification, userId) => {
  try {
    const response = await axiosInstance.post(
      `${ADD_CERTIFICATE_DETAILS_API}${userId}`,
      certification
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
