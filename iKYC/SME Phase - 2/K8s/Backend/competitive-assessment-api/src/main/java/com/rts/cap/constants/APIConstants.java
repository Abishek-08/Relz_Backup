package com.rts.cap.constants;

public class APIConstants {

	private APIConstants() {
		super();
	}

	// Login
	public static final String LOGIN_URL = "/login";
	public static final String LOGIN_OTP_VALIDATION_URL = "/otp";
	public static final String RESEND_OTP_URL = "/resend";
	public static final String LOGIN_PASSWORD_UPDATE = "/update";
	public static final String LOGIN_FORGET_PASSWORD = "/forget";

	// Genuinity
	public static final String GET_GENUINITY_SCORE = "";
	public static final String GET_ALL_GENUINITY_SCORE = "";
	public static final String ADD_GENUINITY_SCORE = "";
	public static final String GENUINITY_BASE_URL = "/genunity";
	public static final String GET_LEARNING_GENUINITY_AVERAGE = "/average/{userId}";

	// security question

	public static final String LOGIN_RESET_PASSWORD = "/reset";

	// security question
	public static final String SECURITY_BASE_URL = "/security";
	public static final String SECURITY_MAPPED_QUESTIONS = "/mapped/{email}";
	public static final String SCHEDULE_ASSESSMENT_VERIFY_KEY = "/verifySecretKey";
	public static final String SECURITY_VERIFY_ANSWER = "/verify";

	// certification
	public static final String CERTIFICATION_BASE_URL = "/certification";

	// Admin_Module - URL
	public static final String ADMIN_BASE_URL = "/admin";

	public static final String BATCH_BASE_URL = "/admin";
	public static final String ADD_BATCH_URL = "/batch";
	public static final String DELETE_BATCH_URL = "/batch";
	public static final String UPDATE_BATCH_URL = "/batch";
	public static final String GET_ALL_BATCH_URL = "/batch";
	public static final String ADD_USERS_TO_BATCH_URL = "/batch/user";
	public static final String DELETE_USERS_FROM_BATCH_URL = "/batch/user";
	public static final String GET_USERS_FROM_BATCH_URL = "/batch/user";
	public static final String VERIFY_BATCH_NAME_URL = "/batchname";
	public static final String ASSESSMENT_BASE_URL = "/admin";
	public static final String ADD_ASSESSMENT_URL = "/assessment";
	public static final String UPDATE_ASSESSMENT_URL = "/assessment";
	public static final String GET_ALL_ASSESSMENT_URL = "/assessment";
	public static final String USER_REQUEST_STATUS_CHANGE = "/changeRequestStatus/{requestId}/{status}/{userId}";

	// admin proctoring
	public static final String GET_PROCTORING_BY_ASSESSMENT_ID = "/proctoring/{assessmentId}";
	public static final String ADD_PROCTORING = "/proctoring";


	public static final String LEARNING_ASSESSMENT_BASE_URL = "/admin";
	public static final String ADD_LEARNING_ASSESSMENT_URL = "/learningassessment";
	public static final String GET_ALL_LEARNING_ASSESSMENT_URL = "/learningassessment";

	public static final String LEVEL_ZERO_LEARNING_ASSESSMENT_BASE_URL = "/admin";
	public static final String ADD_LEVEL_ZERO_LEARNING_ASSESSMENT = "/levelzerolearningassessment";
	public static final String GET_ALL_LEVEL_ZERO_LEARNING_ASSESSMENT = "levelzerolearningassessment";
	public static final String GET_LEVEL_ZERO_LEARNING_ASSESSMENT_BY_ID = "levelzerolearningassessment/{levelZeroLearningAssessmentId}";
	public static final String UPDATE_LEVEL_ZERO_LEARNING_ASSESSMENT = "levelzerolearningassessment";
	public static final String DELETE_LEVEL_ZERO_LEARNING_ASSESSMENT = "levelzerolearningassessment/{levelZeroLearningAssessmentId}";

	public static final String QUICK_LEARNING_ASSESSMENT = "/quicklearningassessment";

