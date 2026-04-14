package com.rts.cap.dao.impl;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.LearningAssessmentEngineDao;
import com.rts.cap.dto.LearningAssessmentAllQuestionsDto;
import com.rts.cap.model.LevelThreeLearningAssessment;
import com.rts.cap.model.LevelZeroLearningAssessment;
import com.rts.cap.model.ModerateLearningAssessment;
import com.rts.cap.model.MultipleChoiceQuestion;
import com.rts.cap.model.QuickLearningAssessment;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

@Repository
public class LearningAssessmentEngineDaoImpl implements LearningAssessmentEngineDao {

	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * Retrieves a list of distinct learning questions and their corresponding
	 * answers.
	 *
	 * @return A list of {@code Object[]} arrays, where each array contains a
	 *         question and its associated answer.
	 */

	@Override
	@Transactional
	public List<Object[]> findAllDistinctLearningQuestionsAndAnswers() {
		return entityManager
				.createQuery("SELECT q, a FROM Answer a JOIN a.question q ORDER BY q.questionId ASC", Object[].class)
				.getResultList();
	}

	/**
	 * @author jeeva.sekar , logeshK.sekar
	 * @since 28-06-2024
	 * @version 1.0
	 */

	/**
	 * Retrieves a list of option contents for a given multiple-choice question.
	 *
	 * @param question The {@link MultipleChoiceQuestion} for which option contents
	 *                 are retrieved.
	 * @return A list of {@code String} representing the option contents of the
	 *         specified question.
	 */

	@SuppressWarnings("unchecked")
	private List<String> getOptionContents(MultipleChoiceQuestion question) {

		Query query = entityManager.createQuery(
				"SELECT a.optionContent " + "FROM Answer a " + "WHERE a.question = :question", String.class);

		query.setParameter(MessageConstants.LEARNING_ASSESSMENT_QUESTION, question);

		return query.getResultList();
	}

	/**
	 * Retrieves a list of all learning questions and their answers for a specific
	 * topic.
	 *
	 * @param topicId The ID of the topic for which questions and answers are
	 *                retrieved.
	 * @return A list of {@link LearningAssessmentAllQuestionsDto} containing the
	 *         questions, option contents, and topic details.
	 */

	@Override
	public List<LearningAssessmentAllQuestionsDto> getAllQuestionAndAnswerByTopic(int topicId) {
		TypedQuery<MultipleChoiceQuestion> query = entityManager.createQuery(
				MessageConstants.FILTER_BASE_QUERY + "WHERE t.topicId = :topic", MultipleChoiceQuestion.class);

		query.setParameter("topic", topicId);

		List<MultipleChoiceQuestion> questions = query.getResultList();

		// lambda expressions to map each MultipleChoiceQuestion to
		// LearningAssessmentAllQuestionsDto
		return questions.stream().map(question -> {
			List<String> optionContents = getOptionContents(question);
			String topicName = question.getSubtopic().getTopic().getTopicName();
			String subtopicName = question.getSubtopic().getSubtopicName();
			int subTopicId = question.getSubtopic().getSubtopicId();
			return new LearningAssessmentAllQuestionsDto(question, optionContents, topicName, subtopicName, subTopicId);
		}).toList();
	}

	/**
	 * Retrieves a list of all learning questions and their answers for a specific
	 * topic and subtopic.
	 *
	 * @param topicId    The ID of the topic for which questions are retrieved.
	 * @param subtopicId The ID of the subtopic for which questions are retrieved.
	 * @return A list of {@link LearningAssessmentAllQuestionsDto} containing
	 *         questions, option contents, and topic details.
	 */

