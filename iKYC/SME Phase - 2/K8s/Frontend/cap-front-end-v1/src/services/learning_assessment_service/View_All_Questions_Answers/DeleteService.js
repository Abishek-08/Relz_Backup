import { ACTION_KNOWLEDGE_QUESTION } from "../../../constants/knowledge_assessment_constants/APIConstants";
import axiosInstance from "../../axiosInstance";

export const deleteQuestion = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `${ACTION_KNOWLEDGE_QUESTION}/${id}`
    );
    if (response.status !== 200) {
      throw new Error(`Error deleting question: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
