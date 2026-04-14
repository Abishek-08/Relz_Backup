package com.rts.cap.service.impl;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.LearningAssessmentEngineDao;
import com.rts.cap.dao.LearningAssessmentEvaluationDao;
import com.rts.cap.dao.LearningAssessmentQbDao;
import com.rts.cap.dao.ScheduleAssessmentDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.dto.LearningAssessmentAllQuestionsDto;
import com.rts.cap.dto.LearningAssessmentReportDto;
import com.rts.cap.dto.LearningAssessmentScoreCardDto;
import com.rts.cap.model.Answer;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.MultipleChoiceQuestion;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.User;
import com.rts.cap.service.LearningAssessmentEvaluationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Service implementation for evaluating learning assessments.
 */

/**
 * @author prasanth.baskaran
 * @since 16-07-2024
 * @version 3.0
 */

/**
 * @author karpagam.b
 * @since 19-07-2024
 * @version 4.0
 */
@Service
@Transactional
@RequiredArgsConstructor
public class LearningAssessmentEvaluationServiceImpl implements LearningAssessmentEvaluationService {

	private static final Logger LOGGER = LogManager.getLogger(LearningAssessmentEvaluationServiceImpl.class);

	private final LearningAssessmentEvaluationDao evaluationDao;
	private final LearningAssessmentQbDao assessmentQbDao;
	private final LearningAssessmentEngineDao assessmentEngineDao;
	private final ScheduleAssessmentDao scheduleAssessmentDao;
	private final UserDao userDao;
	private final ObjectMapper objectMapper;

	/**
	 * Evaluates and updates the learning assessment based on the score card data.
	 * 
	 * Processes `LearningAssessmentScoreCardDto` to:
	 * 1. Extract details and convert answers to a map.
	 * 2. Calculate marks, percentage, and pass/fail status.
	 * 3. Create and save a `LearningAssessmentScoreCard` with a CSV report.
	 */

	@Override
	public boolean evaluateAssessment(LearningAssessmentScoreCardDto learningAssessmentScoreCardDto) {
		try {
			// Extract necessary information from DTO
			Object selectedAnswer = learningAssessmentScoreCardDto.getSelectedAnswer();
			int schedulingId = learningAssessmentScoreCardDto.getSchedulingId();
			String topicName = learningAssessmentScoreCardDto.getTopicName();
			int assessmentId = learningAssessmentScoreCardDto.getAssessmentId();
			int userId = learningAssessmentScoreCardDto.getUserId();
			String type = learningAssessmentScoreCardDto.getType();
			List<LearningAssessmentAllQuestionsDto> questionContent = learningAssessmentScoreCardDto
					.getQuestionContent();

			// Convert selected answer map from DTO
			Map<String, Object> examAnswers = objectMapper.convertValue(selectedAnswer,
					new TypeReference<Map<String, Object>>() {
					});

			// Initialize total marks accumulator
			double totalMarks = examAnswers.entrySet().stream()
					.mapToDouble(entry -> evaluateQuestionMark(Integer.parseInt(entry.getKey()), entry.getValue()))
					.sum();

			int totalMaxMarks = questionContent.stream()
					.mapToInt(question -> evaluationDao.getQuestionWholeMark(question.getQuestionId())).sum();

			// Calculate percentage marks
			double percentageMarks = (totalMaxMarks > 0) ? (totalMarks / totalMaxMarks) * 100 : 0;
			LOGGER.info("Total marks (out of 100):{}", percentageMarks);

			// Determine assessment status based on pass marks criteria
			int passMark = getPassMarkBasedOnType(type, assessmentId);
			String status = (percentageMarks >= passMark) ? MessageConstants.RESULT_PASS : MessageConstants.RESULT_FAIL;

			// Create score card object
			LearningAssessmentScoreCard assessmentScore = new LearningAssessmentScoreCard();
			assessmentScore.setScoreId(evaluationDao.getLearningAssementScoreId(schedulingId, userId));
			assessmentScore.setScore(Double.parseDouble(String.format("%.2f", percentageMarks)));
			assessmentScore.setStatus(status);
			assessmentScore.setUser(userDao.findUserById(userId));
			assessmentScore.setScheduleAssessment(scheduleAssessmentDao.findScheduleAssessmentById(schedulingId));
			assessmentScore.setTopicId(assessmentQbDao.getOrCreateTopic(topicName));
			assessmentScore.setCompletionStatus(MessageConstants.COMPLETION_STATUS);

			// Write assessment details to CSV and get byte array
			byte[] csvBytes = writeAssessmentDetailsToCSV(learningAssessmentScoreCardDto);
			assessmentScore.setAssessmentReport(csvBytes);
			// Add score card to database
			return evaluationDao.addScoreforLearningAssessment(assessmentScore);

		} catch (Exception e) {
			LOGGER.error("Error Occuring While Add a Scorecard", e);
		}
		return MessageConstants.FALSE_VARIABLE;
	}

