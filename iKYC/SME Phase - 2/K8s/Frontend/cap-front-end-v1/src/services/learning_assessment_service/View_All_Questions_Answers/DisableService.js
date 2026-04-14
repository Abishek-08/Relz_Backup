
import {
  CHANGE_STATUS_KNOWLEDGE_QUESTION,
} from "../../../constants/knowledge_assessment_constants/APIConstants";

import axiosInstance from "../../axiosInstance";


export const disableQuestion = async (data) => {
  try {
    return axiosInstance.put(
      `${CHANGE_STATUS_KNOWLEDGE_QUESTION}/${data}/${"no"}`
    );
  } catch (e) {
    return e;
  }
};
export const enableQuestion = async (data) => {
  try {
    return axiosInstance.put(
      `${CHANGE_STATUS_KNOWLEDGE_QUESTION}/${data}/${"yes"}`
    );
  } catch (e) {
    console.log(e);
  }
}