	@Override
	public List<LearningAssessmentAllQuestionsDto> getAllQuestionAndAnswerBySubTopic(int topicId, int subtopicId) {
		TypedQuery<MultipleChoiceQuestion> query = entityManager.createQuery(
				MessageConstants.FILTER_BASE_QUERY + "WHERE t.topicId = :topic AND st.subtopicId = :subtopic",
				MultipleChoiceQuestion.class);

		query.setParameter("topic", topicId);
		query.setParameter("subtopic", subtopicId);

		List<MultipleChoiceQuestion> questions = query.getResultList();

		// Using lambda expressions to map each MultipleChoiceQuestion to
		// LearningAssessmentAllQuestionsDto
		return questions.stream().map(question -> {
			List<String> optionContents = getOptionContents(question);
			String topicName = question.getSubtopic().getTopic().getTopicName();
			String subtopicName = question.getSubtopic().getSubtopicName();
			int subTopicIdFromQuestion = question.getSubtopic().getSubtopicId(); // Ensure correct subtopic id retrieval
			return new LearningAssessmentAllQuestionsDto(question, optionContents, topicName, subtopicName,
					subTopicIdFromQuestion);
		}).toList();
	}

	/**
	 * Retrieves all distinct learning assessment questions and their corresponding
	 * options That are matched with the Given topic && Subtopic && Complexity.
	 *
	 * @param topicId    The ID of the topic for which questions are retrieved.
	 * @param subtopicId The ID of the subtopic for which questions are retrieved.
	 * @param complexity The value of complexity for which question retrieved
	 * @return List of Object[] where each Object[] contains a question and its
	 *         corresponding options
	 */

	@Override
	public List<LearningAssessmentAllQuestionsDto> getAllQuestionAndAnswerByComplexity(int topicId, int subtopicId,
			String complexity) {
		TypedQuery<MultipleChoiceQuestion> query = entityManager.createQuery(
				MessageConstants.FILTER_BASE_QUERY
						+ "WHERE t.topicId = :topicId AND st.subtopicId = :subtopicId AND mcq.complexity = :complexity",
				MultipleChoiceQuestion.class);

		query.setParameter(MessageConstants.TOPIC_ID, topicId);
		query.setParameter(MessageConstants.SUBTOPIC_ID, subtopicId);
		query.setParameter(MessageConstants.COMPLEXITY, complexity);

		List<MultipleChoiceQuestion> questions = query.getResultList();

		// Using lambda expressions to map each MultipleChoiceQuestion to
		// LearningAssessmentAllQuestionsDto
		return questions.stream().map(question -> {
			List<String> optionContents = getOptionContents(question);
			String topicName = question.getSubtopic().getTopic().getTopicName();
			String subtopicName = question.getSubtopic().getSubtopicName();
			int subTopicId = question.getSubtopic().getSubtopicId();
			return new LearningAssessmentAllQuestionsDto(question, optionContents, topicName, subtopicName, subTopicId);
		}).toList();
	}

	/**
	 * Retrieves all distinct learning assessment questions and their corresponding
	 * options That are matched with the Given topic && Subtopic && complexity &&
	 * questionType .
	 * 
	 * @param topicId    The ID of the topic for which questions are retrieved.
	 * @param subtopicId The ID of the subtopic for which questions are retrieved.
	 * @param complexity The value of complexity for which questions retrieved.
	 * @param questionType The value of question type [SSQ, MSQ] for which questions retrieved.
	 * @return List of Object[] where each Object[] contains a question and its
	 *         corresponding options
	 */

	@Override
	public List<LearningAssessmentAllQuestionsDto> getAllQuestionAndAnswerByQuestionType(int topicId, int subtopicId,
			String complexity, String questionType) {
		TypedQuery<MultipleChoiceQuestion> query = entityManager.createQuery(MessageConstants.FILTER_BASE_QUERY
				+ "WHERE t.topicId = :topicId AND st.subtopicId = :subtopicId AND mcq.complexity = :complexity AND mcq.questionType = :questionType",
				MultipleChoiceQuestion.class);

		query.setParameter(MessageConstants.TOPIC_ID, topicId);
		query.setParameter(MessageConstants.SUBTOPIC_ID, subtopicId);
		query.setParameter(MessageConstants.COMPLEXITY, complexity);
		query.setParameter("questionType", questionType);

		List<MultipleChoiceQuestion> questions = query.getResultList();

		// lambda expressions to map each MultipleChoiceQuestion to
		// LearningAssessmentAllQuestionsDto
		return questions.stream().map(question -> {
			List<String> optionContents = getOptionContents(question);
			String topicName = question.getSubtopic().getTopic().getTopicName();
			String subtopicName = question.getSubtopic().getSubtopicName();
			int subTopicId = question.getSubtopic().getSubtopicId();
			return new LearningAssessmentAllQuestionsDto(question, optionContents, topicName, subtopicName, subTopicId);
		}).toList();
	}

