import { ACTION_KNOWLEDGE_QUESTION, ADD_KNOWLEDGE_SUBTOPICS, ADD_KNOWLEDGE_TOPICS, GET_ALL_KNOWLEDGE_SUBTOPICS, GET_ALL_KNOWLEDGE_TOPICS, } from "../../constants/knowledge_assessment_constants/APIConstants";
import axiosInstance from "../axiosInstance";

const BASE_URL = process.env.REACT_APP_LEARNING_BASE_URL;


export const addSingleQuestion = (questionData) => {

    return axiosInstance.post(`${ACTION_KNOWLEDGE_QUESTION}`,questionData);
 
};

export const addTopic = (topicData) => {
    return axiosInstance.post(`${ADD_KNOWLEDGE_TOPICS}`, topicData);
};

export const addSubTopic = (subtopicData) => {
    return axiosInstance.post(`${ADD_KNOWLEDGE_SUBTOPICS}`,subtopicData);
};
export const getAllTopics = () => {
    try {
        return axiosInstance.get(`${GET_ALL_KNOWLEDGE_TOPICS}`);
    } catch (error) {
        console.error(`Error getting all topics: ${error.message}`);
        alert(`Error: ${error.message}`);
        return Promise.reject(error); // rethrow the error to propagate it up the call stack
    }
};
export const getAllSubTopics = (topicId) => {
    try {
        return axiosInstance.get(`${GET_ALL_KNOWLEDGE_SUBTOPICS}/${topicId}`);
    } catch (error) {
        console.error(`Error getting all subtopics: ${error.message}`);
        alert(`Error: ${error.message}`);
        return Promise.reject(error); // rethrow the error to propagate it up the call stack
    }
};