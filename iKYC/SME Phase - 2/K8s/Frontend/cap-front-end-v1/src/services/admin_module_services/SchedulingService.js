import {
  ADMIN,
  ASSESSMENT,
  GET_UNSCHEDULED_USERS,
  PROCTORING,
  SCHEDULE_ASSESSMENT,
  SCHEDULE_USERS_TO_ASSESSMENT,
  USER,
} from "../../constants/admin_module_constants/APIConstants";
import axiosInstance from "../axiosInstance";

export const createScheduling = (data) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}${SCHEDULE_ASSESSMENT}`,
      data
    );
  } catch (error) {
    return error;
  }
};
export const updateScheduleService = (updateData) => {
  try {
    return axiosInstance.put(
      `${process.env.REACT_APP_BASE_URL}${SCHEDULE_ASSESSMENT}`,
      updateData
    );
  } catch (error) {
    return error;
  }
};

export const mapUserToScheduling = (scheduleId, userList) => {
  try {
    return axiosInstance.put(
      `${process.env.REACT_APP_BASE_URL}${SCHEDULE_USERS_TO_ASSESSMENT}` +
        scheduleId,
      userList
    );
  } catch (error) {
    return error;
  }
};
export const getAllScheduling = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${SCHEDULE_ASSESSMENT}`
    );
  } catch (error) {
    return error;
  }
};
export const cancelScheduleService = (data) => {
  try {
    return axiosInstance.put(
      `${process.env.REACT_APP_BASE_URL}${SCHEDULE_ASSESSMENT}`,
      data
    );
  } catch (error) {
    return error;
  }
};
export const removeUserFromScheduleService = (
  schlId,
  reason,
  postDate,
  data
) => {
  try {
    return axiosInstance.delete(
      `${process.env.REACT_APP_BASE_URL}${SCHEDULE_ASSESSMENT}${USER}/${schlId}/${reason}/${postDate}`,
      { data }
    );
  } catch (error) {
    return error;
  }
};

export const getScheduledUsers = (scheduleId) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${SCHEDULE_ASSESSMENT}/${scheduleId}`
    );
  } catch (error) {
    return error;
  }
};
export const getUnScheduledUsers = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${GET_UNSCHEDULED_USERS}`
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

export const deleteScheduleService = (id) => {
  try {
    return axiosInstance.delete(
      `${process.env.REACT_APP_BASE_URL}${SCHEDULE_ASSESSMENT}` + id
    );
  } catch (error) {
    return error;
  }
};
export const addProctoring = (proctoringData) => {
  try {
    return axiosInstance.post(
      `${process.env.REACT_APP_BASE_URL}${ADMIN}${PROCTORING}`,
      proctoringData
    );
  } catch (error) {
    return error;
  }
};