	/**
	 * Evaluates and returns the marks for a question based on the user's answer.
	 * 
	 * For single-select questions ("SSQ"), returns marks if the user's answer matches the correct one. 
	 * For multi-select questions ("MSQ"), sums marks for all correct selected answers. 
	 * Returns 0.0 if the question type is unrecognized or answers are not found.
	 */

	@SuppressWarnings("unchecked")
	private double evaluateQuestionMark(int questionId, Object selectedAnswer) {
		MultipleChoiceQuestion question = assessmentQbDao.getQuestionById(questionId);

		if (question == null || selectedAnswer == null) {
			return 0.0;
		}

	
		List<Answer> correctAnswers = evaluationDao.getCorrectAnswer(questionId);

		if ("SSQ".equals(question.getQuestionType())) {
			// Single-select question
			String selectedStringAnswer = (String) selectedAnswer;
			return correctAnswers.stream().filter(answer -> answer.getOptionContent().equals(selectedStringAnswer))
					.findFirst().map(Answer::getOptionMark).orElse(0.0);
		} else if ("MSQ".equals(question.getQuestionType())) {
			// Multi-select question
			List<String> selectedMultipleAnswers;
			if (selectedAnswer instanceof List<?>) {
				selectedMultipleAnswers = (List<String>) selectedAnswer;
			} else {
				selectedMultipleAnswers = List.of((String) selectedAnswer);
			}
			return correctAnswers.stream().filter(answer -> selectedMultipleAnswers.contains(answer.getOptionContent()))
					.mapToDouble(Answer::getOptionMark).sum();
		} else {
			return 0.0; // Handle other question types if needed
		}
	}

	/**
	 * Method to get pass mark based on assessment type (L0 , L1, L2, L3)
	 * 
	 */
	private int getPassMarkBasedOnType(String type, int assessmentId) {
		return switch (type) {
		case "L0" -> assessmentEngineDao.getLevelZeroLearningAssessmentCriteria(assessmentId).getPassMark();
		case "L1" -> assessmentEngineDao.getLevelOneLearningAssessmentCriteria(assessmentId).getPassMark();
		case "L2" -> assessmentEngineDao.getLevelTwoLearningAssessmentCriteria(assessmentId).getPassMark();
		case "L3" -> assessmentEngineDao.getLevelThreeLearningAssessmentCriteria(assessmentId).getPassMarks();
		default -> throw new IllegalArgumentException("Unexpected value: " + type);
		};
	}

	/**
	 * Generates a CSV report of assessment details from the provided score card data.
	 * 
	 * Creates a CSV with columns for questions, complexity, marks, type, topic, subtopic, options, selected answers, and evaluation marks.
	 * Uses `LearningAssessmentScoreCardDto` to format and return the CSV as a byte array.
	 */


