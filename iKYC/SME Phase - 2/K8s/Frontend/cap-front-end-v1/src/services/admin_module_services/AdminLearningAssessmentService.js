import axiosInstance from "../axiosInstance";

export const getAllTopic = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/learning/topic`
    );
  } catch (error) {
    return error;
  }
};

export const getTopicQuestionCount = (id) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/learning/topicCount/${id}`
    );
  } catch (error) {
    return error;
  }
};



export const getSubTopicList = (id) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/learning/subtopic/${id}`
    );
  } catch (error) {
    return error;
  }
};

export const getSubTopicQuestionCount = (id) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/learning/subtopicCount/${id}`
    );
  } catch (error) {
    return error;
  }
};




export const getComplexityCount = (subtopicId) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/learning/subtopicComplexity/${subtopicId}`
    );
  } catch (error) {
    return error;
  }
};

