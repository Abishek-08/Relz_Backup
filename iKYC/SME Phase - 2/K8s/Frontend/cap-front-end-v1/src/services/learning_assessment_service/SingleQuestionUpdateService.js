import {ACTION_KNOWLEDGE_QUESTION,DELETE_KNOWLEDGE_ASSESSMENT_SINGLE_QUESTION_BY_ID} from "../../constants/knowledge_assessment_constants/APIConstants"
import axiosInstance from "../axiosInstance";




const fetchQuestionById = async (questionId) => {
  try {
    const response = await axiosInstance.get(`${ACTION_KNOWLEDGE_QUESTION}/${questionId}`);
    return response.data;
  } catch (error) {
    throw Error(
      `Error fetching question with ID ${questionId}: ${error.message}`
    );
  }
};

const updateQuestion = async (updatedQuestion) => {
  try {
    const response = await axiosInstance.put(`${ACTION_KNOWLEDGE_QUESTION}`, updatedQuestion);
    return response.data;
  } catch (error) {
    throw Error(`Error updating question: ${error.message}`);
  }
};

const deleteAnswerById = async (id) => {
  try {
    const response = await axiosInstance.delete(`${DELETE_KNOWLEDGE_ASSESSMENT_SINGLE_QUESTION_BY_ID}/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error deleting answer:", error);
    throw error;
  }
};

export {
  fetchQuestionById,
  updateQuestion,
  deleteAnswerById
};
