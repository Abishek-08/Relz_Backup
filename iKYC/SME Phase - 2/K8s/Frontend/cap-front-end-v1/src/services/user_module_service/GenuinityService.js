import axiosInstance from "../axiosInstance";

import { SET_GENUINITY_SCORE } from "../../constants/user_module_constants/APIConstants";

export const setGenuinity = async (genuinity) => {
  console.log(genuinity);
  try {
    const response = await axiosInstance.post(
      `${SET_GENUINITY_SCORE}`,
      genuinity
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching education details:", error);
    throw error;
  }
};
