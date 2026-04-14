package com.rts.cap.dao.impl;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.rts.cap.dao.LearningAssessmentDao;
import com.rts.cap.model.LearningAssessment;
import com.rts.cap.model.LevelThreeLearningAssessment;
import com.rts.cap.model.LevelZeroLearningAssessment;
import com.rts.cap.model.ModerateLearningAssessment;
import com.rts.cap.model.QuickLearningAssessment;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

/**
 * Implementation of the {@link LearningAssessmentDao} interface for managing
 * {@link LearningAssessment} entities. This class provides methods to persist
 * new learning assessments and retrieve existing ones from the database.
 * <p>
 * The class uses JPA's {@link EntityManager} to interact with the underlying
 * database.
 * </p>
 * 
 * @author jothilingam.a
 * @since 28-06-2024
 * @version 1.0
 */
@Repository
public class LearningAssessmentDaoImpl implements LearningAssessmentDao {

	/**
	 * The {@link EntityManager} used for performing database operations. Injected
	 * by Spring's dependency injection.
	 */
	@PersistenceContext
	private EntityManager entityManager;

	private static final Logger LOGGER = LogManager.getLogger(LearningAssessmentDaoImpl.class);

	/**
	 * Persists a new {@link LearningAssessment} entity into the database.
	 * 
	 * @param learningAssessment the {@link LearningAssessment} entity to be
	 *                           persisted.
	 * @return the persisted {@link LearningAssessment} entity.
	 */
	@Override
	public LearningAssessment addLearningAssessment(LearningAssessment learningAssessment) {
		entityManager.persist(learningAssessment);
		return learningAssessment;
	}

	/**
	 * @author hemachandran Retrieves all {@link LearningAssessment} entities from
	 *         the database.
	 * 
	 * @return a list of all {@link LearningAssessment} entities.
	 */
	@Override
	public List<LearningAssessment> getAllLearningAssessment() {
		return entityManager.createQuery("SELECT la FROM LearningAssessment la", LearningAssessment.class)
				.getResultList();
	}

	@Override
	public LevelZeroLearningAssessment createLevelZeroLearningAssessment(
			LevelZeroLearningAssessment levelZeroLearningAssessment) {
		entityManager.persist(levelZeroLearningAssessment);
		return levelZeroLearningAssessment;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<LevelZeroLearningAssessment> getAllLevelZeroLearningAssessment() {
		return entityManager.createQuery("from LevelZeroLearningAssessment").getResultList();
	}

	// leve one assessment

	/**
	 * Create a new Quick Learning Assessment entity in the database.
	 * 
	 * @param quickLearningAssessment The assessment entity to be persisted
	 * @return The persisted Quick Learning Assessment entity
	 */
	@Override
	public QuickLearningAssessment createAssessment(QuickLearningAssessment quickLearningAssessment) {
		entityManager.persist(quickLearningAssessment);
		return quickLearningAssessment;
	}

	/**
	 * Retrieve all Quick Learning Assessment entities from the database.
	 * 
	 * @return List of all Quick Learning Assessment entities
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<QuickLearningAssessment> findAllQuickLearningAssessment() {
		return entityManager.createQuery("from QuickLearningAssessment").getResultList();
	}

	/**
	 * Find a Quick Learning Assessment entity by its ID.
	 * 
	 * @param quickLearningAssessmentId The ID of the assessment to be retrieved
	 * @return The Quick Learning Assessment entity with the specified ID
	 */
	@Override
	public QuickLearningAssessment findByIdQuickLearningAssessment(int quickLearningAssessmentId) {

		QuickLearningAssessment quickLearningAssessment = null;

		if (quickLearningAssessmentId != 0)
			try {
				quickLearningAssessment = (QuickLearningAssessment) entityManager.createQuery(
						"from QuickLearningAssessment where quickLearningAssessmentId =:quickLearningAssessmentId")
						.setParameter("quickLearningAssessmentId", quickLearningAssessmentId).getSingleResult();

			} catch (Exception e) {
				LOGGER.error("QuicklearningAssessmentId is not found", e);
			}
		else
			LOGGER.error("QuicklearningAssessmentId cannot be 0");

		return quickLearningAssessment;
	}
	
	
	// level two assessment
	
	
	@Override
	public ModerateLearningAssessment createAssessment(ModerateLearningAssessment moderateLearningAssessment) {
		entityManager.persist(moderateLearningAssessment);
		return moderateLearningAssessment;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ModerateLearningAssessment> getAllModerateLearningAssessment() {
		return entityManager.createQuery("from ModerateLearningAssessment").getResultList();
	}

	@Override
	public ModerateLearningAssessment getByIdModerateLearningAssessment(int moderateLearningAssessmentId) {
		return (ModerateLearningAssessment) entityManager.createQuery(
				"from ModerateLearningAssessment where moderateLearningAssessmentId =: moderateLearningAssessmentId")
				.setParameter("moderateLearningAssessmentId", moderateLearningAssessmentId).getSingleResult();
	}
	
	
	// level three Assessment
	
	
	/**
	 * Retrieves all LevelThreeLearningAssessment entities from the database.
	 * 
	 * @return a list of LevelThreeLearningAssessment objects
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<LevelThreeLearningAssessment> getAllLevelThreeLearningAssessment() {
		return entityManager.createQuery("from LevelThreeLearningAssessment").getResultList();
	}
	
	/**
	 * Adds a new LevelThreeLearningAssessment entity to the database.
	 * 
	 * @param levelThreeLearningAssessment the LevelThreeLearningAssessment object
	 *                                     to add
	 * @return the added LevelThreeLearningAssessment object
	 */
	@Override
	public LevelThreeLearningAssessment addLearningAssessment(
			LevelThreeLearningAssessment levelThreeLearningAssessment) {
		entityManager.persist(levelThreeLearningAssessment);
		return levelThreeLearningAssessment;
	}

	/**
	 * Retrieves all LevelThreeLearningAssessment entities associated with a
	 * specific assessment ID from the database.
	 * 
	 * @param assessmentId the ID of the assessment to filter by
	 * @return a list of LevelThreeLearningAssessment objects matching the given
	 *         assessment ID
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<LevelThreeLearningAssessment> getAllLevelThreeLearningAssessmentByAssessmentId(int assessmentId) {
		return entityManager
				.createQuery("from LevelThreeLearningAssessment l where l.assessment.assessmentId = :assessmentId")
				.setParameter("assessmentId", assessmentId).getResultList();
	}

	
}