	public static final String MODERATE_LEARNING_ASSESSMENT_BASE_URL = "/admin";
	public static final String ADD_MODERATE_LEARNING_ASSESSMENT_URL = "/moderatelearningassessment";
	public static final String GET_ALL_MODERATE_LEARNING_ASSESSMENT_URL = "/moderatelearningassessment";
	public static final String GET_MODERATE_LEARNING_ASSESSMENT_BY_ID_URL = "/moderatelearningassessment/{moderateLearningAssessmentId}";

	public static final String QUICK_LEARNING_ASSESSMENT_BASE_URL = "/admin";
	public static final String ADD_QUICK_LEARNING_ASSESSMENT = "/quicklearningassessment";
	public static final String GET_ALL_QUICK_LEARNING_ASSESSMENT = "/quicklearningassessment";
	public static final String GET_QUICK_LEARNING_ASSESSMENT_BY_ID = "/getquicklearningassessmentbyid/{quickLearningAssessmentId}";

	public static final String VERIFY_ASSESSMENT_NAME_URL = "/assessmentname";

	public static final String SKILL_ASSESSMENT_BASE_URL = "/admin";
	public static final String ADD_SKILL_ASSESSMENT_URL = "/skillassessment";
	public static final String GET_ALL_SKILL_ASSESSMENT_URL = "/skillassessment";
	public static final String GET_SKILL_ASSESSMENT_BY_ASSESSMENT_URL = "/skillassessmentdetails/{assessmentId}";

	public static final String CODING_QUESTION_REQUEST_BASE_URL = "/admin";
	public static final String ADD_CODING_QUESTION_REQUEST_URL = "/coding/request";
	public static final String DELETE_CODING_QUESTION_REQUEST_URL = "/coding/request";
	public static final String GET_ALL_CODING_QUESTION_REQUEST_URL = "/coding/request";
	public static final String GET_SKILL_ASSESSMENT_DETAILS_URL = "/requestdetails/{skillAssessmentId}";
	public static final String CHECK_EXISTENCE_URL = "/existingrequest";

	public static final String ADD_LEVEL_THREE_ASSESSMENT_URL = "/levelthreeassessment";
	public static final String GET_ALL_LEVEL_THREE_ASSESSMENT_URL = "/levelthreeassessment";
	public static final String GET_ALL_LEVEL_THREE_ASSESSMENT_BY_ASSESSMENT_ID_URL = "/levelthreeassessment/{assessmentId}";
	

	// Schedule Assessment
	public static final String SCHEDULE_BASE_URL = "/schedule";
	public static final String ADD_SCHEDULE_URL = "/assessment";
	public static final String SCHEDULE_ASSESSMENT_USERS_URL = "/users/{schedulingId}";
	public static final String UPDATE_SCHEDULE_ASSESSMENT_URL = "/assessment";
	public static final String GET_ALL_SCHEDULE_ASSESSMNET_URL = "/assessment";
	public static final String CANCEL_SCHEDULE_ASSESSMENT_URL = "/assessment/{schedulingId}/{reason}/{date}";
	public static final String REMOVE_USERS_FROM_SCHEDULING_URL = "/assessment/user/{schedulingId}/{reason}/{date}";
	public static final String GET_UNSCHEDULED_USERS_URL = "/getunscheduledusers";
	public static final String GET_ASSESSMENT_URL = "/assessments";
	public static final String GET_ALL_USER_REQUEST_COUNT = "userrequest";

	// REPORT_CONTROLLER_API_URL
	public static final String UNMAPPED_USERS_REPORT = "/unmappedusersreport/{schedulingId}/{type}";
	public static final String GET_ALL_UNMAPPED_USER_REPORT = "/overallunmappedreport";
	public static final String GET_BATCH_REPORT = "/batchreport/{batchId}/{type}";
	public static final String LEARN_BATCH_USERS_REPORT = "/learnbatchuserreport/{batchId}/{assessmentId}";
	public static final String SKILL_BATCH_REPORT = "/skillbatchreport/{batchId}";
	public static final String SKILL_BATCH_USERS_REPORT = "/skillbatchuserreport/{batchId}/{assessmentId}";
	public static final String OVERALL_BATCH_REPORT = "/overallbatchreport/{type}";
	public static final String GET_ALL_SCHEDULED_KNOWLEDGE_ASSESSMENT_URL = "/knowledgecount";
	public static final String GET_ALL_SCHEDULED_SKILL_ASSESSMENT_URL = "/skillcount";
	public static final String GET_ASSESSMENT_DETAILS = "/getassessmenttype/{assessmentId}";
	public static final String GET_ALL_ASSESSMENT = "/getAllAssessment/{type}";
	
	

