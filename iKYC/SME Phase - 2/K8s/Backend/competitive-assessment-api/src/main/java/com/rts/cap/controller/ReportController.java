package com.rts.cap.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.dto.BatchOverallReportDto;
import com.rts.cap.dto.BatchReportGenerationDto;
import com.rts.cap.dto.BatchSkillReportDto;
import com.rts.cap.dto.BatchUsersReportGenerationDto;
import com.rts.cap.dto.GetAllAssessmentDto;
import com.rts.cap.dto.IndividualUserReportDto;
import com.rts.cap.dto.KnowledgeAssessmentCountsDto;
import com.rts.cap.dto.ScheduleAssessmentTypeDto;
import com.rts.cap.dto.UnMappedUserReportDto;
import com.rts.cap.service.ReportService;

@RestController
@RequestMapping("/report")
public class ReportController {

	private ReportService reportService;

	public ReportController(ReportService reportService) {
		super();
		this.reportService = reportService;
	}

	/**
	 * This "getUnmappedUserSkillAttempts" method is used to view the user skill
	 * assessment report.
	 * 
	 * @return
	 */
	@GetMapping(path = APIConstants.UNMAPPED_USERS_REPORT)
	public ResponseEntity<List<IndividualUserReportDto>> getUnmappedUserSkillAttempts(
			@PathVariable("schedulingId") int schedulingId, @PathVariable("type") String type) {
		try {
			return ResponseEntity.ok(reportService.getIndividualUserReport(schedulingId, type));
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 06-08-2024 Retrieves the overall percentages for unmapped users. This
	 *        method delegates to the reportService to fetch the required data from
	 *        the database.
	 * @return a ResponseEntity containing the UnMappedUserReportDto object with the
	 *         calculated percentages
	 */
	@GetMapping(path = APIConstants.GET_ALL_UNMAPPED_USER_REPORT)
	public ResponseEntity<UnMappedUserReportDto> getOverallPercentages() {
		return ResponseEntity.ok(reportService.calculateOverallPercentagesForUnmappedUsers());
	}

	@GetMapping(path = APIConstants.GET_BATCH_REPORT)
	public ResponseEntity<List<BatchReportGenerationDto>> getLearningBatchReport(@PathVariable("batchId") int batchId,
			@PathVariable("type") String type) {
		return ResponseEntity.ok(reportService.getBatchReport(batchId, type));
	}

	@GetMapping(path = APIConstants.LEARN_BATCH_USERS_REPORT)
	public ResponseEntity<List<BatchUsersReportGenerationDto>> getLearningBatchUserReport(
			@PathVariable("batchId") int batchId, @PathVariable("assessmentId") int assessmentId) {
		return ResponseEntity.ok(reportService.getLearningAssessmentBatchUserReport(batchId, assessmentId));
	}

	@GetMapping(path = APIConstants.SKILL_BATCH_USERS_REPORT)
	public ResponseEntity<List<BatchSkillReportDto>> getSkillBatchUserReport(@PathVariable("batchId") int batchId,
			@PathVariable("assessmentId") int assessmentId) {
		return ResponseEntity.ok(reportService.getSkillAssessmentBatchUsersReport(batchId, assessmentId));
	}

	@GetMapping(path = APIConstants.OVERALL_BATCH_REPORT)
	public ResponseEntity<List<BatchOverallReportDto>> getLearningOverallBatchReport(
			@PathVariable("type") String type) {
		return ResponseEntity.ok(reportService.getOverallBatchReport(type));
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 06-08-2024 Checks if any scheduled knowledge assessments exist. This
	 *        method retrieves the count of scheduled knowledge assessments and
	 *        returns a ResponseEntity with the count if assessments exist, or a
	 *        message indicating that no assessments were found.
	 * @return a ResponseEntity with a status of OK (200) and the count of scheduled
	 *         knowledge assessments if assessments exist, or a status of NOT_FOUND
	 *         (404) with a message indicating that no assessments were found
	 */
	@GetMapping(path = APIConstants.GET_ALL_SCHEDULED_KNOWLEDGE_ASSESSMENT_URL)
	public ResponseEntity<Object> scheduledKnowledgeAssessmentExists() {
		KnowledgeAssessmentCountsDto counts = reportService.getScheduledLearningAssessmentDetails();

		if (counts.getLearningAssessmentCount() > 0) {
			return new ResponseEntity<>(counts, HttpStatus.OK);
		} else {
			return new ResponseEntity<>("No scheduled assessments found.", HttpStatus.NOT_FOUND);
		}
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 06-08-2024 Checks if any scheduled skill assessments exist. This
	 *        method retrieves the count of scheduled skill assessments and returns
	 *        a ResponseEntity with the count if assessments exist, or a message
	 *        indicating that no assessments were found.
	 * @return a ResponseEntity with a status of OK (200) and the count of scheduled
	 *         skill assessments if assessments exist, or a status of NOT_FOUND
	 *         (404) with a message indicating that no assessments were found
	 */
	@GetMapping(path = APIConstants.GET_ALL_SCHEDULED_SKILL_ASSESSMENT_URL)
	public ResponseEntity<Object> scheduledSkillAssessmentExists() {
		long count = reportService.getScheduledSkillAssessmentDetails();
		if (count > 0)
			return new ResponseEntity<>(count, HttpStatus.OK);
		return new ResponseEntity<>("No scheduled assessments found.", HttpStatus.NOT_FOUND);
	}

	@GetMapping(APIConstants.GET_ASSESSMENT_DETAILS)
	public ScheduleAssessmentTypeDto getAssessmentType(@PathVariable("assessmentId") int assessmentId) {
		return reportService.findAssessmentTypeByAssessmentId(assessmentId);
	}

	@GetMapping(APIConstants.GET_ALL_ASSESSMENT)
	public ResponseEntity<List<GetAllAssessmentDto>> getAllSkillAssessment(@PathVariable("type") String type) {
		try {
			return ResponseEntity.ok(reportService.getAllAssessment(type));
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

}
