import {
  BATCH_URL,
  BATCH_USER,
  GET_UNMAPPED_USERS,
} from "../../constants/admin_module_constants/APIConstants";
import axiosInstance from "../axiosInstance";

//this is an service file

export const addUser = async (formdata) => {
  return axiosInstance.post(`/user`, formdata);
};

export const getUsers = () => {
  try {
    return axiosInstance.get(`/user`);
  } catch (error) {
    return error;
  }
};

export const deleteUser = (userId) => {
  try {
    return axiosInstance.delete(`/user/${userId}`);
  } catch (error) {
    return error;
  }
};

export const verifyUserEmail = (userEmail) => {
  return axiosInstance.post(`/user/validate/${userEmail}`);
};

export const UpdateUserProfile = (userId, formDataToSend) => {
  return axiosInstance.put(`/user/userProfile/${userId}`, formDataToSend);
};

export const updateUserStatus = (changeStatusId, status) => {
  try {
    return axiosInstance.put(`/user/user/${changeStatusId}/${status}`);
  } catch (error) {
    return error;
  }
};
export const enableUserStatus = (userId, status) => {
  try {
    return axiosInstance.put(`/user/user/${userId}/${status}`);
  } catch (error) {
    return error;
  }
};

export const userRequests = () => {
  try {
    return axiosInstance.get(`/user/request`);
  } catch (error) {
    return error;
  }
};

export const userRequestsEnable = (userId, requestId, status) => {
  try {
    return axiosInstance.put(
      `/user/request/changeRequestStatus/${requestId}/${status}/${userId}`
    );
  } catch (error) {
    return error;
  }
};

export const findUsersByBatch = (batchId) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_ALLBATCHDETAILS_BASE_URL}${BATCH_URL}/${batchId}`
    );
  } catch (error) {
    return error;
  }
};

export const removeUsersfromBatch = (batchId, userData) => {
  try {
    return axiosInstance.delete(
      `${process.env.REACT_APP_ALLBATCHDETAILS_BASE_URL}${BATCH_USER}/${batchId}`,
      { data: userData }
    );
  } catch (error) {
    return error;
  }
};

export const addUserstoBatch = (batchSelected, userData) => {
  try {
    return axiosInstance.put(
      `${process.env.REACT_APP_ALLBATCHDETAILS_BASE_URL}${BATCH_USER}/${batchSelected}`,
      userData
    );
  } catch (error) {
    return error;
  }
};

export const getunmappedusers = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_BASE_URL}${GET_UNMAPPED_USERS}`
    );
  } catch (error) {
    return error;
  }
};
