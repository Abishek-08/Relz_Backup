import {
  GET_SKILL_REPORT,
  GET_SKILL_RESULT,
  SKILL_BASE_URL,
} from "../../../constants/skill_assessment_constants/APIConstants";
import axiosInstance from "../../axiosInstance";

/**
 *
 * @author Srinivasan S - 12113
 * @since 19-07-2024
 */

const getSkillReport = (attemptId) => {
  console.log(attemptId);
  return axiosInstance.get(
    `${SKILL_BASE_URL}${GET_SKILL_REPORT}?attemptId=${attemptId}`
  );
};

const getSkillResult = (resultId) => {
  return axiosInstance.get(
    `${SKILL_BASE_URL}${GET_SKILL_RESULT}/${resultId}`
  );
};
export { getSkillReport, getSkillResult };

