package com.rts.cap.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.dto.LearningAssessmentAllQuestionsDto;
import com.rts.cap.service.LearningAssessmentEngineService;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

@RestController
@RequestMapping(path = APIConstants.LEARNING_BASE_URL)
public class LearningAssessmentEngineController {

	/**
	 * This is a Parameterized Constructor Dependency injection using constructor
	 * 
	 * @param engineService
	 */
	private final LearningAssessmentEngineService learningAssessmentEngineService;

	public LearningAssessmentEngineController(LearningAssessmentEngineService learningAssessmentEngineService) {
		this.learningAssessmentEngineService = learningAssessmentEngineService;
	}

	/**
	 * Handles GET requests to retrieve all distinct learning questions and their
	 * answers.
	 *
	 * @return A list of {@link LearningAssessmentAllQuestionsDto} representing
	 *         distinct learning questions and their answers.
	 */

	@GetMapping(APIConstants.GET_ALL_LEARNING_QUESTION_URL)
	public List<LearningAssessmentAllQuestionsDto> getDistinctLearningQuestions() {
		return learningAssessmentEngineService.getAllDistinctLearningQuestionsAndAnswers();
	}

	/**
	 * @author jeeva.sekar
	 * @since 28-06-2024
	 * @version 1.0
	 */

	/**
	 * Method for handling get request for getting all Multiple Choice Questions
	 * Based On The Topic Name Handles GET requests to return all Multiple Choice
	 * Questions & Answers
	 * 
	 * @param topicId
	 * @return Multiple Choice Questions & Answers
	 */

	@GetMapping(APIConstants.FILTERING_LEARNING_ASSESSMENT_QUESTION_AND_ANSWER_URL + "/{topicId}")
	public List<LearningAssessmentAllQuestionsDto> filterByTopic(@PathVariable int topicId) {
		return learningAssessmentEngineService.filterQuestionByTopic(topicId);
	}

	/**
	 * Handling get request for getting all Multiple Choice Questions and their
	 * answer Based On The SubTopic Name
	 * 
	 * @param topicId
	 * @param subTopicId
	 * @return Multiple Choice Questions & Answers
	 */

	@GetMapping(APIConstants.FILTERING_LEARNING_ASSESSMENT_QUESTION_AND_ANSWER_URL + "/{topicId}/{subTopicId}")
	public List<LearningAssessmentAllQuestionsDto> filterBySubTopic(@PathVariable int topicId,
			@PathVariable int subTopicId) {
		return learningAssessmentEngineService.filterQuestionBySubTopic(topicId, subTopicId);
	}

	/**
	 * Handles GET requests to filter learning questions by topic, subtopic, and
	 * complexity level.
	 *
	 * @param topicId    The ID of the topic to filter questions by.
	 * @param subTopicId The ID of the subtopic to filter questions by.
	 * @param complexity The complexity level of the questions to retrieve (e.g.,
	 *                   Basic, Intermediate, Hard).
	 * @return A list of {@link LearningAssessmentAllQuestionsDto} matching the
	 *         specified filters.
	 */

	@GetMapping(APIConstants.FILTERING_LEARNING_ASSESSMENT_QUESTION_AND_ANSWER_URL
			+ "/{topicId}/{subTopicId}/{complexity}")
	public List<LearningAssessmentAllQuestionsDto> filterByQuestionComplexity(@PathVariable int topicId,
			@PathVariable int subTopicId, @PathVariable String complexity) {
		return learningAssessmentEngineService.filterQuestioByQuestionComplexity(topicId, subTopicId, complexity);
	}

	/**
	 * Handles GET requests to filter learning questions by topic, subtopic,
	 * complexity level, and question type.
	 *
	 * @param topicId      The ID of the topic to filter questions by.
	 * @param subTopicId   The ID of the subtopic to filter questions by.
	 * @param complexity   The complexity level of the questions to retrieve (e.g.,
	 *                     Basic, Intermediate, Hard).
	 * @param questionType The type of questions to retrieve (e.g., multiple-choice,
	 *                     true/false).
	 * @return A list of {@link LearningAssessmentAllQuestionsDto} matching the
	 *         specified filters.
	 */