	public byte[] writeAssessmentDetailsToCSV(LearningAssessmentScoreCardDto assessmentScoreCardDto)
			throws IOException {
		String[] header = { "Questions", "Complexity", "Mark", "Question Type", "Topic Name", "Subtopic Name",
				"Option Contents", "Selected Answer", "Question Evaluation Mark" };

		try (ByteArrayOutputStream baos = new ByteArrayOutputStream(); @SuppressWarnings("deprecation")
		CSVPrinter printer = new CSVPrinter(new OutputStreamWriter(baos, StandardCharsets.UTF_8),
				CSVFormat.DEFAULT.withHeader(header))) {

			Map<String, Object> examAnswers = objectMapper.convertValue(assessmentScoreCardDto.getSelectedAnswer(),
					new TypeReference<Map<String, Object>>() {
					});

			List<LearningAssessmentAllQuestionsDto> questions = assessmentScoreCardDto.getQuestionContent();
			for (LearningAssessmentAllQuestionsDto question : questions) {
				MultipleChoiceQuestion questionContent = assessmentQbDao.getQuestionById(question.getQuestionId());
				Object selectedAnswer = examAnswers.get(String.valueOf(question.getQuestionId()));
				double questionEvaluationMark = evaluateQuestionMark(questionContent.getQuestionId(), selectedAnswer);

				// Ensure that each field is correctly formatted for CSV
				printer.printRecord(question.getContent(), question.getComplexity(), question.getMark(),
						question.getQuestionType(), question.getTopicName(), question.getSubtopicName(),
						String.join(";", question.getOptionContents()), formatSelectedAnswer(selectedAnswer),
						questionEvaluationMark);
			}

			printer.flush();
			return baos.toByteArray();
		}
	}

	/**
	 * Formats selected answers for CSV output.
	 * 
	 * Converts a list of answers to a semicolon-separated string or a single answer to its string representation. Returns an empty string if `selectedAnswer` is `null`.
	 */

	@SuppressWarnings("unchecked")
	private String formatSelectedAnswer(Object selectedAnswer) {
		if (selectedAnswer == null) {
			return ""; // Handle null value
		}
		if (selectedAnswer instanceof List<?>) {
			return String.join(";", (List<String>) selectedAnswer);
		} else {
			return selectedAnswer.toString();
		}
	}

	/**
	 * Parses a CSV report into a list of `LearningAssessmentReportDto` objects.
	 * 
	 * Retrieves a CSV byte array for a specific assessment and user, and converts it into DTOs representing assessment details. Handles columns such as questions, complexity, marks, type, topic, subtopic, options, selected answers, and evaluation marks. Logs errors during parsing but continues processing.
	 */

	public List<LearningAssessmentReportDto> getUserAssessmentReport(int scheduleAssessmentId, int userId) {
		byte[] assessmentReport = evaluationDao.getUserLearningAssessmentReport(scheduleAssessmentId, userId);

		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(new ByteArrayInputStream(assessmentReport), StandardCharsets.UTF_8));
				@SuppressWarnings("deprecation")
				CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

			List<LearningAssessmentReportDto> reportList = new ArrayList<>();

			for (CSVRecord recordData : csvParser) {
				try {
					LearningAssessmentReportDto dto = new LearningAssessmentReportDto();
					dto.setQuestion(recordData.get("Questions").trim());
					dto.setComplexity(recordData.get("Complexity").trim());
					dto.setQuestionMark(parseInteger(recordData.get("Mark").trim()));
					dto.setQuestionType(recordData.get("Question Type").trim());
					dto.setTopicName(recordData.get("Topic Name").trim());
					dto.setSubtopicName(recordData.get("Subtopic Name").trim());
					dto.setOptionGiven(recordData.get("Option Contents").trim());
					dto.setSelectedAnswers(recordData.get("Selected Answer").trim());
					dto.setEvaluationMark(parseDouble(recordData.get("Question Evaluation Mark").trim()));

					reportList.add(dto);
				} catch (Exception e) {
					LOGGER.error("Error Occuring While set a data in dto", e);
				}
			}

