import axios from "axios";
import { BUNDLEPLAN_BASE_URL } from "../../Constants/API_Constants";

export const insertBundlePlanService = (bundlePlan) => {
  return axios.post(BUNDLEPLAN_BASE_URL, bundlePlan);
};

export const getAllBundlePlanService = () => {
  return axios.get(BUNDLEPLAN_BASE_URL);
};
