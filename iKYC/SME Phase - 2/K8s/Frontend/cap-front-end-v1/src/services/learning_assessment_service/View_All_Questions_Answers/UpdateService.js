
import {GET_ALL_KNOWLEDGE_QUESTIONS, 
  GET_ALL_KNOWLEDGE_CORRECT_OPTIONS, 
  GET_ALL_KNOWLEDGE_TOPICS,
  GET_ALL_KNOWLEDGE_QUESTION_BY_ID,
  FILTER_KNOWLEDGE_QUESTIONS_TOPICS
} from "../../../constants/knowledge_assessment_constants/APIConstants"
import axiosInstance from "../../axiosInstance";




//Get all questions and Options List Service
export const getAllQuestionsAndAnswers = async () => {
  try {
    const response = await axiosInstance.get(`${GET_ALL_KNOWLEDGE_QUESTIONS}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions and answers:", error);
    throw error;
  }
};

//Get all Correct Option Based on Question Id Service
export const getAllCorrectOptions = async (data) => {
  try {
    const response = await axiosInstance.get(`${GET_ALL_KNOWLEDGE_CORRECT_OPTIONS}/${data}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Correct answers:", error);
    throw error;
  }
};

// Get all Topic List
export const getAllTopics = async () => {
  try {
    const response = await axiosInstance.get(`${GET_ALL_KNOWLEDGE_TOPICS}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};

// Get all Topic List
export const getQuestionsById = async (questionId) => {
  try {
    const response = await axiosInstance.get(`${GET_ALL_KNOWLEDGE_QUESTION_BY_ID}/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};

export const getTopicQuestions = async (topicId) => {
  try {
    const response = await axiosInstance.get(`${FILTER_KNOWLEDGE_QUESTIONS_TOPICS}/${topicId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching topics list:", error);
    throw error;
  }
};

export const getSubTopicQuestions = async (topicId, subtopicId) => {
  try {
  
    const response = await axiosInstance.get(
      `${FILTER_KNOWLEDGE_QUESTIONS_TOPICS}/${topicId}/${subtopicId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Subtopics list:", error);
    throw error;
  }
};

export const getComplexityQuestions = async (topicId, subtopicId,complexity) => {
  try {
   
    const response = await axiosInstance.get(
      `${FILTER_KNOWLEDGE_QUESTIONS_TOPICS}/${topicId}/${subtopicId}/${complexity}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Complexity list:", error);
    throw error;
  }
};

export const getQuestionTypeQuestions = async (topicId, subtopicId,complexity,questionType) => {
  try {
   
    const response = await axiosInstance.get(
      `${FILTER_KNOWLEDGE_QUESTIONS_TOPICS}/${topicId}/${subtopicId}/${complexity}/${questionType}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching QuestionType list:", error);
    throw error;
  }
};