import {
  ADMIN_BASE_URL,
  BATCH_NAME,
  BATCH_URL,
  BATCH_USER,
  GET_UNMAPPED_USERS,
} from "../../constants/admin_module_constants/APIConstants";
import axiosInstance from "../axiosInstance";

export const addBatch = (data) => {
  try {
    return axiosInstance.post(`${ADMIN_BASE_URL}${BATCH_URL}`, data);
  } catch (error) {
    return error;
  }
};

export const getBatchById = (batchId) => {
  try {
    return axiosInstance.get(`${ADMIN_BASE_URL}${BATCH_URL}/${batchId}`);
  } catch (error) {
    return error;
  }
};

export const updateBatch = (batchData) => {
  try {
    return axiosInstance.put(`${ADMIN_BASE_URL}${BATCH_URL}`, batchData);
  } catch (error) {
    return error;
  }
};

export const getAllBatch = () => {
  try {
    return axiosInstance.get(
      `${ADMIN_BASE_URL}${BATCH_URL}`
    );
  } catch (error) {
    return error;
  }
};

export const removeBatch = (batchId) => {
    try {
      return axiosInstance.delete(
        `${ADMIN_BASE_URL}${BATCH_URL}/${batchId}`
      );
    } catch (error) {
      return error;
    }
  };

  export const checkBatchName = (batchName) => {
    try {
      return axiosInstance.get(
        `${ADMIN_BASE_URL}${BATCH_NAME}/${batchName}`
      );
    } catch (error) {
      return error;
    }
  };

  export const findUsersByBatch = (batchId) => {
    try {
      return axiosInstance.get(
        `${ADMIN_BASE_URL}${BATCH_URL}/${batchId}`
      );
    } catch (error) {
      return error;
    }
  };
  
  export const removeUsersfromBatch = (batchId, userData) => {
    try {
      return axiosInstance.delete(
        `${ADMIN_BASE_URL}${BATCH_USER}/${batchId}`,
        { data: userData }
      );
    } catch (error) {
      return error;
    }
  };
  
  export const addUserstoBatch = (batchSelected, userData) => {
    try {
      return axiosInstance.put(
        `${ADMIN_BASE_URL}${BATCH_USER}/${batchSelected}`,
        userData
      );
    } catch (error) {
      return error;
    }
  };
  

