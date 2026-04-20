import axios from "axios";
import {
  INDUSTRY_BASE_URL,
  INDUSTRY_MULTIPLE_DELETE,
  INDUSTRY_UNPLANNED_INDUSTRY,
} from "../../Constants/API_Constants";

export const createIndustryService = (data) => {
  return axios.post(INDUSTRY_BASE_URL, data);
};

export const getAllIndustryService = () => {
  return axios.get(INDUSTRY_BASE_URL);
};

export const deleteIndustryService = (data) => {
  return axios.delete(INDUSTRY_BASE_URL + data);
};

export const deleteMultipleIndustryService = (datalist) => {
  return axios.post(INDUSTRY_BASE_URL + INDUSTRY_MULTIPLE_DELETE, datalist);
};

export const getUnplannedIndustryService = () => {
  return axios.get(INDUSTRY_BASE_URL + INDUSTRY_UNPLANNED_INDUSTRY);
};