	/**
	 * Retrieves Correct answer in on demand basis
	 * 
	 * @param questionId The ID of the question for retrieving it's correct option
	 * @return List of answers in the String Format
	 */

	@Override
	public List<String> getCorrectOptions(int questionId) {
		return entityManager.createQuery(
				"SELECT a.optionContent FROM Answer a WHERE a.question.questionId = :question AND a.correctAnswer = 1",
				String.class).setParameter("question", questionId).getResultList();
	}

	/**
	 * Retrieves Specific Question on demand basis
	 * 
	 * @param questionId The ID of the question for retrieving it's option
	 * @return question content as a single result for that specific question ID
	 */

	@Override
	public String getQuestionContent(int questionId) {
		return entityManager
				.createQuery("select q.content from MultipleChoiceQuestion q where q.questionId = :questionId",
						String.class)
				.setParameter("questionId", questionId).getSingleResult();
	}

	/**
	 * Selecting All The learning assessment Answers Based On the Question content
	 *
	 * @param question The question for which it's options to be shuffled.
	 * @return List of String Answers
	 */

	@Override
	public List<String> getOptionContentsForQuestion(MultipleChoiceQuestion question) {
		List<String> answers = entityManager
				.createQuery("SELECT a.optionContent FROM Answer a WHERE a.question = :question", String.class)
				.setParameter("question", question).getResultList();
		Collections.shuffle(answers);

		return answers;
	}

	/**
	 * Counts the number of active MultipleChoiceQuestions for a specific topic and
	 * complexity level.
	 *
	 * @param topicId    the ID of the topic to filter questions by
	 * @param complexity the complexity level to filter questions by
	 * @return the number of active MultipleChoiceQuestions for the specified topic
	 *         and complexity
	 */

	@Override
	// Helper method to execute the count query for a specific complexity
	public long executeCountQuery(int topicId, String complexity) {
		// Prepare the query string with complexity condition
		String queryString = "select count(s) from MultipleChoiceQuestion s where s.subtopic.topic.topicId = :topicId AND s.complexity = :complexity AND s.isActive = 'yes'";
		// Execute the query and get the single result as Long
		return entityManager.createQuery(queryString, Long.class).setParameter(MessageConstants.TOPIC_ID, topicId)
				.setParameter(MessageConstants.COMPLEXITY, complexity).getSingleResult();
	}

	/**
	 * Counts the number of active MultipleChoiceQuestions for a specific subtopic
	 * and complexity level.
	 *
	 * @param subtopicId the ID of the subtopic to filter questions by
	 * @param complexity the complexity level to filter questions by
	 * @return the number of active MultipleChoiceQuestions for the specified
	 *         subtopic and complexity
	 */

	@Override
	// Helper method to execute the count query for a specific complexity
	public long executeSubtopicComplexityCount(int subtopicId, String complexity) {
		// Prepare the query string with complexity condition
		String queryString = "select count(s) from MultipleChoiceQuestion s where s.subtopic.subtopicId = :subtopicId AND s.complexity = :complexity AND s.isActive = 'yes'";
		// Execute the query and get the single result as Long
		return entityManager.createQuery(queryString, Long.class).setParameter(MessageConstants.SUBTOPIC_ID, subtopicId)
				.setParameter(MessageConstants.COMPLEXITY, complexity).getSingleResult();
	}

	/**
	 * Counts the number of active MultipleChoiceQuestions for a given subtopic.
	 *
	 * @param subtopicId the ID of the subtopic to count questions for
	 * @return the number of active MultipleChoiceQuestions for the specified
	 *         subtopic
	 */

	@Override
	public long executeSubtopicCountQuery(int subtopicId) {
		return entityManager.createQuery(
				"select count(s) from MultipleChoiceQuestion s where s.subtopic.subtopicId = :subtopicId AND s.isActive = 'yes'",
				Long.class).setParameter("subtopicId", subtopicId).getSingleResult();
	}

