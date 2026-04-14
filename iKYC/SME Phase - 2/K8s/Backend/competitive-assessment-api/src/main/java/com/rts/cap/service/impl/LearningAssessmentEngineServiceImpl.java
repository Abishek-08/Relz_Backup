package com.rts.cap.service.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.LearningAssessmentEngineDao;
import com.rts.cap.dto.LearningAssessmentAllQuestionsDto;
import com.rts.cap.model.Answer;
import com.rts.cap.model.ChosenQuestion;
import com.rts.cap.model.LevelThreeLearningAssessment;
import com.rts.cap.model.LevelZeroLearningAssessment;
import com.rts.cap.model.ModerateLearningAssessment;
import com.rts.cap.model.MultipleChoiceQuestion;
import com.rts.cap.model.QuickLearningAssessment;
import com.rts.cap.service.LearningAssessmentEngineService;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

@Service
public class LearningAssessmentEngineServiceImpl implements LearningAssessmentEngineService {

	private static final Logger LOGGER = LogManager.getLogger(LearningAssessmentEngineServiceImpl.class);

	/**
	 * This is a Parameterized Constructor Dependency injection using constructor
	 * 
	 * @param assessmentQbDao
	 */
	private final LearningAssessmentEngineDao engineDao;

	public LearningAssessmentEngineServiceImpl(LearningAssessmentEngineDao engineDao) {
		super();
		this.engineDao = engineDao;
	}

	/**
	 * Retrieves a map of multiple-choice questions to their corresponding option
	 * contents.
	 * 
	 * @return a map of MultipleChoiceQuestion objects to their corresponding option
	 *         contents
	 */

	private Map<MultipleChoiceQuestion, List<String>> getQuestionToOptionContentMap() {
		List<Object[]> questionAndAnswersList = engineDao.findAllDistinctLearningQuestionsAndAnswers();

		// Collect into a LinkedHashMap to maintain insertion order
		return questionAndAnswersList.stream()
				.collect(Collectors.groupingBy(row -> (MultipleChoiceQuestion) row[0], LinkedHashMap::new, // Maintain
																											// insertion
																											// order
						Collectors.mapping(row -> ((Answer) row[1]).getOptionContent(), Collectors.toList())));
	}

	/**
	 * Retrieves a list of all distinct {@link LearningAssessmentAllQuestionsDto}
	 * objects with their corresponding answers.
	 *
	 * @return A list of {@link LearningAssessmentAllQuestionsDto} representing each
	 *         distinct question and its answers.
	 */

	@Override
	public List<LearningAssessmentAllQuestionsDto> getAllDistinctLearningQuestionsAndAnswers() {
		Map<MultipleChoiceQuestion, List<String>> questionToOptionContentMap = getQuestionToOptionContentMap();

		return questionToOptionContentMap.entrySet().stream().map(entry -> {
			MultipleChoiceQuestion question = entry.getKey();
			List<String> optionContents = entry.getValue();
			String topicName = question.getSubtopic().getTopic().getTopicName();
			String subtopicName = question.getSubtopic().getSubtopicName();
			int subtopicId = question.getSubtopic().getSubtopicId();
			return new LearningAssessmentAllQuestionsDto(question, optionContents, topicName, subtopicName, subtopicId);
		}).toList();
	}

	/**
	 * Filters questions by Topic. This method retrieves a list of questions that
	 * match the specified topic only.
	 * 
	 * @param topicId the ID of the topic to filter by
	 * @return a list of LearningAssessmentAllQuestionsDto objects, each
	 *         representing a question that matches the specified filters
	 */

	@Override
	public List<LearningAssessmentAllQuestionsDto> filterQuestionByTopic(int topicId) {
		return engineDao.getAllQuestionAndAnswerByTopic(topicId);
	}

