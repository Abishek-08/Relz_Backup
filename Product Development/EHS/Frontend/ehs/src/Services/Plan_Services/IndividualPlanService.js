import axios from "axios";
import { INDIVIDUALPLAN_BASE_URL } from "../../Constants/API_Constants";

export const insertIndividualPlanService = (individualPlan_data) => {
  return axios.post(INDIVIDUALPLAN_BASE_URL, individualPlan_data);
};

export const getAllIndividualPlanService = () => {
  return axios.get(INDIVIDUALPLAN_BASE_URL);
};

