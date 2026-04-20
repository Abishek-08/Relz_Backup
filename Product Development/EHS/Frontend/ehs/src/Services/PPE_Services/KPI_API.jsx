import axios from "axios";

import { API_BASE_URL } from "../../Constants/API_Constants";

export const getDashboardKPIs = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard`);
  return response.data;
};
