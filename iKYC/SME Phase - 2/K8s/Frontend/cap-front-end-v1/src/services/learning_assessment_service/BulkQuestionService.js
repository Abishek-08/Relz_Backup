import { ADD_KNOWLEDGE_ASSESSMENT_BULK_QUESTION } from "../../constants/knowledge_assessment_constants/APIConstants"
import axiosInstance from "../axiosInstance";

export const addBulkQuestion = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post(`${ADD_KNOWLEDGE_ASSESSMENT_BULK_QUESTION}`, formData);
};