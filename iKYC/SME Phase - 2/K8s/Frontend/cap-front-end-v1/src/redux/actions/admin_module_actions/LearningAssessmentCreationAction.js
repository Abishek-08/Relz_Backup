import {
  L0Assessment,
  L0AssessmnetSubData,
  L1Assessment,
  L1AssessmentSubData,
  L3Assessment,
  L3AssessmentSubData,
  ResetLearningCreation,
  tabNumber,
} from "../../constants/Admin_Learning_Assessment_Creation/LearningCreation_Action_Type";

export const tabNumberAction = (number) => {
  return {
    type: tabNumber.GET_TAB_NUMBER,
    payload: number,
  };
};

export const L0AssessmentSubDataAction = (data) => {
  return {
    type: L0AssessmnetSubData.GET_L0_SUB_ASSESSMENT,
    payload: data,
  };
};

export const L0AssessmentAction = (data) => {
  return {
    type: L0Assessment.GET_L0_ASSESSMENT,
    payload: data,
  };
};

export const L1AssessmentSubDataAction = (data) => {
  return {
    type: L1AssessmentSubData.GET_L1_SUB_ASSESSMENT,
    payload: data,
  };
};

export const L1AssessmentAction = (data) => {
  return {
    type: L1Assessment.GET_L1_ASSESSMENT,
    payload: data,
  };
};

export const L3AssessmentSubDataAction = (data) => {
  return {
    type: L3AssessmentSubData.GET_L3_SUB_ASSESSMENT,
    payload: data,
  };
};

export const L3AssessmentAction = (data) => {
  return {
    type: L3Assessment.GET_L3_ASSESSMENT,
    payload: data,
  };
};

export const ResetLearnCreationAction = () => {
  return {
    type: ResetLearningCreation.RESET_LEARN_CREATION,
  };
};
