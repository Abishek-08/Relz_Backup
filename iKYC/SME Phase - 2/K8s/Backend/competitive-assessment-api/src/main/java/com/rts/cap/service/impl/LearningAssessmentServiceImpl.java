package com.rts.cap.service.impl;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.LearningAssessmentDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.LearningAssessment;
import com.rts.cap.model.LevelThreeLearningAssessment;
import com.rts.cap.model.LevelZeroLearningAssessment;
import com.rts.cap.model.ModerateLearningAssessment;
import com.rts.cap.model.QuickLearningAssessment;
import com.rts.cap.service.LearningAssessmentService;

import jakarta.transaction.Transactional;

/**
 * @author hemachandran
 * @since 28-06-2024
 * @version 1.0
 */

@Transactional
@Service
public class LearningAssessmentServiceImpl implements LearningAssessmentService {

	private LearningAssessmentDao learningAssessmentDao;
	
	// Logger to capture logs for debugging and monitoring
		private static final Logger LOGGER = LogManager.getLogger(LearningAssessmentServiceImpl.class);

	public LearningAssessmentServiceImpl(LearningAssessmentDao learningAssessmentDao) {
		super();
		this.learningAssessmentDao = learningAssessmentDao;
	}

	@Override
	public LearningAssessment addLearningAssessment(LearningAssessment learningAssessment) {
		return learningAssessmentDao.addLearningAssessment(learningAssessment);
	}

	@Override
	public List<LearningAssessment> getAllLearningAssessment() {
		return learningAssessmentDao.getAllLearningAssessment();
	}
	/**
	 * Creates a new Level Zero Learning Assessment. Also creates a corresponding
	 * Learning Assessment with a type of LEVEL0_LEARNING_ASSESSMENT_TYPE.
	 *
	 * @param levelZeroLearningAssessment the Level Zero Learning Assessment to
	 *                                    create
	 * @return the created Level Zero Learning Assessment
	 */
	@Override
	public LevelZeroLearningAssessment createLevelZeroLearningAssessment(
			LevelZeroLearningAssessment levelZeroLearningAssessment) {
		LearningAssessment learningAssessment = new LearningAssessment();
		learningAssessment.setType(MessageConstants.LEVEL0_LEARNING_ASSESSMENT_TYPE);
		learningAssessment.setAssessment(levelZeroLearningAssessment.getAssessment());
		learningAssessmentDao.addLearningAssessment(learningAssessment);
		return learningAssessmentDao.createLevelZeroLearningAssessment(levelZeroLearningAssessment);
	}

	/**
	 * Retrieves all Level Zero Learning Assessments.
	 *
	 * @return a list of Level Zero Learning Assessments
	 */
	@Override
	public List<LevelZeroLearningAssessment> getAllLevelZeroLearningAssessment() {
		return learningAssessmentDao.getAllLevelZeroLearningAssessment();
	}

	
	/**
	 * Create a new Quick Learning Assessment and a corresponding Learning Assessment.
	 * @param quickLearningAssessment The Quick Learning Assessment entity to be created
	 * @return The created Quick Learning Assessment entity
	 */
	@Override
	public QuickLearningAssessment createAssessment(QuickLearningAssessment quickLearningAssessment) {
         
         
         LearningAssessment learningAssessment=new LearningAssessment();
         learningAssessment.setType(MessageConstants.LEVEL1_LEARNING_ASSESSMENT_TYPE);
         learningAssessment.setAssessment(quickLearningAssessment.getAssessment());
         learningAssessmentDao.addLearningAssessment(learningAssessment);
		return learningAssessmentDao.createAssessment(quickLearningAssessment);
	}
	
	/**
	 * Retrieve all Quick Learning Assessments.
	 * @return List of all Quick Learning Assessment entities
	 */
	@Override
	public List<QuickLearningAssessment> findAllQuickLearningAssessment() {

		return learningAssessmentDao.findAllQuickLearningAssessment();
	}
	
	/**
	 * Find a Quick Learning Assessment by its ID.
	 * @param quickLearningAssessmentId The ID of the assessment to be retrieved
	 * @return The Quick Learning Assessment entity with the specified ID
	 */
	@Override
	public QuickLearningAssessment findByIdQuickLearningAssessment(int quickLearningAssessmentId) {

		return learningAssessmentDao.findByIdQuickLearningAssessment(quickLearningAssessmentId);
	}
	