	// User
	public static final String USER_PROFILE_DETAILS = "/profile";
	public static final String USER_BASE_URL = "/user";
	public static final String USER_REQUEST_BASE_URL = "/user/request";
	public static final String ADD_USER_URL = "";
	public static final String DELETE_USER_URL = "";
	public static final String GET_USER_URL = "";
	public static final String UPDATE_USER_URL = "/user";
	public static final String PROFILEUSER_URL = "/userProfile";
	public static final String GET_UNMAPPED_USER_URL = "/getunmappedusers";
	public static final String GET_USER_IMAGE_URL = "/getimage";
	public static final String GET_ALL_USER_URL = "";
	public static final String ADD_BULK_USERS = "/bulkuser";

	public static final String ADD_ACADEMIC_DETAILS_URL = "/academic";
	public static final String UPDATE_ACADEMIC_DETAILS_URL = "/academic";
	public static final String GET_ACADEMIC_DETAILS_URL = "/academic";
	public static final String DELETE_ACADEMIC_DETAILS_URL = "/academic";

	public static final String ADD_WORK_EXPERIENCE_URL = "/workexperience";
	public static final String UPDATE_WORK_EXPERIENCE_URL = "/workexperience";
	public static final String GET_WORK_EXPERIENCE_URL = "/workexperience";
	public static final String DELETE_WORK_EXPERIENCE_URL = "/workexperience";

	public static final String ADD_SKILL_LINK_URL = "/skill";
	public static final String UPDATE_SKILL_LINK_URL = "/skill";
	public static final String GET_SKILL_LINK_URL = "/skill";
	public static final String DELETE_SKILL_LINK_URL = "/skill";

	public static final String ADD_CERTIFICATION_URL = "/certificate";
	public static final String UPDATE_CERTIFICATION_URL = "/certificate";
	public static final String VALIDATE_USER_REGISTER_URL = "/validate";

	public static final String ADD_FEEDBACK_URL = "/feedback";
	public static final String GET_ALL_FEEDBACK_URL = "/feedback";
	public static final String GET_FEEDBACK_ATTRIBUTE_URL = "/feedback/attribute";

	public static final String GET_LEARNING_SCORECARD_URL = "/learning/score/{userId}";
	public static final String GET_LEADERBOARD_URL = "/leaderboard";

	// Skill assessment
	public static final String SKILL_BASE_URL = "/skill";
	public static final String ADD_CODING_QUESTION_URL = "/question";
	public static final String UPDATE_CODING_QUESTION_URL = "/question";
	public static final String DELETE_CODING_QUESTION_URL = "/question";
	public static final String GET_CODING_QUESTION_URL = "/question/{questionId}";
	public static final String GET_ALL_CODING_QUESTION_URL = "/question";

	public static final String ADD_CATEGORY_URL = "/category";
	public static final String UPDATE_CATEGORY_URL = "/category";
	public static final String DELETE_CATEGORY_URL = "/category";
	public static final String GET_CATEGORY_URL = "/category/{categoryId}";
	public static final String GET_ALL_CATEGORY_URL = "/category";

	public static final String ADD_LANGUAGE_URL = "/language";
	public static final String UPDATE_LANGUAGE_URL = "/language";
	public static final String DELETE_LANGUAGE_URL = "/language";
	public static final String GET_LANGUAGE_URL = "/language/{languageId}";
	public static final String GET_ALL_LANGUAGE_URL = "language";

	public static final String FILTER_BY_CATEGORY_URL = "/filter/{categoryId}";
	public static final String FILTER_BY_CATEGORY_AND_LEVEL_URL = "/filter/{categoryId}/{level}";
	public static final String GET_REFERENCE_DOCUMENT_URL = "/downloadzipfile";

	public static final String COUNT_BY_ALL_URL = "/count/{categoryId}/{level}";
	public static final String COUNT_BY_CATEGORY_URL = "/count/{categoryId}";

