package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.SkillAttemptDao;
import com.rts.cap.model.SkillAttempt;
import com.rts.cap.model.SkillResult;
import com.rts.cap.model.TestResult;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

/**
 * @author sanjay.subramani
 * @since 02-09-2024
 * @since 3.0
 */

/**
 * This is a DAO implementation class for SkillAttempt Model
 */

@Repository
public class SkillAttemptDaoImpl implements SkillAttemptDao {

	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * Method for creating skill attempt record
	 * 
	 * @param skillAttempt
	 */
	@Override
	public void createSkillAttempt(SkillAttempt skillAttempt) {
		entityManager.persist(skillAttempt);

	}

	/**
	 * Method for retrieving a skill attempt record from database
	 * 
	 * @param attemptId
	 */
	@Override
	public SkillAttempt findById(int attemptId) {
		return (SkillAttempt) entityManager.createQuery("from SkillAttempt where attemptId = ?1")
				.setParameter(1, attemptId).getSingleResult();
	}

	/**
	 * Method for Updating skill attempt record in database
	 * 
	 * @param skillAttempt
	 */
	@Override
	public void updateSkillAttempt(SkillAttempt skillAttempt) {
		skillAttempt.getSkillResults().stream().forEach(skillResult -> {
			skillResult.getTestResults().stream().forEach(testResult -> addTestResult(testResult));
			addSkillResult(skillResult);
		});
		entityManager.merge(skillAttempt);
	}

	/**
	 * Method for retrieving Skill Attempt by User Id
	 * 
	 * @param userId
	 * @return List<SkillAttempt>
	 */
	@Override
	public List<SkillAttempt> findByUserId(int userId) {
		return entityManager.createQuery("from SkillAttempt u where u.user.userId = :userId and u.status = 'completed'",
				SkillAttempt.class).setParameter("userId", userId).getResultList();
	}

	/**
	 * Method for retrieving all Skill Attempt record
	 * 
	 * @param userId
	 * @return List<SkillAttempt>
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<SkillAttempt> findAllSkillAttempt() {
		return entityManager.createQuery("from SkillAttempt").getResultList();
	}

	/**
	 * @author prem.mariyappan This method will return the boolean result of User
	 *         Assessment status Method to insert the Test Result object into
	 *         database
	 * @param testResult
	 */
	@Override
	public void addTestResult(TestResult testResult) {
		entityManager.persist(testResult);
	}

	/**
	 * This is a method for insert skill result object into database
	 * 
	 * @param skillResult
	 */
	@Override
	public void addSkillResult(SkillResult skillResult) {
		entityManager.persist(skillResult);
	}

}
