package com.rts.cap.dao.impl;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.LearningAssessmentEvaluationDao;
import com.rts.cap.model.Answer;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.MultipleChoiceQuestion;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;

/**
 * @author prasanth.baskaran
 * @since 16-07-2024
 * @version 3.0
 */

@Repository
public class LearningAssessmentEvaluationDaoImpl implements LearningAssessmentEvaluationDao {

	private static final Logger LOGGER = LogManager.getLogger(LearningAssessmentEvaluationDaoImpl.class);

	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * Retrieves all correct answers for the given question.
	 *
	 * @param questionId the ID of the question for which to find correct answers
	 * @return a list of {@link Answer} objects that are marked as correct for the
	 *         specified question
	 */
	@Override
	public List<Answer> getCorrectAnswer(int questionId) {
		return entityManager
				.createQuery("SELECT a FROM Answer a WHERE a.question.questionId = :question AND a.correctAnswer = 1",
						Answer.class)
				.setParameter("question", questionId).getResultList();
	}

	/**
	 * Retrieves the score ID for a specific learning assessment and user.
	 *
	 * @param scheduleAssessmentId the ID of the scheduled assessment
	 * @param userId               the ID of the user
	 * @return the score ID for the given assessment and user, or 0 if no result is
	 *         found
	 */

	@Override
	public int getLearningAssementScoreId(int scheduleAssessmentId, int userId) {
		try {
			return entityManager
					.createQuery("SELECT a.scoreId FROM LearningAssessmentScoreCard a "
							+ "WHERE a.scheduleAssessment.schedulingId = :scheduleAssessmentId "
							+ "AND a.user.userId = :userId", Integer.class)
					.setParameter(MessageConstants.SCHEDULE_ASSESSMENT_ID, scheduleAssessmentId)
					.setParameter(MessageConstants.USERID_VARIABLE, userId).getSingleResult();
		} catch (NoResultException e) {
			LOGGER.error("No Results Fount in Score Id :", e);
			// Handle if no report found (return null or throw appropriate exception)
			return 0;
		}
	}

	/**
	 * Adds or updates a learning assessment score card in the database.
	 * <p>
	 * If the score ID of the provided {@link LearningAssessmentScoreCard} is less
	 * than 0, the method will insert a new record. If the score ID is 0 or greater,
	 * it will update the existing record with the provided details.
	 * </p>
	 *
	 * @param learningassessmentScoreCard the {@link LearningAssessmentScoreCard}
	 *                                    object to be added or updated
	 * @return {@code true} if the operation was successful; {@code false} otherwise
	 */
	@Override
	public boolean addScoreforLearningAssessment(LearningAssessmentScoreCard learningassessmentScoreCard) {
		try {
			if (learningassessmentScoreCard.getScoreId() < 0) {
				entityManager.persist(learningassessmentScoreCard);
			} else {
				entityManager.merge(learningassessmentScoreCard);
			}
			return MessageConstants.TRUE_VARIABLE;
		} catch (Exception e) {
			LOGGER.error("Error while adding the Score Card :", e);
			return MessageConstants.FALSE_VARIABLE;
		}
	}

	/**
	 * Retrieves the learning assessment report for a specific user and scheduled
	 * assessment.
	 * <p>
	 * This method fetches the report as a byte array from the database for the
	 * given {@code scheduleAssessmentId} and {@code userId}.
	 * </p>
	 *
	 * @param scheduleAssessmentId the ID of the scheduled assessment
	 * @param userId               the ID of the user
	 * @return a byte array representing the assessment report, or an empty byte
	 *         array if no report is found
	 */

	@Override
	public byte[] getUserLearningAssessmentReport(int scheduleAssessmentId, int userId) {
		try {
			return entityManager
					.createQuery("SELECT a.assessmentReport FROM LearningAssessmentScoreCard a "
							+ "WHERE a.scheduleAssessment.schedulingId = :scheduleAssessmentId "
							+ "AND a.user.userId = :userId", byte[].class)
					.setParameter(MessageConstants.SCHEDULE_ASSESSMENT_ID, scheduleAssessmentId)
					.setParameter(MessageConstants.USERID_VARIABLE, userId).getSingleResult();
		} catch (NoResultException e) {
			LOGGER.error("No Results Fount in Blob Report :", e);
			// Handle if no report found (return null or throw appropriate exception)
			return new byte[0];
		}
	}