	/**
	 * Filters questions by Subtopic.
	 * 
	 * This method retrieves a list of questions that match the specified topic ID
	 * and subtopic ID.
	 * 
	 * @param topicId    the ID of the topic to filter by
	 * @param subTopicId the ID of the subtopic to filter by
	 * 
	 * @return a list of LearningAssessmentAllQuestionsDto objects, each
	 *         representing a question that matches the specified filters
	 */

	@Override
	public List<LearningAssessmentAllQuestionsDto> filterQuestionBySubTopic(int topicId, int subTopicId) {
		return engineDao.getAllQuestionAndAnswerBySubTopic(topicId, subTopicId);

	}

	/**
	 * Filters questions by Complexity.
	 * 
	 * This method retrieves a list of questions that match the specified topic ID,
	 * subtopic ID and Complexity.
	 * 
	 * @param topicId    the ID of the topic to filter by
	 * @param subTopicId the ID of the subtopic to filter by
	 * @param complexity the complexity level of the questions to filter by (e.g.
	 *                   easy, medium, hard)
	 * @return a list of LearningAssessmentAllQuestionsDto objects, each
	 *         representing a question that matches the specified filters
	 */

	@Override
	public List<LearningAssessmentAllQuestionsDto> filterQuestioByQuestionComplexity(int topicId, int subTopicId,
			String complexity) {
		return engineDao.getAllQuestionAndAnswerByComplexity(topicId, subTopicId, complexity);
	}

	/**
	 * Filters questions by question type.
	 * 
	 * This method retrieves a list of questions that match the specified topic ID,
	 * subtopic ID, complexity, and question type.
	 * 
	 * @param topicId      the ID of the topic to filter by
	 * @param subTopicId   the ID of the subtopic to filter by
	 * @param complexity   the complexity level of the questions to filter by (e.g.
	 *                     easy, medium, hard)
	 * @param questionType the type of questions to filter by (e.g. multiple choice,
	 *                     true/false, etc.)
	 * @return a list of LearningAssessmentAllQuestionsDto objects, each
	 *         representing a question that matches the specified filters
	 */

	@Override
	public List<LearningAssessmentAllQuestionsDto> filterQuestioByQuestiontype(int topicId, int subTopicId,
			String complexity, String questionType) {
		return engineDao.getAllQuestionAndAnswerByQuestionType(topicId, subTopicId, complexity, questionType);
	}

	/**
	 * @author logeshkarthik.Sekar
	 * @since 28-06-2024
	 * @version 1.0
	 */

	/**
	 * getting Correct answer in on demand basis. This method retrieves a question
	 * Id.
	 * 
	 * @param topicId the ID of the topic to filter by
	 * @return a list of Correct Options in The String
	 * 
	 */
	@Override
	public List<String> getCorrectOptions(int questionId) {
		return engineDao.getCorrectOptions(questionId);
	}

	/**
	 * getting get Specific Question on demand basis. This method retrieves a
	 * question Id.
	 * 
	 * @param topicId the ID of the topic to filter by
	 * @return a Question
	 * 
	 */
	@Override
	public String getQuestionContent(int questionId) {
		return engineDao.getQuestionContent(questionId);
	}

	/**
	 * Creates a LearningAssessmentAllQuestionsDto object from a
	 * MultipleChoiceQuestion and a list of option contents.
	 * 
	 * This method extracts the topic name, subtopic name, and subtopic ID from the
	 * question, and uses them to create a LearningAssessmentAllQuestionsDto object
	 * along with the question and option contents.
	 * 
	 * @param question       the MultipleChoiceQuestion to create a DTO for
	 * @param optionContents the list of option contents for the question
	 * 
	 * @return a LearningAssessmentAllQuestionsDto object representing the question
	 *         and its options
	 */

	private LearningAssessmentAllQuestionsDto createRandomizedQuestionDTO(MultipleChoiceQuestion question,
			List<String> optionContents) {

		String topicName = question.getSubtopic().getTopic().getTopicName();
		String subtopicName = question.getSubtopic().getSubtopicName();
		int subtopicId = question.getSubtopic().getSubtopicId();
		return new LearningAssessmentAllQuestionsDto(question, optionContents, topicName, subtopicName, subtopicId);

	}

