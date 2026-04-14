package com.rts.cap.service;

import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.LearningAssessment;
import com.rts.cap.model.LevelThreeLearningAssessment;
import com.rts.cap.model.LevelZeroLearningAssessment;
import com.rts.cap.model.ModerateLearningAssessment;
import com.rts.cap.model.QuickLearningAssessment;

/**
 * @author hemachandran,@author jothilingam.a
 * @since 28-06-2024
 * @version 1.0
 */


public interface LearningAssessmentService {

	public LearningAssessment addLearningAssessment(LearningAssessment learningAssessment);

	public List<LearningAssessment> getAllLearningAssessment();
	
	// level zero Assessment
	public LevelZeroLearningAssessment createLevelZeroLearningAssessment(
			LevelZeroLearningAssessment levelZeroLearningAssessment);

	public List<LevelZeroLearningAssessment> getAllLevelZeroLearningAssessment();
	
	//level one assessment
	public QuickLearningAssessment createAssessment(QuickLearningAssessment quickLearningAssessment);

	public List<QuickLearningAssessment> findAllQuickLearningAssessment();

	public QuickLearningAssessment findByIdQuickLearningAssessment(int quickLearningAssessmentId);
	
	// level two assessment
	
	
	public ModerateLearningAssessment createAssessment(ModerateLearningAssessment moderateLearningAssessment);

	public List<ModerateLearningAssessment> getAllModerateLearningAssessment();

	public ModerateLearningAssessment getByIdModerateLearningAssessment(int moderateLearningAssessmentId) throws CapBusinessException;
	
	// level three Assessment
	
	public LevelThreeLearningAssessment addLearningAssessment(LevelThreeLearningAssessment levelThreeLearningAssessment);
	
	public List<LevelThreeLearningAssessment> getAllLevelThreeLearningAssessment();

	public List<LevelThreeLearningAssessment> getAllLevelThreeLearningAssessmentByAssessmentId(int assessmentId);


	

}