	public static final String MAPPING_CODING_QUESTION_URL = "/attempt/{userId}/{schedulingId}";
	public static final String GET_MAPPED_CODING_QUESTION_URL = "/attempt/{attemptId}";
	public static final String RUN_CODE_URL = "/attempt";
	public static final String SUBMIT_CODE_URL = "/attempt";
	public static final String GET_SKILL_ATTEMPT_URL = "/attempt";
	public static final String CUSTOM_RUN_CODE_URL = "/attempt/custom";
	public static final String ASSESSMENT_STATUS_SKILL = "/attempt/{schedulingId}/{userId}";
	


	// Learning assessment
	public static final String LEARNING_BASE_URL = "/learning";
	public static final String ADD_LEARNING_ASSESSMENT_SINGLE_QUESTION_URL = "/question";
	public static final String UPDATE_LEARNING_ASSESSMENT_SINGLE_QUESTION_URL = "/question";
	public static final String DELETE_LEARNING_ASSESSMENT_SINGLE_QUESTION_URL = "/question";
	public static final String GET_LEARNING_ASSESSMENT_SINGLE_QUESTION_URL = "/question";

	public static final String GET_ALL_LEARNING_ASSESSMENT_TOPICS_URL = "/topic";
	public static final String ADD_LEARNING_ASSESSMENT_TOPICS_URL = "/topic";
	public static final String GET_TOPIC_BASED_QUESTION_COUNT = "/topicCount";

	public static final String BULK_QUESTION_UPLOAD = "/spreadsheet";

	public static final String GET_LEARNING_ASSESSMENT_SUBTOPIC_BASED_ON_TOPIC_URL = "/subtopic";
	public static final String ADD_LEARNING_ASSESSMENT_SUBTOPIC_BASED_ON_TOPIC_URL = "/subtopic";
	public static final String GET_SUBTOPIC_BASED_QUESTION_COUNT = "/subtopicCount";
	public static final String GET_SUBTOPIC_COMPLEXITY_QUESTION_COUNT = "/subtopicComplexity";

	public static final String DELETE_LEARNING_ASSESSMENT_SINGLE_ANSWER_URL = "/deleteAnswer";

	public static final String EVALUATE_LEARNING_ASSESSMENT = "/evaluate";
	public static final String LEARNING_ASSESSMENT_COMPLETION_COUNT = "/evaluate/count";
	public static final String LEARNING_ASSESSMENT_COMPLETION_STATUS = "/evaluate/status";

	public static final String GET_ALL_LEARNING_QUESTION_URL = "/getQuestions";
	public static final String UPDATE_LEARNING_ASSESSMENT_QUESTION_STATUS_URL = "/question/status";
	public static final String GET_LEARNING_CORRECT_ANSWER_URL = "/getAnswers";

	public static final String GET_SPECIFIC_QUESTION_URL = "/getSpecificQuestion";

	public static final String FILTERING_LEARNING_ASSESSMENT_QUESTION_AND_ANSWER_URL = "/filterquestions";
	public static final String GET_ALL_LEARNING_ASSESSMENT_QUESTION_COUNT = "/getQuestionsCount";
	public static final String GET_LEARNING_ASSESSMENT_SUBTOPICS_RANDOMIZED_QUESTIONS = "/getRandomizedQuestions";
	public static final String GET_ALL_TYPE_LEARNING_ASSESSMENT_QUESTIONS = "/getAssessmentQuestions";
	public static final String GET_SCHEDULED_ASSESSMENT_BY_USEREMAIL_URL = "/scheduledLearning";
	public static final String SCHEDULE_ASSESSMENT_SKILL_URL = "/skill";
	public static final String GET_USER_SCORECARD = "/score";
	public static final String ADD_LEARNING_ASSESSMENT_ATTEMPT_STATUS_URL = "/attempt";
	public static final String UPDATE_LEARNING_ASSESSMENT_ATTEMPT_STATUS_URL = "/attempt";

	public static final String GET_LEARNING_ASSESSMENT_USER_REPORT = "/assessmentReport";

	public static final String GET_OVERALL_SCORE_USER = "/overallScore/{userId}";

	public static final String GET_SCHEDULE_ASSESSMENT_LIST_REPORT = "/scheduleReport";
	public static final String GET_LEARNING_ASSESSMENT_USER_LIST = "/scheduleReport/user";
	public static final String GET_LEARNING_ASSESSMENT_SCORE_CARD_DETAILS = "/scorecardDetails";

}
