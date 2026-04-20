import axios from "axios";

import { API_BASE_URL_park } from "../../Constants/API_Constants";

export const vehicleDash = async () => {
  const response = await axios.get(`${API_BASE_URL_park}/vehicleupdate`);
  return response.data;
};
