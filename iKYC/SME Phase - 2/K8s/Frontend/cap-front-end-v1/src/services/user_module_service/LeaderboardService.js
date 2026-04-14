import axiosInstance from "../axiosInstance";

import { LEADERBOARD_API } from "../../constants/user_module_constants/APIConstants";

export const getLeaderboard = async () => {
  try {
    const response = await axiosInstance.get(
      `${LEADERBOARD_API}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching education details:", error);
    throw error;
  }
};
