package com.rts.cap.controller;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.dto.LearningAssessmentReportDto;
import com.rts.cap.dto.LearningAssessmentScoreCardDto;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.User;
import com.rts.cap.service.LearningAssessmentEvaluationService;

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


@RestController
@RequestMapping(path = APIConstants.LEARNING_BASE_URL)
public class LearningAssessmentEvaluationController {
	
	private static final Logger LOGGER = LogManager.getLogger(LearningAssessmentEvaluationController.class);

	private final LearningAssessmentEvaluationService evaluationService;

	public LearningAssessmentEvaluationController(LearningAssessmentEvaluationService evaluationService) {
		this.evaluationService = evaluationService;
	}
	
	
	// Evaluate The Learning Assessment
	@PostMapping(APIConstants.EVALUATE_LEARNING_ASSESSMENT)
	public ResponseEntity<Boolean> evaluateLearningAssessment(
			@RequestBody LearningAssessmentScoreCardDto learningAssessmentScoreCardDto) {
		LOGGER.info("learningAssessmentScoreCardDto Details : {}",learningAssessmentScoreCardDto);
		return ResponseEntity.ok(evaluationService.evaluateAssessment(learningAssessmentScoreCardDto));
	}
	
	
	/**
	 * @author prasanth.baskaran
	 * @since 27-07-2024
	 * @version 5.0
	 */
	// Add The ScoreCard Completion Status
	@PostMapping(APIConstants.LEARNING_ASSESSMENT_COMPLETION_STATUS+ "/{scheduleAssessmentId}/{userId}")
	public ResponseEntity<Boolean> addScoreCardCompletionStatus(
			 @PathVariable("scheduleAssessmentId") int scheduleAssessmentId,
		        @PathVariable("userId") int userId) {
		return ResponseEntity.ok(evaluationService.addScoreCardCompletionStatus(scheduleAssessmentId, userId));
	}
	
	
	// Get Report Based on the AssessmentId and UserId
	@GetMapping(APIConstants.GET_LEARNING_ASSESSMENT_USER_REPORT + "/{scheduleAssessmentId}/{userId}")
	public ResponseEntity<List<LearningAssessmentReportDto>> getUserLearningAssessmentReport(
	        @PathVariable("scheduleAssessmentId") int scheduleAssessmentId,
	        @PathVariable("userId") int userId) {
	    List<LearningAssessmentReportDto> assessmentReport = evaluationService.getUserAssessmentReport(scheduleAssessmentId, userId);
	    LOGGER.info("Assessment User Report : {}",assessmentReport);
	    return assessmentReport != null && !assessmentReport.isEmpty() ?   ResponseEntity.ok(assessmentReport) :  ResponseEntity.noContent().build();	}
	
	// Get Score card Based Learning Assessment Schedule List
	@GetMapping(APIConstants.GET_SCHEDULE_ASSESSMENT_LIST_REPORT)
	public List<ScheduleAssessment> getScoreCardScheduleAssessment(){
		return evaluationService.getScoreCardScheduleAssessment();
	}
	
	// Get Score card Based Learning Assessment User List
	@GetMapping(APIConstants.GET_LEARNING_ASSESSMENT_USER_LIST +"/{scheduleAssessmentId}")
	public List<User> getScoreCardScheduleAssessment(@PathVariable("scheduleAssessmentId") int scheduleAssessmentId){
		return evaluationService.getScoreCardUserList(scheduleAssessmentId);
	}
	
	// Get Score card Based Learning Assessment User and Scheduling
	@GetMapping(APIConstants.GET_LEARNING_ASSESSMENT_SCORE_CARD_DETAILS + "/{scheduleAssessmentId}/{userId}")
	public ResponseEntity<LearningAssessmentScoreCard> getLearningAssessmentScoreCardDetails(
	        @PathVariable("scheduleAssessmentId") int scheduleAssessmentId,
	        @PathVariable("userId") int userId) {
	    LearningAssessmentScoreCard scoreDetails = evaluationService.getScoreCardDetails(scheduleAssessmentId, userId);
	    LOGGER.info("Score Details : {}",scoreDetails);
	    return scoreDetails!= null ? ResponseEntity.ok(scoreDetails) : ResponseEntity.noContent().build();
		}
	// Get learning Assessment Completion Count
	@GetMapping(APIConstants.LEARNING_ASSESSMENT_COMPLETION_COUNT + "/{scheduleAssessmentId}/{userId}")
	public ResponseEntity<Boolean> getLearningAssessmentCompletionCount(
	        @PathVariable("scheduleAssessmentId") int scheduleAssessmentId,
	        @PathVariable("userId") int userId) {
	    return ResponseEntity.ok(evaluationService.getCompletionCount(scheduleAssessmentId, userId)); 
	}
	
	


}