	@GetMapping(APIConstants.FILTERING_LEARNING_ASSESSMENT_QUESTION_AND_ANSWER_URL
			+ "/{topicId}/{subTopicId}/{complexity}/{questionType}")
	public List<LearningAssessmentAllQuestionsDto> filterByQuestionType(@PathVariable int topicId,
			@PathVariable int subTopicId, @PathVariable String complexity, @PathVariable String questionType) {
		return learningAssessmentEngineService.filterQuestioByQuestiontype(topicId, subTopicId, complexity,
				questionType);
	}

	/**
	 * @author prasanth.baskaran
	 * @since 28-06-2024
	 * @version 1.0
	 */

	/**
	 * Method for handling get request for getting Correct answer in on demand basis
	 * Handles GET requests to return all Multiple Choice Questions & Answers
	 * 
	 * @param questionId The ID of the question to filter its correct answer
	 * @return List of Correct Answers
	 */

	@GetMapping(APIConstants.GET_LEARNING_CORRECT_ANSWER_URL + "/{questionId}")
	public List<String> getCorrectOptions(@PathVariable int questionId) {
		return learningAssessmentEngineService.getCorrectOptions(questionId);
	}

	/**
	 * Handling get request for getting Specific Question on demand basis Handles
	 * GET requests to return all Multiple Choice Questions & Answers
	 * 
	 * @param questionId The ID of the question to filter its content
	 * @return the specific Question content which matches the question ID
	 */

	@GetMapping(APIConstants.GET_SPECIFIC_QUESTION_URL + "/{questionId}")
	public String getSpecificQuestion(@PathVariable int questionId) {
		return learningAssessmentEngineService.getQuestionContent(questionId);
	}

	/**
	 * Handles GET requests to retrieve the count of questions for a specific topic.
	 *
	 * @param topicId The ID of the topic for which question counts are retrieved.
	 * @return A map where keys are complexity levels and values are the counts of
	 *         questions for the specified topic.
	 */

	@GetMapping(APIConstants.GET_TOPIC_BASED_QUESTION_COUNT + "/{topicId}")
	public Map<String, Long> getQuestionCountBasedOnTopic(@PathVariable int topicId) {
		return learningAssessmentEngineService.getTopicBasedQuestionCount(topicId);
	}

	/**
	 * Handles GET requests to retrieve the count of questions for a specific
	 * subtopic.
	 *
	 * @param subtopicId The ID of the subtopic for which the question count is
	 *                   retrieved.
	 * @return The count of questions for the specified subtopic.
	 */

	@GetMapping(APIConstants.GET_SUBTOPIC_BASED_QUESTION_COUNT + "/{subtopicId}")
	public long getQuestionCountBasedOnSubTopic(@PathVariable int subtopicId) {
		return learningAssessmentEngineService.getSubtopicBasedQuestionCount(subtopicId);
	}

	/**
	 * Handles GET requests to retrieve question counts for a specific subtopic,
	 * categorized by complexity levels.
	 *
	 * @param subtopicId The ID of the subtopic for which question counts are
	 *                   retrieved.
	 * @return A map where keys are complexity levels and values are the counts of
	 *         questions for the specified subtopic.
	 */

	@GetMapping(APIConstants.GET_SUBTOPIC_COMPLEXITY_QUESTION_COUNT + "/{subtopicId}")
	public Map<String, Long> getQuestionCountBasedOnSubTopicComplexity(@PathVariable int subtopicId) {
		return learningAssessmentEngineService.getSubtopicComplexityQuestionCount(subtopicId);
	}

	/**
	 * Handles GET requests to retrieve all questions of a specified type for a
	 * given assessment.
	 *
	 * @param assessmentType The type of assessment questions to retrieve (e.g.,
	 *                       "L0", "L1", etc.).
	 * @param assessmentId   The ID of the assessment for which questions are
	 *                       retrieved.
	 * @return A list of {@link LearningAssessmentAllQuestionsDto} containing the
	 *         questions for the specified type and assessment.
	 */

	@GetMapping(APIConstants.GET_ALL_TYPE_LEARNING_ASSESSMENT_QUESTIONS + "/{assessmentType}/{assessmentId}")
	public List<LearningAssessmentAllQuestionsDto> getAllTypeAssessmentQuestions(@PathVariable String assessmentType,
			@PathVariable int assessmentId) {
		return learningAssessmentEngineService.getAllTypeOfQuestions(assessmentType, assessmentId);
	}

}
