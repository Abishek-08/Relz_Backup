package com.rts.cap.controller;
 
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.model.CodingQuestionRequest;
import com.rts.cap.model.SkillAssessment;
import com.rts.cap.service.SkillAssessmentService;
 
/**
* @author sowmiya.ramu
* @since 04-07-2024
* @version 2.0
*/
 
@RestController
@CrossOrigin("*")
@RequestMapping(APIConstants.SKILL_ASSESSMENT_BASE_URL)
public class SkillAssessmentController {
	/**
	 * The service responsible for handling skill assessment operations.
	 */
	private SkillAssessmentService skillassessmentService;
	
	/**
	 * Constructor for SkillAssessmentController, injecting the
	 * SkillAssessmentService.
	 * 
	 * @param skillassessmentService the service responsible for handling skill
	 *                               assessment operations
	 */
	public SkillAssessmentController(SkillAssessmentService skillassessmentService) {
		this.skillassessmentService = skillassessmentService;
	}
	
	/**
	 * Method for handling add skill assessment details Handles POST requests to add
	 * a new skill assessment.
	 * 
	 * @param skill assessment The skill assessment object to be added, provided in
	 *              the request body.
	 * @return ResponseEntity with HTTP status 201 (CREATED) and the added skill
	 *         assessment.
	 */
	@PostMapping(APIConstants.ADD_SKILL_ASSESSMENT_URL)
	public ResponseEntity<SkillAssessment> addSkillAssessment(@RequestBody SkillAssessment skillassessment) {
		SkillAssessment addedskillAssessment = skillassessmentService.addSkillAssessment(skillassessment);
		return new ResponseEntity<>(addedskillAssessment, HttpStatus.CREATED);
	}
	/**
	 * Method for handling get all skill assessments request Handles GET requests to
	 * retrieve all skill assessments.
	 * 
	 * @return ResponseEntity with HTTP status 200 (OK) and a list of all skill
	 *         assessments. If an exception occurs, return a ResponseEntity with
	 *         HTTP status 400 (BAD REQUEST)
	 */
	@GetMapping(path = APIConstants.GET_ALL_SKILL_ASSESSMENT_URL)
	public ResponseEntity<Object> getAllSkillAssessment() {
		try {
			return ResponseEntity.ok(skillassessmentService.findAllSkillAssessment());
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
	/**
	 * Method for handling get skill assessment by ID Handles GET requests to
	 * retrieve a skill assessment by its ID.
	 * 
	 * @param skillAssessmentid The ID of the skill assessment to be retrieved.
	 * @return ResponseEntity with HTTP status 200 (OK) and the skill assessment
	 *         object if found, or HTTP status 400 (BAD REQUEST) if not found.
	 */
	@GetMapping(path = APIConstants.GET_ALL_SKILL_ASSESSMENT_URL + "/{skillAssessmentid}")
	public ResponseEntity<Object> findSkillAssessmentById(@PathVariable int skillAssessmentid) {
		try {
			return ResponseEntity.ok(skillassessmentService.findSkillAssessmentById(skillAssessmentid));
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
	/**
	 * Method for handling get skill assessment by assessment ID Handles GET
	 * requests to retrieve a skill assessment by its assessment ID.
	 * 
	 * @param assessmentId The ID of the assessment to retrieve the skill assessment
	 *                     for.
	 * @return the skill assessment object.
	 */
	@GetMapping(path = APIConstants.GET_SKILL_ASSESSMENT_BY_ASSESSMENT_URL)
	public SkillAssessment getSkillAssessmentByAssessmentId(@PathVariable int assessmentId) {
		return skillassessmentService.getSkillAssessmentByAssessmentId(assessmentId);
	}
	/**
	 * Method for handling add coding question request
	 * Handles POST requests to create a new coding question request.
	 * @param coding  question request The coding question request object, provided in the request body.
	 * @return ResponseEntity with HTTP status 201 (CREATED) and the added coding question request object.
	 */
	@PostMapping(APIConstants.ADD_CODING_QUESTION_REQUEST_URL)
	public ResponseEntity<CodingQuestionRequest> addCodingQuestionRequest(
			@RequestBody CodingQuestionRequest codingquestionrequest) {
		CodingQuestionRequest addedcodingquestionrequest = skillassessmentService
				.addCodingQuestionRequest(codingquestionrequest);
		return new ResponseEntity<>(addedcodingquestionrequest, HttpStatus.CREATED);
	}
	
	/**
	 * Method for handling delete request
	 * Handles DELETE requests to delete a coding question request identified by its requestId.
	 * @param requestId The ID of the coding question request to delete, provided as a path variable.
	 * @return ResponseEntity with HTTP status 200 (OK) and a success message if the deletion is successful,
	 * or HTTP status 404 (NOT_FOUND) if the deletion fails.
	 */
	@DeleteMapping(APIConstants.DELETE_CODING_QUESTION_REQUEST_URL + "/{requestId}")
	public ResponseEntity<Object> deleteRequest(@PathVariable int requestId) {
		if (skillassessmentService.deleteRequest(requestId)) {
			return ResponseEntity.ok(MessageConstants.SUCCESS);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	/**
	 * Method for handling get request by ID
	 * Handles GET requests to retrieve a coding question request identified by its requestId.
	 * @param requestId The ID of the coding question request to retrieve, provided as a path variable.
	 * @return ResponseEntity with HTTP status 200 (OK) and the retrieved request if found,
	 * or HTTP status 400 (BAD_REQUEST) if the request is not found or an error occurs.
	 */
	@GetMapping(path = APIConstants.GET_ALL_CODING_QUESTION_REQUEST_URL + "/{requestId}")
	public ResponseEntity<Object> getRequestById(@PathVariable int requestId) {
		try {
			return ResponseEntity.ok(skillassessmentService.findRequestById(requestId));
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
	/**
	 * Method for handling get all requests
	 * Handles GET requests to retrieve all coding question requests.
	 * @return ResponseEntity with HTTP status 200 (OK) and a list of all requests if found,
	 * or HTTP status 400 (BAD_REQUEST) if an error occurs.
	 */
	@GetMapping(path = APIConstants.GET_ALL_CODING_QUESTION_REQUEST_URL)
	public ResponseEntity<Object> getAllRequest() {
		try {
			return ResponseEntity.ok(skillassessmentService.findAllRequest());
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
	/**
	 * Method for handling get all coding question requests by skill assessment ID
	 * Handles GET requests to retrieve all coding question requests associated with a specific skill assessment.
	 * @param skillAssessmentId The ID of the skill assessment, provided as a path variable.
	 * @return A list of coding question requests associated with the specified skill assessment.
	 */
 
	@GetMapping(path = APIConstants.GET_SKILL_ASSESSMENT_DETAILS_URL)
	public List<CodingQuestionRequest> getAllCodingQuestionRequest(@PathVariable int skillAssessmentId) {
		return skillassessmentService.getAllRequestBySkillAssessmentId(skillAssessmentId);
	}
 
}