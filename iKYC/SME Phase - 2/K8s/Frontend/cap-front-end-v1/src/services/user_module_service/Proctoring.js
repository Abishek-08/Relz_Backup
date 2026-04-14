import axiosInstance from "../axiosInstance";
import { FETCH_PROCTORING_API } from "../../constants/user_module_constants/APIConstants";

export const getProctoring = async (assessmentId) => {
  try {
    const response = await axiosInstance.get(
      `${FETCH_PROCTORING_API}${assessmentId}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching education details:", error);
    throw error;
  }
};