	/**
	 * Retrieves a list of active MultipleChoiceQuestions for a given topic and
	 * complexity level.
	 *
	 * @param topicId    the ID of the topic to filter questions by
	 * @param complexity the complexity level to filter questions by
	 * @return a list of MultipleChoiceQuestion objects matching the specified
	 *         criteria
	 */

	@Override
	public List<MultipleChoiceQuestion> getAllTopicQuestion(int topicId, String complexity) {

		return entityManager.createQuery("SELECT DISTINCT q FROM MultipleChoiceQuestion q"
				+ " WHERE q.complexity = :complexity AND  q.isActive = 'yes' AND q.subtopic.topic.topicId = :topicId",
				MultipleChoiceQuestion.class).setParameter("topicId", topicId).setParameter("complexity", complexity)
				.getResultList();
	}

	/**
	 * Retrieves a QuickLearningAssessment based on the provided assessment ID.
	 *
	 * @param assessmentId the ID of the assessment to retrieve
	 * @return the QuickLearningAssessment associated with the given ID
	 */

	@Override
	public QuickLearningAssessment getLevelOneLearningAssessmentCriteria(int assessmentId) {
		return entityManager
				.createQuery("select q from QuickLearningAssessment q where q.assessment.assessmentId = :assessmentId",
						QuickLearningAssessment.class)
				.setParameter("assessmentId", assessmentId).getSingleResult();
	}

	/**
	 * Retrieves a ModerateLearningAssessment based on the provided assessment ID.
	 *
	 * @param assessmentId the ID of the assessment to retrieve
	 * @return the ModerateLearningAssessment associated with the given ID
	 */

	@Override
	public ModerateLearningAssessment getLevelTwoLearningAssessmentCriteria(int assessmentId) {
		return entityManager.createQuery(
				"select q from ModerateLearningAssessment q where q.assessment.assessmentId = :assessmentId",
				ModerateLearningAssessment.class).setParameter("assessmentId", assessmentId).getSingleResult();
	}

	/**
	 * Retrieves a LevelThreeLearningAssessment based on the provided assessment ID.
	 *
	 * @param assessmentId the ID of the assessment to retrieve
	 * @return the LevelThreeLearningAssessment associated with the given ID
	 */

	@Override
	public LevelThreeLearningAssessment getLevelThreeLearningAssessmentCriteria(int assessmentId) {
		return entityManager
				.createQuery(
						"select q from LevelThreeLearningAssessment q where q.assessment.assessmentId = :assessmentId",
						LevelThreeLearningAssessment.class)
				.setParameter("assessmentId", assessmentId).getSingleResult();
	}

	/**
	 * Retrieves a list of active MultipleChoiceQuestions for a given subtopic and
	 * complexity level.
	 *
	 * @param subtopicId the ID of the subtopic to filter questions by
	 * @param complexity the complexity level to filter questions by
	 * @return a list of MultipleChoiceQuestion objects matching the specified
	 *         criteria
	 */

	@Override
	public List<MultipleChoiceQuestion> getAllSubtopicQuestion(int subtopicId, String complexity) {

		return entityManager.createQuery("SELECT DISTINCT q FROM MultipleChoiceQuestion q"
				+ " WHERE q.complexity = :complexity AND  q.isActive = 'yes' AND q.subtopic.subtopicId = :subtopicId",
				MultipleChoiceQuestion.class).setParameter("subtopicId", subtopicId)
				.setParameter("complexity", complexity).getResultList();
	}

	/**
	 * Retrieves a LevelZeroLearningAssessmentCriteria based on the provided
	 * assessment ID.
	 *
	 * @param assessmentId the ID of the assessment to retrieve
	 * @return the LevelZeroLearningAssessment associated with the given ID
	 */

	@Override
	public LevelZeroLearningAssessment getLevelZeroLearningAssessmentCriteria(int assessmentId) {

		return entityManager.createQuery(
				"select q from LevelZeroLearningAssessment q where q.assessment.assessmentId = :assessmentId",
				LevelZeroLearningAssessment.class).setParameter("assessmentId", assessmentId).getSingleResult();
	}

}