	/**
	 * Retrieves the count of questions for a specific topic, categorized by
	 * complexity levels.
	 * 
	 * Fetches and returns the number of questions for each complexity level (Basic,
	 * Intermediate, Hard) within the specified topic.
	 *
	 * @param topicId The ID of the topic for which question counts are retrieved.
	 * @return A map where keys are complexity levels and values are the counts of
	 *         questions for each level.
	 */

	@Override
	public Map<String, Long> getTopicBasedQuestionCount(int topicId) {
		// Initialize the map to store counts for each complexity
		Map<String, Long> complexityCounts = new HashMap<>();

		// Execute queries for each complexity level and store results in the map
		complexityCounts.put(MessageConstants.COMPLEXITY_BASIC,
				engineDao.executeCountQuery(topicId, MessageConstants.COMPLEXITY_BASIC));
		complexityCounts.put(MessageConstants.COMPLEXITY_INTERMEDIATE,
				engineDao.executeCountQuery(topicId, MessageConstants.COMPLEXITY_INTERMEDIATE));
		complexityCounts.put(MessageConstants.COMPLEXITY_HARD,
				engineDao.executeCountQuery(topicId, MessageConstants.COMPLEXITY_HARD));

		return complexityCounts;
	}

	/**
	 * Retrieves the count of questions for a specific subtopic, categorized by
	 * complexity levels.
	 * 
	 * Fetches and returns the number of questions for each complexity level (Basic,
	 * Intermediate, Hard) within the specified subtopic.
	 *
	 * @param subtopicId The ID of the subtopic for which question counts are
	 *                   retrieved.
	 * @return A map where keys are complexity levels and values are the counts of
	 *         questions for each level.
	 */

	@Override
	public Map<String, Long> getSubtopicComplexityQuestionCount(int subtopicId) {
		// Initialize the map to store counts for each complexity
		Map<String, Long> complexityCounts = new HashMap<>();

		// Execute queries for each complexity level and store results in the map
		complexityCounts.put(MessageConstants.COMPLEXITY_BASIC,
				engineDao.executeSubtopicComplexityCount(subtopicId, MessageConstants.COMPLEXITY_BASIC));
		complexityCounts.put(MessageConstants.COMPLEXITY_INTERMEDIATE,
				engineDao.executeSubtopicComplexityCount(subtopicId, MessageConstants.COMPLEXITY_INTERMEDIATE));
		complexityCounts.put(MessageConstants.COMPLEXITY_HARD,
				engineDao.executeSubtopicComplexityCount(subtopicId, MessageConstants.COMPLEXITY_HARD));

		return complexityCounts;
	}

	/**
	 * Retrieves a list of learning assessment questions based on the specified type
	 * and assessment ID. Supports types "L0" (level zero), "L1" (level one with
	 * limits), "L2" (level two), and "L3" (level three).
	 *
	 * @param type         The type of assessment questions to retrieve ("L0", "L1",
	 *                     "L2", or "L3").
	 * @param assessmentId The ID of the assessment for which questions are
	 *                     retrieved.
	 * @return A list of learning assessment questions.
	 * @throws IllegalArgumentException if the provided type is invalid.
	 */

	@Override
	public List<LearningAssessmentAllQuestionsDto> getAllTypeOfQuestions(String type, int assessmentId) {
		return switch (type) {
		case "L0" -> getLevelZeroOrOneAssessmentQuestions(assessmentId, MessageConstants.FALSE_VARIABLE);
		case "L1" -> getLevelZeroOrOneAssessmentQuestions(assessmentId, MessageConstants.TRUE_VARIABLE);
		case "L2" -> getLevelTwoAssessmentQuestions(assessmentId);
		case "L3" -> getLevelThreeAssessmentQuestions(assessmentId);

		default -> throw new IllegalArgumentException("Unexpected value: " + type);
		};
	}

