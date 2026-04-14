/*
 * @aurthor: sundhar raj s - 12106
 * @since: 11-07-2024
 * @version: 1.0
 * @purpose: SecurityComponentForm.jsx
 *
 */
import axiosInstance from "../axiosInstance";
import {
  FETCH_SECURITY_QUESTIONS_API,
  ADD_SECURITY_QUESTIONS_API,
} from "../../constants/user_module_constants/APIConstants";

export const addSecurityQuestion = async (email, payload) => {
  console.log(payload);
  try {
    return await axiosInstance
      .post(
        `${ADD_SECURITY_QUESTIONS_API}${email}`,
        payload
      )
      .then((resp) => resp)
      .catch((err) => err);
  } catch (error) {
    return error;
  }
};

export const fetchSecurityQuestions = async () => {
  try {
    const response = await axiosInstance
      .get(
        `${FETCH_SECURITY_QUESTIONS_API}`
      )
      .then((resp) => resp)
      .catch((err) => err);
    return response;
  } catch (error) {
    return error;
  }
};
