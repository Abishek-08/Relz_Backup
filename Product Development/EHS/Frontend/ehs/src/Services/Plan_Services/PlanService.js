import axios from "axios";
import { PLAN_BASE_URL } from "../../Constants/API_Constants";

export const getAllPlanService = () => {
  return axios.get(PLAN_BASE_URL);
};

export const insertPlanService = (plan) => {
  return axios.post(PLAN_BASE_URL, plan);
};