	/**
	 * Retrieves a list of randomized {@link LearningAssessmentAllQuestionsDto}
	 * objects for a level 2 assessment. Fetches questions from all subtopics and
	 * limits the result to the total number specified in the criteria.
	 *
	 * @param assessmentId The ID of the level 2 assessment to fetch questions for.
	 * @return A list of {@link LearningAssessmentAllQuestionsDto} representing the
	 *         randomized questions.
	 */

	public List<LearningAssessmentAllQuestionsDto> getLevelTwoAssessmentQuestions(int assessmentId) {
		ModerateLearningAssessment moderateLearningAssessment = engineDao
				.getLevelTwoLearningAssessmentCriteria(assessmentId);
		int totalCount = moderateLearningAssessment.getNumberOfQuestion();

		List<LearningAssessmentAllQuestionsDto> moderateQuestions = moderateLearningAssessment.getSubTopic().stream()
				.flatMap(subtopic -> {
					List<MultipleChoiceQuestion> basicQuestions = engineDao
							.getAllSubtopicQuestion(subtopic.getSubtopicId(), MessageConstants.COMPLEXITY_BASIC);
					List<MultipleChoiceQuestion> intermediateQuestions = engineDao
							.getAllSubtopicQuestion(subtopic.getSubtopicId(), MessageConstants.COMPLEXITY_INTERMEDIATE);
					List<MultipleChoiceQuestion> hardQuestions = engineDao
							.getAllSubtopicQuestion(subtopic.getSubtopicId(), MessageConstants.COMPLEXITY_HARD);

					// Shuffle the questions
					Collections.shuffle(basicQuestions);
					Collections.shuffle(intermediateQuestions);
					Collections.shuffle(hardQuestions);

					// Map each question to LearningAssessmentAllQuestionsDto and create a stream
					Stream<LearningAssessmentAllQuestionsDto> basicStream = basicQuestions.stream()
							.map(question -> createRandomizedQuestionDTO(question,
									engineDao.getOptionContentsForQuestion(question)));
					Stream<LearningAssessmentAllQuestionsDto> intermediateStream = intermediateQuestions.stream()
							.map(question -> createRandomizedQuestionDTO(question,
									engineDao.getOptionContentsForQuestion(question)));
					Stream<LearningAssessmentAllQuestionsDto> hardStream = hardQuestions.stream()
							.map(question -> createRandomizedQuestionDTO(question,
									engineDao.getOptionContentsForQuestion(question)));

					// Combine all streams into one and collect into a List
					return Stream.of(basicStream, intermediateStream, hardStream).flatMap(Function.identity()).toList()
							.stream();
				}).collect(Collectors.toList());

		// Shuffle the combined list to ensure randomness across all questions
		Collections.shuffle(moderateQuestions);

		// Limit to totalCount and return the result
		return moderateQuestions.stream().limit(totalCount).toList();
	}

	/**
	 * Retrieves a list of randomized {@link LearningAssessmentAllQuestionsDto} for
	 * level zero or level one assessments. The number of questions per difficulty
	 * level is limited based on criteria if {@code applyLimits} is {@code true}.
	 *
	 * @param assessmentId The ID of the assessment to fetch criteria and questions
	 *                     for.
	 * @param applyLimits  If {@code true}, limits the number of questions per
	 *                     difficulty level as specified in the criteria.
	 * @return A list of {@link LearningAssessmentAllQuestionsDto} containing the
	 *         randomized questions.
	 */

