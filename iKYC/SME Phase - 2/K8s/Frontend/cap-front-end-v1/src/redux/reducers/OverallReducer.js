import { combineReducers } from "redux";
import { UserProfileReducer } from "../reducers/user_module_reducers/UserProfileReducer";
import { TitleReducer } from "./TitleReducer";
import { BatchReducer } from "./admin_module_reducers/BatchReducer";
import { userReducer } from "./admin_module_reducers/userReducer";
import learningEngineReducer from "./learning_assesment_reducers/LearningEngineReducer";
import Reducer from "./learning_assesment_reducers/Reducer";
import { skillQuestionReducer } from "./skill_assessment_reducers/assessment_view_reducres/CodingAssessmentReducer";
import {
  CodeAssessmentReducer,
  CurrentLanguageSkeleton,
} from "./skill_assessment_reducers/coding_question_reducers/CodeAssessmentReducer";
import { QuestionReducer } from "./skill_assessment_reducers/coding_question_reducers/ViewCodeReducer";
import UserPasswordReducer from "./user_module_reducers/UserPasswordReducer";

import {
  ScheduleReducer,
  ScheduleStatusReducer,
} from "../reducers/admin_module_reducers/ScheduleReducer";
import assessmentReducer from "./admin_module_reducers/CreateAssessment";
import { FeedbackReducer } from "./admin_module_reducers/FeedbackReducer";
import { tabNumberReducer } from "./admin_module_reducers/LearningAssessmentCreationReducer";
import proctorReducer from "./admin_module_reducers/SkillProctorReducer";
import skillQuestionPick from "./admin_module_reducers/SkillQuestionPickReducer";
import levelTwoReducer from "./admin_module_reducers/levelTwoReducer";
import { skillAnswerReducer } from "./skill_assessment_reducers/assessment_report_reducres/AssessmentReportReducer";
import proctoringReducer from "./user_module_reducers/ProctoringReducer";
import createFormReducer from "./admin_module_reducers/CreateFormReducer";
import fieldsReducer from "./admin_module_reducers/FieldsReducer";

/*
This is an example for reducer
where you can include you data as a key and value 
*/

const OverallReducer = combineReducers({
  // demo
  title: TitleReducer,
  questionred: QuestionReducer,
  batch: BatchReducer,
  users: userReducer,

  feedback: FeedbackReducer,
  //skill reducer
  code: CodeAssessmentReducer,
  skillQuestion: skillQuestionReducer,
  langSkeleton: CurrentLanguageSkeleton,
  skillAnswer: skillAnswerReducer,

  //learning reducer
  quizEngine: learningEngineReducer,
  quiz: Reducer,

  // Admin
  assessmentSchedules: ScheduleReducer,
  assessmentScheduleStatus: ScheduleStatusReducer,

  //users
  profileDetails: UserProfileReducer,
  userPassword: UserPasswordReducer,
  proctoring: proctoringReducer,

  //Admin SKill Schedule
  createassessment: assessmentReducer,
  proctorReducer: proctorReducer,
  skillQuestionPick: skillQuestionPick,

  //Learning Assessment Redux
  learningCreationTabNumber: tabNumberReducer,

  //Admin Knowledge Schedule
  levelTwoReducer: levelTwoReducer,

  //Admin Feedback Form for Assessment
  createFormReducer: createFormReducer,
  fieldsReducer: fieldsReducer,
});

export default OverallReducer;
