package com.rts.cap.controller;
 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.model.Assessment;
import com.rts.cap.model.Proctoring;
import com.rts.cap.service.AssessmentService;
 
/**
* @author sowmiya.ramu
* @since 04-07-2024
* @version 2.0
*/
 
@RestController
@RequestMapping(APIConstants.ASSESSMENT_BASE_URL)
public class AssessmentController {
 
	private AssessmentService assessmentService;
 
	// Constructor injection for AssessmentService
	public AssessmentController(AssessmentService assessmentService) {
		this.assessmentService = assessmentService;
	}
	/**
	 * Method for handling add assessment details Handles POST requests to add an
	 * assessment.
	 * 
	 * @param assessment the assessment object to be added, provided in the request
	 *                   body.
	 * @return ResponseEntity with HTTP status 201 (CREATED) and the added
	 *         assessment.
	 */
	@PostMapping(APIConstants.ADD_ASSESSMENT_URL)
	public ResponseEntity<Assessment> addAssessment(@RequestBody Assessment assessment) {
		Assessment addedAssessment = assessmentService.addAssessment(assessment);
		return new ResponseEntity<>(addedAssessment, HttpStatus.CREATED);
	}
	/**
	 * Method for handling get all assessment details Handles GET requests to
	 * retrieve all assessments.
	 * 
	 * @return ResponseEntity with HTTP status 200 (OK) and the list of assessments
	 *         if found, or HTTP status 400 (BAD_REQUEST) if an error occurs.
	 */
	@GetMapping(path = APIConstants.GET_ALL_ASSESSMENT_URL)
	public ResponseEntity<Object> getAllAssessment() {
		try {
			return ResponseEntity.ok(assessmentService.findAllAssessment());
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	/**
	 * Method for handling verify assessment name Handles GET requests to verify if
	 * an assessment name already exists.
	 * 
	 * @param assessmentName the assessment name to be verified, provided as a path
	 *                       variable.
	 * @return ResponseEntity with HTTP status 200 (OK) if the assessment name
	 *         exists, or HTTP status 404 (NOT FOUND) if the assessment name does
	 *         not exist.
	 */
	@GetMapping(APIConstants.VERIFY_ASSESSMENT_NAME_URL + "/{assessmentName}")
	public ResponseEntity<Object> verifyAssessmentName(@PathVariable String assessmentName) {
 
		if (assessmentService.findAssessmentName(assessmentName)) {
			return ResponseEntity.ok(MessageConstants.SUCCESS);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	/**
	 * @author varshinee.manisekar
	 * @since 04-07-2024
	 * @version 2.0
	 */
	@GetMapping(path = APIConstants.GET_ASSESSMENT_URL + "/{assessmentId}")
	public ResponseEntity<Object> getAssessmentById(@PathVariable("assessmentId") int assessmentId) {
		try {
			return ResponseEntity.ok(assessmentService.getAssessmentById(assessmentId));
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
	/**
	 * Adds a new proctoring record.
	 * 
	 *
	 * This endpoint accepts a Proctoring object and adds it to the database.
	 * 
	 * @param proctoring the Proctoring object to be added
	 * @return the added Proctoring object
	 */
	@PostMapping(APIConstants.ADD_PROCTORING)
	public Proctoring addProctoring(@RequestBody Proctoring proctoring) {
		return assessmentService.addProctoring(proctoring);

	}
	
	/**
	 * Retrieves a proctoring record by assessment ID.
	 * 
	 * This endpoint returns the proctoring details associated with a specific
	 * assessment ID.
	 * 
	 * @param assessmentId the ID of the assessment
	 * @return the Proctoring object associated with the given assessment ID
	 */
	@GetMapping(APIConstants.GET_PROCTORING_BY_ASSESSMENT_ID)
	public Proctoring getProctoringByAssessmentId(@PathVariable("assessmentId") int assessmentId) {
		return assessmentService.proctoringFindByAssessmentId(assessmentId);

	}
 
}