	public List<LearningAssessmentAllQuestionsDto> getLevelZeroOrOneAssessmentQuestions(int assessmentId,
			boolean applyLimits) {
		// Initialize variables
		int totalCount = 0;
		int basicCount = 0;
		int intermediateCount = 0;
		int hardCount = 0;
		int topicId = 0;

		// Conditional block to fetch learning assessment criteria
		QuickLearningAssessment learningAssessment = null;
		LevelZeroLearningAssessment zeroLearningAssessment = null;
		if (applyLimits) {
			learningAssessment = engineDao.getLevelOneLearningAssessmentCriteria(assessmentId);
			totalCount = learningAssessment.getNumberOfQuestion();
			basicCount = learningAssessment.getBasic();
			intermediateCount = learningAssessment.getIntermediate();
			hardCount = learningAssessment.getHard();
			topicId = learningAssessment.getTopicId();
		} else {
			zeroLearningAssessment = engineDao.getLevelZeroLearningAssessmentCriteria(assessmentId);
			totalCount = zeroLearningAssessment.getNumberOfQuestion();
			topicId = zeroLearningAssessment.getTopicId();

			LOGGER.info("Level Zero Calling...");

		}

		// Fetch all questions based on complexity
		List<MultipleChoiceQuestion> basicQuestions = engineDao.getAllTopicQuestion(topicId,
				MessageConstants.COMPLEXITY_BASIC);
		List<MultipleChoiceQuestion> intermediateQuestions = engineDao.getAllTopicQuestion(topicId,
				MessageConstants.COMPLEXITY_INTERMEDIATE);
		List<MultipleChoiceQuestion> hardQuestions = engineDao.getAllTopicQuestion(topicId,
				MessageConstants.COMPLEXITY_HARD);

		// Shuffle the questions
		Collections.shuffle(basicQuestions);
		Collections.shuffle(intermediateQuestions);
		Collections.shuffle(hardQuestions);

		// Create streams for each difficulty level with or without limits
		Stream<LearningAssessmentAllQuestionsDto> basicStream = createRandomizedDTOStream(basicQuestions,
				applyLimits ? basicCount : -1);
		Stream<LearningAssessmentAllQuestionsDto> intermediateStream = createRandomizedDTOStream(intermediateQuestions,
				applyLimits ? intermediateCount : -1);
		Stream<LearningAssessmentAllQuestionsDto> hardStream = createRandomizedDTOStream(hardQuestions,
				applyLimits ? hardCount : -1);

		// Concatenate all streams and collect into a list
		List<LearningAssessmentAllQuestionsDto> questions = Stream.of(basicStream, intermediateStream, hardStream)
				.flatMap(Function.identity()).collect(Collectors.toList());

		// Shuffle the combined list to ensure randomness across difficulty levels
		Collections.shuffle(questions);

		// Return up to totalCount questions (if totalCount < questions.size())
		return questions.stream().limit(totalCount).toList();
	}

	/**
	 * @author karpagam.boothanathan
	 * @since 23-07-2024
	 * @version 1.0
	 */

	/**
	 * Retrieves a list of randomized {@link LearningAssessmentAllQuestionsDto}
	 * objects for a level 3 assessment. Generates questions from all subtopics
	 * based on the provided assessment criteria.
	 *
	 * @param assessmentId The ID of the level 3 assessment to fetch questions for.
	 * @return A list of {@link LearningAssessmentAllQuestionsDto} containing
	 *         randomized questions for the assessment.
	 */

