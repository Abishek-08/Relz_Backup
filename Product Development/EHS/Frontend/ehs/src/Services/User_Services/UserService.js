import axios from "axios";
import {
  USER_LOGIN_URL,
  USER_REGISTRATION_URL,
} from "../../Constants/API_Constants";

export const userLogin = (data) => {
  return axios.post(USER_LOGIN_URL, data);
};

export const userRegister = (data) => {
  return axios.post(USER_REGISTRATION_URL, data);
};

export const getAllUserService = () => {
  return axios.get(USER_REGISTRATION_URL);
};
