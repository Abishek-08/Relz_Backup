package com.rts.cap.dao.impl;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.ScheduleAssessmentDao;
import com.rts.cap.model.Assessment;
import com.rts.cap.model.FeedbackDynamicAttribute;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.SecretKey;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

/**
 * @author ranjitha.rajaram
 * @since 04-07-2024
 * @version 2.0
 */

@Repository
public class ScheduleAssessmentDaoImpl implements ScheduleAssessmentDao {

	private static final Logger LOGGER = LogManager.getLogger(ScheduleAssessmentDaoImpl.class);

	private EntityManager entityManager;

	/**
	 * This is an Dependency injection for the EntityManager using constructor
	 * 
	 * @param entityManager
	 */
	public ScheduleAssessmentDaoImpl(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Creates a new ScheduleAssessment entity and persists it to the
	 *          database.
	 * @param scheduleAssessment the ScheduleAssessment object to be created
	 * @return the created ScheduleAssessment object
	 */
	@Override
	public ScheduleAssessment createScheduleAssessment(ScheduleAssessment scheduleAssessment) {
		entityManager.persist(scheduleAssessment);
		return scheduleAssessment;

	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Finds a ScheduleAssessment by its ID.
	 * @param scheduleAssessmentId the ID of the ScheduleAssessment to find
	 * @return the ScheduleAssessment with the given ID, or null if not found
	 */
	@Override
	public ScheduleAssessment findScheduleAssessmentById(int scheduleAssessmentId) {
		return entityManager.find(ScheduleAssessment.class, scheduleAssessmentId);
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Updates an existing ScheduleAssessment.
	 * @param scheduleAssessment the ScheduleAssessment to update
	 * @return true if the update was successful, false otherwise
	 */
	@Override
	public ScheduleAssessment updateScheduleAssessment(ScheduleAssessment scheduleAssessment) {
		return entityManager.merge(scheduleAssessment);

	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Retrieves all ScheduleAssessments.
	 * @return a list of all ScheduleAssessments
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<ScheduleAssessment> getAllScheduleAssessment() {
		return entityManager.createQuery("from ScheduleAssessment order by schedulingId desc").getResultList();
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 3.0 Method for deleting particular Scheduling details
	 * @return true the deletion is successful otherwise false
	 */
	@Override
	public boolean deleteSchedulingById(int schedulingId) {
		try {
			ScheduleAssessment assessment = entityManager.find(ScheduleAssessment.class, schedulingId);
			entityManager.remove(assessment);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * @author sundhar.soundhar
	 * @since 06-07-2024
	 * @version 2.0
	 * @param user {com.rts.cap.model.User.java}
	 * @return the result in the List { java.util.List } of scheduled assessment
	 * 
	 */

	@Override
	public List<ScheduleAssessment> findScheduledSkillAssessmentOfUser(String email, String currentDate) {

		String jpqlQuery = "SELECT s FROM ScheduleAssessment s " + "JOIN s.assessment sa " + "JOIN s.user u "
				+ "JOIN SkillAssessment skill ON sa.assessmentId = skill.assessment.assessmentId "
				+ "LEFT JOIN SkillAttempt ska ON s.schedulingId = ska.scheduleAssessment.schedulingId "
				+ "WHERE u.userEmail = :userEmail " + "AND s.assessmentDate >= :currentDate "
				+ "AND ska.status is null";

		return entityManager.createQuery(jpqlQuery, ScheduleAssessment.class).setParameter("userEmail", email)
				.setParameter("currentDate", currentDate).getResultList();

	}

	/**
	 * @author sundhar.soundhar
	 * @since 07-07-2024
	 * @version 2.0
	 * @params this method takes String {java.lang} has a parameter
	 * @return ScheduleAssessment {com.rts.cap.model}
	 * 
	 */

	@Transactional
	@Override
	public SecretKey findScheduleAssessmentByAccessKey(SecretKey secretKey) {
		String jpqlQuery = "SELECT s FROM SecretKey s WHERE s.user.userId = :userId AND s.scheduleAssessment.schedulingId = :schedulingId AND s.secretKey = :secretKey";

		return entityManager.createQuery(jpqlQuery, SecretKey.class)
				.setParameter("userId", secretKey.getUser().getUserId())
				.setParameter("schedulingId", secretKey.getScheduleAssessment().getSchedulingId())
				.setParameter("secretKey", secretKey.getSecretKey()).getSingleResult();

	}

	/**
	 * @author varshinee.manisekar
	 * @since 15-07-2024
	 * @version 1.0
	 * @param userEmail      The email address of the user for whom assessments are
	 *                       scheduled.
	 * @param assessmentType The type of assessment (e.g., Quick, Moderate or
	 *                       Advanced) to filter by.
	 * @return A list of Object arrays containing ScheduleAssessment and its
	 *         associated LearningAssessment type. Each Object array element
	 *         corresponds to (ScheduleAssessment, String).
	 * 
	 */

	@Override
	public List<Object[]> findScheduledAssessmentsByEmail(String userEmail, String currentDate) {
		String jpql = "SELECT s, la.type " + "FROM ScheduleAssessment s "
				+ "JOIN LearningAssessment la ON s.assessment.assessmentId = la.assessment.assessmentId "
				+ "LEFT JOIN LearningAssessmentScoreCard lasc ON s.schedulingId = lasc.scheduleAssessment.schedulingId "
				+ "JOIN s.user u " + "WHERE u.userEmail = :userEmail " + "AND s.assessmentDate >= :currentDate "
				+ "AND lasc.completionStatus is null";

		return entityManager.createQuery(jpql, Object[].class).setParameter("userEmail", userEmail)
				.setParameter("currentDate", currentDate).getResultList();
	}

	@Override
	public List<ScheduleAssessment> findSchedulingByUser(int userId) {
		return entityManager
				.createQuery("select s distinct from ScheduleAssessment s join s.user u where u.userId=:userId",
						ScheduleAssessment.class)
				.setParameter("userId", userId).getResultList();
	}

	@Override
	public Assessment findAssessmentBySchedulingId(int schedulingId) {
		return (Assessment) entityManager
				.createQuery("select assessment from ScheduleAssessment where schedulingId=:schedulingId")
				.setParameter("schedulingId", schedulingId).getSingleResult();
	}

	@Override
	public boolean addFeedbackAttribute(FeedbackDynamicAttribute dynamicAttribute) {
		try {
			if (dynamicAttribute.getAttributeId() < 0) {
				entityManager.persist(dynamicAttribute);
			} else {
				entityManager.merge(dynamicAttribute); // Use merge for detached entities
			}
			return MessageConstants.TRUE_VARIABLE;
		} catch (Exception e) {
			LOGGER.error("Error Occurs during Add or Update Feedback Dynamic Attribute:", e);

		}
		return MessageConstants.FALSE_VARIABLE;
	}

}
