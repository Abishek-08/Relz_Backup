import { ActionTypes } from "../../constants/ActionTypes";

const initialState = {
  topicId: 0,
  topicName: "",
  subTopicIds: [],
  subTopic: [],
  selectedSubTopic: [],
  levelTwoInputTotal: null,
  passPercentage: null,
  totalQuestionCount: 0,
};

const levelTwoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CHANGE_LEVEL_TWO_TOPIC_ID:
      return { ...state, topicId: action.payload };
    case ActionTypes.CHANGE_LEVEL_TWO_TOPIC_NAME:
      return { ...state, topicName: action.payload };
    case ActionTypes.CHANGE_LEVEL_TWO_SUBTOPIC_ID_LIST:
      return { ...state, subTopicIds: action.payload };
    case ActionTypes.CHANGE_LEVEL_TWO_SUBTOPIC_NAME_LIST:
      return { ...state, subTopic: action.payload };
    case ActionTypes.CHANGE_LEVEL_TWO_TOTAL:
      return { ...state, levelTwoInputTotal: action.payload };
    case ActionTypes.CHANGE_LEVEL_TWO_PASS_PERCENTAGE:
      return { ...state, passPercentage: action.payload };
    case ActionTypes.CHANGE_LEVEL_TWO_SELECTED_TOTAL_QUESTION_COUNT:
      return { ...state, totalQuestionCount: action.payload };
    case ActionTypes.RESET_LEVEL_TWO:
      return initialState;

    default:
      return state;
  }
};

export default levelTwoReducer;
