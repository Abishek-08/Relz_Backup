package com.rts.cap.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.LearningAssessment;
import com.rts.cap.model.LevelThreeLearningAssessment;
import com.rts.cap.model.LevelZeroLearningAssessment;
import com.rts.cap.model.ModerateLearningAssessment;
import com.rts.cap.model.QuickLearningAssessment;
import com.rts.cap.service.LearningAssessmentService;


/**
 * @author hemachandran,@author jothilingam.a
 * @since 28-06-2024
 * @version 1.0
 */

@RestController
@CrossOrigin("*")
@RequestMapping(path = APIConstants.LEARNING_ASSESSMENT_BASE_URL)
public class LearningAssessmentController {

	private LearningAssessmentService learningAssessmentService;

	public LearningAssessmentController(LearningAssessmentService learningAssessmentService) {
		super();
		this.learningAssessmentService = learningAssessmentService;
	}
	
	@PostMapping(path = APIConstants.ADD_LEARNING_ASSESSMENT_URL)
	public LearningAssessment addLearningAssessment(
			@RequestBody LearningAssessment learningAssessment) {
		return learningAssessmentService.addLearningAssessment(learningAssessment);
	}
	
	@GetMapping(path = APIConstants.GET_ALL_LEARNING_ASSESSMENT_URL)
	public ResponseEntity<Object> getAllLearningAssessment(){
		try {
			return ResponseEntity.ok(learningAssessmentService.getAllLearningAssessment());			
		} catch(Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
	@PostMapping(path = APIConstants.ADD_LEVEL_ZERO_LEARNING_ASSESSMENT)
	public LevelZeroLearningAssessment createAssessment(
			@RequestBody LevelZeroLearningAssessment levelZeroLearningAssessment) {
		return learningAssessmentService.createLevelZeroLearningAssessment(levelZeroLearningAssessment);
	}

	@GetMapping(path = APIConstants.GET_ALL_LEVEL_ZERO_LEARNING_ASSESSMENT)
	public ResponseEntity<Object> getLevelZeroLearningAssessmentAll() {
		try {
			return ResponseEntity.ok(learningAssessmentService.getAllLevelZeroLearningAssessment());
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
	// level one Assessment
	/**
	 * Endpoint to add a new Quick Learning Assessment.
	 * @param quickLearningAssessment The assessment data to be added
	 * @return The created Quick Learning Assessment object
	 */
	@PostMapping(APIConstants.ADD_QUICK_LEARNING_ASSESSMENT)
	public QuickLearningAssessment addQuickLearningAssesment(@RequestBody QuickLearningAssessment quickLearningAssessment) {
		
		return learningAssessmentService.createAssessment(quickLearningAssessment);
		
	}
	
	/**
	 * Endpoint to get a list of all Quick Learning Assessments.
	 * @return List of all Quick Learning Assessment objects
	 */
	@GetMapping(APIConstants.GET_ALL_QUICK_LEARNING_ASSESSMENT)
	public List<QuickLearningAssessment> getAllQuickLearningAssesment() {
		
		return  learningAssessmentService.findAllQuickLearningAssessment();
		
	}	
	
	// level 2 assessment controller
	
	
	/**
	 * Endpoint to add new moderate learning assessment.
	 * @param moderateLearningAssessment The object to be added in the database. 
	 * @return the added moderate learning assessment request with 201 Created status.
	 */
	@PostMapping(path = APIConstants.ADD_MODERATE_LEARNING_ASSESSMENT_URL)
	public ModerateLearningAssessment addAssessment(
			@RequestBody ModerateLearningAssessment moderateLearningAssessment) {
		return learningAssessmentService.createAssessment(moderateLearningAssessment);
	}
	
	/**
	 * Endpoint to retrieve all moderate learning assessment.
	 * @return a ResponseEntity containing all moderate learning assessment, or a bad request if any error occurs.
	 */
	@GetMapping(path = APIConstants.GET_ALL_MODERATE_LEARNING_ASSESSMENT_URL)
	public ResponseEntity<Object> getModerateLearningAssessmentAll() {
		try {
			return ResponseEntity.ok(learningAssessmentService.getAllModerateLearningAssessment());
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
		
	/**
	 * Endpoint to retrieve particular moderate learning assessment by using there unique ID.
	 * @param moderateLearningAssessmentId The ID of the assessment to retrieve.
	 * @return Display the particular moderate learning assessment with corresponding fields, or bad request if any error occurs.
	 * @throws CapBusinessException 
	 */
	@GetMapping(path = APIConstants.GET_MODERATE_LEARNING_ASSESSMENT_BY_ID_URL)
	public ModerateLearningAssessment doGetModerateLearningAssessmentById(@PathVariable("moderateLearningAssessmentId")int moderateLearningAssessmentId) throws CapBusinessException {
		return learningAssessmentService.getByIdModerateLearningAssessment(moderateLearningAssessmentId);
	}
	// level three Assessment
	
	  /**
     * Endpoint to add a new level three learning assessment.
     * @param levelThreeLearningAssessment The assessment object to be added. the type of Learning to be stored inside the Learning table
     * @return The added level three learning assessment.
     */
	@PostMapping(path = APIConstants.ADD_LEVEL_THREE_ASSESSMENT_URL)
	public LevelThreeLearningAssessment addLearningAssessment(@RequestBody LevelThreeLearningAssessment levelThreeLearningAssessment) {
		return learningAssessmentService.addLearningAssessment(levelThreeLearningAssessment);
	}
	
    /**
     * Endpoint to retrieve all level three learning assessments.
     * @return List of all level three learning assessments.
     */
	@GetMapping(path = APIConstants.GET_ALL_LEVEL_THREE_ASSESSMENT_URL)
	public List<LevelThreeLearningAssessment> getAllLevelThreeLearningAssessmet() {
		return learningAssessmentService.getAllLevelThreeLearningAssessment();
	}
	

    /**
     * Endpoint to retrieve all level three learning assessments by assessment ID.
     * @param assessmentId The ID of the assessment to retrieve.
     * @return List of all level three learning assessments with the specified assessment ID.
     */
	@GetMapping(path = APIConstants.GET_ALL_LEVEL_THREE_ASSESSMENT_BY_ASSESSMENT_ID_URL)
	public List<LevelThreeLearningAssessment> getAllLevelThreeLearningAssessmentByAssessmentId(@PathVariable("assessmentId") int assessmentId) {
		return learningAssessmentService.getAllLevelThreeLearningAssessmentByAssessmentId(assessmentId);
	}
	
	


}