	/**
	 * Retrieves a list of schedule assessments associated with learning assessment
	 * score cards.
	 * <p>
	 * This method fetches all {@link ScheduleAssessment} entities that are
	 * referenced by {@link LearningAssessmentScoreCard} records in the database.
	 * </p>
	 *
	 * @return a list of {@link ScheduleAssessment} objects associated with score
	 *         cards
	 */

	@Override
	public List<ScheduleAssessment> getScoreCardScheduleAssessment() {
		return entityManager
				.createQuery("SELECT s.scheduleAssessment FROM LearningAssessmentScoreCard s", ScheduleAssessment.class)
				.getResultList();
	}

	@Override
	public List<User> getScoreCardUserList(int scheduleId) {
		return entityManager.createQuery(
				"select a.user from LearningAssessmentScoreCard a where a.scheduleAssessment.schedulingId = :scheduleAssessmentId",
				User.class).setParameter("scheduleAssessmentId", scheduleId).getResultList();
	}

	/**
	 * Retrieves a list of users associated with a specific score card schedule.
	 * <p>
	 * This method fetches all {@link User} entities from the database that are
	 * linked to the given {@code scheduleId} through
	 * {@link LearningAssessmentScoreCard} records.
	 * </p>
	 *
	 * @param scheduleId the ID of the schedule assessment to retrieve users for
	 * @return a list of {@link User} objects associated with the specified schedule
	 *         ID
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<LearningAssessmentScoreCard> getAllScoreCard() {
		return entityManager.createQuery("from LearningAssessmentScoreCard").getResultList();
	}

	/**
	 * Retrieves the details of a learning assessment score card for a specific
	 * schedule and user.
	 * <p>
	 * This method queries the database to find a
	 * {@link LearningAssessmentScoreCard} for the given {@code scheduleId} and
	 * {@code userId}. If no matching score card is found, an empty
	 * {@link LearningAssessmentScoreCard} object is returned.
	 * </p>
	 *
	 * @param scheduleId the ID of the scheduled assessment
	 * @param userId     the ID of the user
	 * @return the {@link LearningAssessmentScoreCard} for the specified schedule
	 *         and user, or an empty {@link LearningAssessmentScoreCard} if no
	 *         result is found
	 */

	@Override
	public LearningAssessmentScoreCard getScoreCardDetails(int scheduleId, int userId) {
		try {
			return entityManager.createQuery(
					"SELECT a FROM LearningAssessmentScoreCard a where a.scheduleAssessment.schedulingId = :scheduleAssessmentId AND a.user.userId = :userId",
					LearningAssessmentScoreCard.class).setParameter(MessageConstants.SCHEDULE_ASSESSMENT_ID, scheduleId)
					.setParameter("userId", userId).getSingleResult();
		} catch (NoResultException e) {
			LOGGER.error("No Results Fount that Score Card :", e);

			return new LearningAssessmentScoreCard();
		}

	}

	/**
	 * Checks if there are any completed assessments for a specific schedule and
	 * user.
	 * <p>
	 * This method queries the database to count the number of completed assessments
	 * for the given {@code schedulingId} and {@code userId}. It returns
	 * {@code true} if one or more completions are found, and {@code false}
	 * otherwise.
	 * </p>
	 *
	 * @param schedulingId the ID of the scheduled assessment
	 * @param userId       the ID of the user
	 * @return {@code true} if there are completed assessments for the specified
	 *         schedule and user; {@code false} otherwise
	 */

	@Override
	public boolean getCompletionCount(int schedulingId, int userId) {

		return entityManager.createQuery(
				"select count(a.completionStatus) from LearningAssessmentScoreCard a where a.scheduleAssessment.schedulingId = :scheduleAssessmentId AND a.user.userId = :userId",
				long.class).setParameter(MessageConstants.SCHEDULE_ASSESSMENT_ID, schedulingId)
				.setParameter("userId", userId).getSingleResult() > 0;

	}

	/**
	 * Retrieves the whole mark for a specific multiple-choice question.
	 * <p>
	 * This method queries the database to get the mark associated with the given
	 * {@code questionId} from the {@link MultipleChoiceQuestion} entity.
	 * </p>
	 *
	 * @param questionId the ID of the question to retrieve the mark for
	 * @return the mark for the specified multiple-choice question
	 */

	@Override
	public int getQuestionWholeMark(int questionId) {
		return entityManager.createQuery("select m.mark from MultipleChoiceQuestion m where m.questionId = :questionId",
				Integer.class).setParameter("questionId", questionId).getSingleResult();
	}

}