	// level two assessment
	
	
	/**
	 * Creates a new ModerateLearningAssessment.
	 *
	 * @param moderateLearningAssessment The assessment to be created.
	 * @return The created ModerateLearningAssessment.
	 * @throws CapBusinessException if an error occurs during the creation process.
	 */
	@Override
	public ModerateLearningAssessment createAssessment(ModerateLearningAssessment moderateLearningAssessment) {
		LearningAssessment learningAssessment = new LearningAssessment();
		learningAssessment.setType(MessageConstants.LEVEL2_LEARNING_ASSESSMENT_TYPE);
		learningAssessment.setAssessment(moderateLearningAssessment.getAssessment());

		learningAssessmentDao.addLearningAssessment(learningAssessment);

		return learningAssessmentDao.createAssessment(moderateLearningAssessment);

	}

	/**
	 * Retrieves all ModerateLearningAssessments.
	 * 
	 * @return A list of all ModerateLearningAssessments.
	 */
	@Override
	public List<ModerateLearningAssessment> getAllModerateLearningAssessment() {
		return learningAssessmentDao.getAllModerateLearningAssessment();
	}

	/**
	 * Retrieves a ModerateLearningAssessment by its ID.
	 * 
	 * @param moderateLearningAssessmentId The ID of the assessment to retrieve.
	 * @return The ModerateLearningAssessment with the specified ID, or null if not
	 *         found.
	 * @throws CapBusinessException if the ID is invalid or an error occurs during
	 *                              retrieval.
	 */
	@Override
	public ModerateLearningAssessment getByIdModerateLearningAssessment(int moderateLearningAssessmentId)
			throws CapBusinessException {
		ModerateLearningAssessment moderateLearningAssessment = null;
		// Validate the ID
		if (moderateLearningAssessmentId <= 0) {
			throw new CapBusinessException("Invalid ModerateLearningAssessment ID");
		}
		try {
			// Fetch the ModerateLearningAssessment by ID
			moderateLearningAssessment = learningAssessmentDao
					.getByIdModerateLearningAssessment(moderateLearningAssessmentId);
		} catch (Exception e) {
			// Log the error with the ID for context
			LOGGER.error("Error occurred while retrieving ModerateLearningAssessment with Id", e);
		}
		return moderateLearningAssessment;
	}

	/**
	 * @param levelThreeLearningAssessment The {@code LevelThreeLearningAssessment}
	 *  object to be added. It must not be  {@code null}.
	 *                                    
	 * @return The {@code LevelThreeLearningAssessment} object that was saved to the
	 *         database. It may have an updated state with additional
	 *         database-generated information.
	 */
	@Override
	public LevelThreeLearningAssessment addLearningAssessment(LevelThreeLearningAssessment levelThreeLearningAssessment) {
		levelThreeLearningAssessment.getChosenQuestions().stream().forEach(
				chosenQuestion -> chosenQuestion.setLevelThreeLearningAssessment(levelThreeLearningAssessment));
		LearningAssessment learningAssessment = new LearningAssessment();
		learningAssessment.setType(MessageConstants.LEVEL3_LEARNING_ASSESSMENT_TYPE);
		learningAssessment.setAssessment(levelThreeLearningAssessment.getAssessment());
		learningAssessmentDao.addLearningAssessment(learningAssessment);
		return learningAssessmentDao.addLearningAssessment(levelThreeLearningAssessment);
	}

	/**
	 * @return a {@link List} of {@link LevelThreeLearningAssessment} objects. The
	 *         list may be empty if no assessments are found, but it will never be
	 *         {@code null}.
	 */
	@Override
	public List<LevelThreeLearningAssessment> getAllLevelThreeLearningAssessment() {
		return learningAssessmentDao.getAllLevelThreeLearningAssessment();
	}

	/**
	 * @param assessmentId the ID of the assessment for which level three learning
	 *                     assessments are to be retrieved
	 * @return a {@link List} of {@link LevelThreeLearningAssessment} objects
	 *         corresponding to the given assessment ID or an empty list if no
	 *         assessments are found for the given ID
	 */
	@Override
	public List<LevelThreeLearningAssessment> getAllLevelThreeLearningAssessmentByAssessmentId(int assessmentId) {

		return learningAssessmentDao.getAllLevelThreeLearningAssessmentByAssessmentId(assessmentId);
	}
	
	
}
