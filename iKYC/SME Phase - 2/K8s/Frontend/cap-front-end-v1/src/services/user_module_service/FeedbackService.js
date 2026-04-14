import {
  INSERT_FEEDBACK,
  GET_DYNAMIC_FEEDBACK_FEILDS,
} from "../../constants/user_module_constants/APIConstants";
import axiosInstance from "../axiosInstance";

export const insertFeedbackToAssessment = async (
  feedback
) => {
  try {
    const response = await axiosInstance
      .post(
        `${INSERT_FEEDBACK}`,
        feedback,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      .then((resp) => resp)
      .catch((err) => err);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getDynamicFeedback = async (assessmentId) => {
  try {
    const response = await axiosInstance.get(
      `${GET_DYNAMIC_FEEDBACK_FEILDS}${assessmentId}`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching dynamic feedback:", error);
    console.log(
      "https://localhost:8090/cap/user/feedback/attribute/" + assessmentId
    );
    throw error;
  }
};
