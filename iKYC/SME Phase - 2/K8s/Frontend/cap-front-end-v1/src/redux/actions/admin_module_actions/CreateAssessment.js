import { ActionTypes } from "../../constants/ActionTypes";
import dayjs from "dayjs";

export const changeValue = (value) => {
  return { type: ActionTypes.CHANGE_VALUE, payload: value };
};

export const changeAssessment = (assessment) => ({
  type: ActionTypes.CHANGE_ASSESSMENT,
  payload: assessment,
});
export const changeAssessmentName = (assessmentName) => ({
  type: ActionTypes.CHANGE_ASSESSMENT_NAME,
  payload: assessmentName,
});

export const changeCameraProctor = (cameraproctor) => ({
  type: ActionTypes.CHANGE_CAMERA_PROCTOR,
  payload: cameraproctor,
});
export const changeAudioProctor = (audioproctor) => ({
  type: ActionTypes.CHANGE_AUDIO_PROCTOR,
  payload: audioproctor,
});
export const changeCopyPasteProctor = (copypaste) => ({
  type: ActionTypes.CHANGE_COPY_PASTE_PROCTOR,
  payload: copypaste,
});
export const changeTabSwitchProctor = (tabswitch) => ({
  type: ActionTypes.CHANGE_TAB_SWITCH_PROCTOR,
  payload: tabswitch,
});
export const changeViolationCount = (violationcount) => ({
  type: ActionTypes.CHANGE_VIOLATION_COUNT,
  payload: violationcount,
});
export const changeSkillTotalCount = (skilltotalcount) => ({
  type: ActionTypes.CHANGE_SKILL_TOTAL_COUNT,
  payload: skilltotalcount,
});
export const skillPickedQuestions = (question) => ({
  type: ActionTypes.CHANGE_SKILL_QUESTION_LIST,
  payload: question,
});
export const deleteSkillQuestion = (requestId) => ({
  type: ActionTypes.DELETE_SKILL_QUESTION,
  payload: requestId,
});
export const changeAssessmentDate = (date) => ({
  type: ActionTypes.CHANGE_ASSESSMENT_DATE,
  payload: dayjs(date), // Ensure date is a dayjs object
});
export const changeAssessmentTime = (time) => ({
  type: ActionTypes.CHANGE_ASSESSMENT_TIME,
  payload: time,
});
export const changeAssessmentDuration = (duration) => ({
  type: ActionTypes.CHANGE_ASSESSMENT_DURATION,
  duration,
});

export const resetAssessmentState = () => ({
  type: ActionTypes.RESET_ASSESSMENT_STATE,
});

export const resetProctorState = () => ({
  type: ActionTypes.RESET_PROCTOR_STATE,
});

export const resetSkillQuestionPickState = () => ({
  type: ActionTypes.RESET_SKILL_QUESTION_PICK_STATE,
});

export const changeLevelTwoTopicId = (topicId) => ({
  type: ActionTypes.CHANGE_LEVEL_TWO_TOPIC_ID,
  payload: topicId,
});
export const changeLevelTwoTopicName = (topicName) => ({
  type: ActionTypes.CHANGE_LEVEL_TWO_TOPIC_NAME,
  payload: topicName,
});
export const changeLevelTwoSelectedSubtopicIdList = (subtopicIdList) => ({
  type: ActionTypes.CHANGE_LEVEL_TWO_SUBTOPIC_ID_LIST,
  payload: subtopicIdList,
});
export const changeLevelTwoSelectedSubtopicNameList = (subtopicNameList) => ({
  type: ActionTypes.CHANGE_LEVEL_TWO_SUBTOPIC_NAME_LIST,
  payload: subtopicNameList,
});
export const changeLevelTwoTotal = (total) => ({
  type: ActionTypes.CHANGE_LEVEL_TWO_TOTAL,
  payload: total,
});
export const changeLevelTwoPassPercentage = (percentage) => ({
  type: ActionTypes.CHANGE_LEVEL_TWO_PASS_PERCENTAGE,
  payload: percentage,
});
export const changeSelectedTotalQuestion = (selectedTotalQuestion) => ({
  type: ActionTypes.CHANGE_LEVEL_TWO_SELECTED_TOTAL_QUESTION_COUNT,
  payload: selectedTotalQuestion,
});
export const removeSelectedSubtopic = (subtopicId) => ({
  type: ActionTypes.REMOVE_SELECTED_SUBTOPIC,
  payload: subtopicId,
});
export const resetLevelTwo = () => ({
  type: ActionTypes.RESET_LEVEL_TWO,
});

export const changeFormFields = (formdata) => ({
  type: ActionTypes.CHANGE_FORM_FIELDS,
  payload: formdata,
});

export const resetFormFields = () => ({
  type: ActionTypes.RESET_FORM_FIELDS,
});

export const updateFieldAttributeName = (index, value) => ({
  type: ActionTypes.UPDATE_FIELD_ATTRIBUTE_NAME,
  payload: { index, value },
});

export const updateFieldOption = (fieldIndex, optionIndex, value, questionType) => ({
  type: ActionTypes.UPDATE_FIELD_OPTION,
  payload: { fieldIndex, optionIndex, value, questionType },
});

export const addOption = (index) => ({
  type: ActionTypes.ADD_OPTION,
  payload: { index },
});

export const removeOption = (fieldIndex, optionIndex) => ({
  type: ActionTypes.REMOVE_OPTION,
  payload: { fieldIndex, optionIndex },
});

export const updateFieldType = (index, newType) => ({
  type: ActionTypes.UPDATE_FIELD_TYPE,
  payload: { index, newType },
});

export const updateVisibility = (index, isVisible) => ({
  type: ActionTypes.UPDATE_VISIBILITY,
  payload: { index, isVisible },
});

export const resetFormReducer = () => ({
  type: ActionTypes.RESET_FIELD_REDUCER,
})
