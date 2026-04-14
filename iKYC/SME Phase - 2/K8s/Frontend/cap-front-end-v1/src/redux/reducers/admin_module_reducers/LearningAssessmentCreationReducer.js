import { L0AssessmentSubDataAction } from "../../actions/admin_module_actions/LearningAssessmentCreationAction";
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

const initialState = {
  number: "1",
  L0SubData: { topicName: "", availableQuestionCount: 0 },
  L0Data: {
    topicId: 0,
    numberOfQuestion: 0,
    passMark: 0,
    assessment: {
      assessmentId: 0,
    },
  },
  L1SubData: {
    topicName: "",
    noOfQuestion: 0,
    totalBasicCount: 0,
    totalIntermediateCount: 0,
    totalHardCount: 0,
  },
  L1Data: {
    topicId: 0,
    numberOfQuestion: 0,
    basic: 0,
    intermediate: 0,
    hard: 0,
    passMark: 0,
    assessment: {
      assessmentId: 0,
    },
  },
  L3SubData: {
    topicId: 0,
    topicName: "",
    tempSubTopic: "",
    subInputTotal: "",
    totalTopicCount: 0,
    totalCount: 0,
    selectedQuestionCount: 0,
    subTopicList: [],
    allSubTopics: [],
  },
  L3Data: {
    totalNumberOfQuestions: 0,
    passMarks: 0,
    chosenQuestions: [],
    assessment: {
      assessmentId: 0,
    },
  },
};

export const tabNumberReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case tabNumber.GET_TAB_NUMBER:
      return {
        ...state,
        number: payload,
      };

    case L0AssessmnetSubData.GET_L0_SUB_ASSESSMENT:
      return {
        ...state,
        L0SubData: payload,
      };

    case L0Assessment.GET_L0_ASSESSMENT:
      return {
        ...state,
        L0Data: payload,
      };

    case L1AssessmentSubData.GET_L1_SUB_ASSESSMENT:
      return {
        ...state,
        L1SubData: payload,
      };

    case L1Assessment.GET_L1_ASSESSMENT:
      return {
        ...state,
        L1Data: payload,
      };

    case L3AssessmentSubData.GET_L3_SUB_ASSESSMENT:
      return {
        ...state,
        L3SubData: payload,
      };

    case L3Assessment.GET_L3_ASSESSMENT:
      return {
        ...state,
        L3Data: payload,
      };

    case ResetLearningCreation.RESET_LEARN_CREATION:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