			return reportList;
		} catch (Exception e) {
			e.printStackTrace();
			return List.of();
		}
	}

	/**
	 * Parses a string value into an `Integer`.
	 * 
	 * This method attempts to convert a given string into an `Integer`. If the
	 * string cannot be parsed into an integer (e.g., due to improper format), it
	 * catches the `NumberFormatException` and logs an error. In such cases, it
	 * returns a default value of `0`.
	 */
	private Integer parseInteger(String value) {
		try {
			return Integer.parseInt(value);
		} catch (NumberFormatException e) {
			LOGGER.error("Invalid integer value:{}", value);
			return 0;
		}
	}

	/**
	 * Parses a string value into a `Double`.
	 * 
	 * This method attempts to convert a given string into a `Double`. If the string
	 * cannot be parsed into a double (e.g., due to improper format), it catches the
	 * `NumberFormatException` and logs an error. In such cases, it returns a
	 * default value of `0.0`.
	 */
	private Double parseDouble(String value) {
		try {
			return Double.parseDouble(value);
		} catch (NumberFormatException e) {
			LOGGER.error("Invalid double value:{}", value);
			return 0.0;
		}
	}

	/**
	 * Creates and saves a new `LearningAssessmentScoreCard` with initial status "NIL" and completion status "started".
	 * 
	 * Sets schedule assessment and user if found, otherwise leaves them unset. Sets topic ID and assessment report to `null`. Returns the result of the save operation.
	 */

	public boolean addScoreCardCompletionStatus(int schedulingId, int userId) {
		// Use Optional to handle potential null values
		Optional<ScheduleAssessment> scheduleAssessmentOpt = Optional
				.ofNullable(scheduleAssessmentDao.findScheduleAssessmentById(schedulingId));
		Optional<User> userOpt = Optional.ofNullable(userDao.findUserById(userId));
		LearningAssessmentScoreCard assessmentScoreCard = new LearningAssessmentScoreCard();
		assessmentScoreCard.setStatus("NIL");
		assessmentScoreCard.setCompletionStatus("started");
		scheduleAssessmentOpt.ifPresent(assessmentScoreCard::setScheduleAssessment);
		userOpt.ifPresent(assessmentScoreCard::setUser);
		assessmentScoreCard.setTopicId(null);
		assessmentScoreCard.setAssessmentReport(null);

		// Save the score card and return the result
		return evaluationDao.addScoreforLearningAssessment(assessmentScoreCard);
	}

	/**
	 * Retrieves a list of scheduled assessments that have associated score cards.
	 * 
	 * This method fetches all scheduled assessments from the database that have
	 * score cards associated with them. The list returned by this method includes
	 * all schedule assessments where score cards are available.
	 */
	@Override
	public List<ScheduleAssessment> getScoreCardScheduleAssessment() {
		return evaluationDao.getScoreCardScheduleAssessment();
	}

	/**
	 * Retrieves a list of users associated with a specific scheduled assessment.
	 * 
	 * This method fetches the list of users who are associated with a particular
	 * scheduled assessment. The `scheduleId` parameter is used to identify the
	 * specific scheduled assessment for which the user list is retrieved.
	 */
	@Override
	public List<User> getScoreCardUserList(int scheduleId) {
		return evaluationDao.getScoreCardUserList(scheduleId);
	}

	/**
	 * Retrieves a list of users associated with a specific scheduled assessment.
	 * 
	 * This method fetches the list of users who are associated with a particular
	 * scheduled assessment. The `scheduleId` parameter is used to identify the
	 * specific scheduled assessment for which the user list is retrieved.
	 */
	@Override
	public LearningAssessmentScoreCard getScoreCardDetails(int scheduleId, int userId) {
		return evaluationDao.getScoreCardDetails(scheduleId, userId);
	}

	/**
	 * Retrieves the details of a score card for a specific scheduled assessment and
	 * user.
	 * 
	 * This method fetches the `LearningAssessmentScoreCard` details for a given
	 * `scheduleId` and `userId`. It returns the score card details from the
	 * database for the specified assessment and user.
	 */
	@Override
	public boolean getCompletionCount(int schedulingId, int userId) {
		return evaluationDao.getCompletionCount(schedulingId, userId);
	}
}
