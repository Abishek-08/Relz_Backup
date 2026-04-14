import axiosInstance from "../axiosInstance";

import { ADD_USER_REQUEST_API } from "../../constants/user_module_constants/APIConstants";

export const addUserRequest = async (request) => {
  try {
    const response = await axiosInstance.post(
      `${ADD_USER_REQUEST_API}`,
      request
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
