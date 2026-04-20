import axios from "axios";
import {
  SOLUTION__UNPLANNED_SOLUTION,
  SOLUTION_BASE_URL,
  SOLUTION_BY_INDUSTRY_ID,
} from "../../Constants/API_Constants";

export const createSolutionService = (solution) => {
  return axios.post(SOLUTION_BASE_URL, solution);
};

export const getSolutionByIdService = (industryId) => {
  return axios.get(SOLUTION_BASE_URL + SOLUTION_BY_INDUSTRY_ID + industryId);
};

export const deleteSolutionService = (solutionId) => {
  return axios.delete(SOLUTION_BASE_URL + solutionId);
};

export const getAllSolutionService = () => {
  return axios.get(SOLUTION_BASE_URL);
};

export const getUnplannedSolutionService = () => {
  return axios.get(SOLUTION_BASE_URL + SOLUTION__UNPLANNED_SOLUTION);
};
