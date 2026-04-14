package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.LearningAssessment;
import com.rts.cap.model.LevelThreeLearningAssessment;
import com.rts.cap.model.LevelZeroLearningAssessment;
import com.rts.cap.model.ModerateLearningAssessment;
import com.rts.cap.model.QuickLearningAssessment;

/**
 * @author jothilingam.a
 * @since 28-06-2024
 * @version 1.0
 */

public interface LearningAssessmentDao {

	public LearningAssessment addLearningAssessment(LearningAssessment learningAssessment);

	public List<LearningAssessment> getAllLearningAssessment();

	public LevelZeroLearningAssessment createLevelZeroLearningAssessment(
			LevelZeroLearningAssessment levelZeroLearningAssessment);

	public List<LevelZeroLearningAssessment> getAllLevelZeroLearningAssessment();

	// level one assessment
	public QuickLearningAssessment createAssessment(QuickLearningAssessment quickLearningAssessment);

	public List<QuickLearningAssessment> findAllQuickLearningAssessment();

	public QuickLearningAssessment findByIdQuickLearningAssessment(int quickLearningAssessmentId);
	
	// level two assessment
	public ModerateLearningAssessment createAssessment(ModerateLearningAssessment moderateLearningAssessment);

	public List<ModerateLearningAssessment> getAllModerateLearningAssessment();

	public ModerateLearningAssessment getByIdModerateLearningAssessment(int moderateLearningAssessmentId);
	
	// level three Assessment
	public List<LevelThreeLearningAssessment> getAllLevelThreeLearningAssessment();
	
	public LevelThreeLearningAssessment addLearningAssessment(
			LevelThreeLearningAssessment levelThreeLearningAssessment);
	
	public List<LevelThreeLearningAssessment> getAllLevelThreeLearningAssessmentByAssessmentId(int assessmentId);


}