	public List<LearningAssessmentAllQuestionsDto> getLevelThreeAssessmentQuestions(int assessmentId) {

		// Fetch criteria for level 3 assessment
		LevelThreeLearningAssessment assessmentCriteria = engineDao
				.getLevelThreeLearningAssessmentCriteria(assessmentId);
		int totalCount = assessmentCriteria.getTotalNumberOfQuestions();

		// Fetch chosen questions which specify counts for each complexity level
		List<ChosenQuestion> chosenQuestions = assessmentCriteria.getChosenQuestions();

		// List to hold all questions
		List<LearningAssessmentAllQuestionsDto> levelThreeQuestions = chosenQuestions.stream()
				.flatMap(chosenQuestion -> {
					// Fetch questions for each complexity level and subtopic ID
					List<MultipleChoiceQuestion> basicQuestions = engineDao.getAllSubtopicQuestion(
							chosenQuestion.getSubtopicId().intValue(), MessageConstants.COMPLEXITY_BASIC);
					List<MultipleChoiceQuestion> intermediateQuestions = engineDao.getAllSubtopicQuestion(
							chosenQuestion.getSubtopicId().intValue(), MessageConstants.COMPLEXITY_INTERMEDIATE);
					List<MultipleChoiceQuestion> hardQuestions = engineDao.getAllSubtopicQuestion(
							chosenQuestion.getSubtopicId().intValue(), MessageConstants.COMPLEXITY_HARD);

					// Shuffle the questions
					Collections.shuffle(basicQuestions);
					Collections.shuffle(intermediateQuestions);
					Collections.shuffle(hardQuestions);

					// Limit the number of questions fetched based on the counts specified
					basicQuestions = basicQuestions.stream().limit(chosenQuestion.getBasicCount()).toList();
					intermediateQuestions = intermediateQuestions.stream().limit(chosenQuestion.getIntermediateCount())
							.toList();
					hardQuestions = hardQuestions.stream().limit(chosenQuestion.getHardCount()).toList();

					// Map each question to LearningAssessmentAllQuestionsDto and create a stream
					Stream<LearningAssessmentAllQuestionsDto> basicStream = basicQuestions.stream()
							.map(question -> createRandomizedQuestionDTO(question,
									engineDao.getOptionContentsForQuestion(question)));
					Stream<LearningAssessmentAllQuestionsDto> intermediateStream = intermediateQuestions.stream()
							.map(question -> createRandomizedQuestionDTO(question,
									engineDao.getOptionContentsForQuestion(question)));
					Stream<LearningAssessmentAllQuestionsDto> hardStream = hardQuestions.stream()
							.map(question -> createRandomizedQuestionDTO(question,
									engineDao.getOptionContentsForQuestion(question)));

					// Combine all streams into one and collect into a List
					return Stream.of(basicStream, intermediateStream, hardStream).flatMap(Function.identity()).toList()
							.stream();
				}).collect(Collectors.toList());

		// Shuffle the combined list to ensure randomness across all questions
		Collections.shuffle(levelThreeQuestions);

		// Limit to totalCount and return the result
		return levelThreeQuestions.stream().limit(totalCount).toList();
	}

	/**
	 * Converts a list of {@link MultipleChoiceQuestion} into a stream of randomized
	 * {@link LearningAssessmentAllQuestionsDto} objects. Limits the stream to the
	 * specified number of elements if {@code limit} is greater than zero.
	 *
	 * @param questions The list of {@link MultipleChoiceQuestion} to process.
	 * @param limit     The maximum number of DTOs to include in the stream; if
	 *                  {@code <= 0}, no limit is applied.
	 * @return A {@link Stream} of {@link LearningAssessmentAllQuestionsDto}.
	 */

	private Stream<LearningAssessmentAllQuestionsDto> createRandomizedDTOStream(List<MultipleChoiceQuestion> questions,
			int limit) {
		LOGGER.info("Questions:{}", questions);
		Stream<LearningAssessmentAllQuestionsDto> stream = questions.stream().map(
				question -> createRandomizedQuestionDTO(question, engineDao.getOptionContentsForQuestion(question)));

		LOGGER.info("stream:{}", stream);

		if (limit > 0) {
			stream = stream.limit(limit);
		}

		return stream;
	}

	/**
	 * This method is to get question counts based on the subtopic
	 * 
	 * @param subtopicId In which the question count to be filtered
	 * @return question count based on the subtopic.
	 */

	@Override
	public long getSubtopicBasedQuestionCount(int subtopicId) {
		return engineDao.executeSubtopicCountQuery(subtopicId);
	}

}
