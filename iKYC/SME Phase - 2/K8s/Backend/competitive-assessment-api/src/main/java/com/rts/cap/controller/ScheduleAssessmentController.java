package com.rts.cap.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dto.AssessmentDto;
import com.rts.cap.dto.PostponedAssessmentDto;
import com.rts.cap.dto.ScheduleAssessmentDto;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.SecretKey;
import com.rts.cap.service.ScheduleAssessmentService;

/**
 * @author ranjitha.rajaram
 * @since 04-07-2024
 * @version 2.0
 */

@RestController
@CrossOrigin("*")
@RequestMapping(path = APIConstants.SCHEDULE_BASE_URL)
public class ScheduleAssessmentController {

	private final ScheduleAssessmentService scheduleAssessmentService;

	/**
	 * This is an Dependency injection for the scheduleAssessmentService using
	 * constructor
	 * 
	 * @param scheduleAssessmentService
	 */
	public ScheduleAssessmentController(ScheduleAssessmentService scheduleAssessmentService) {
		super();
		this.scheduleAssessmentService = scheduleAssessmentService;
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Updates a scheduled assessment. This method updates a scheduled
	 *          assessment based on the provided PostponedAssessmentDto object. It
	 *          delegates the update operation to the scheduleAssessmentService.
	 * @param postPonedAssessmentDto the PostponedAssessmentDto object containing
	 *                               the updated assessment details
	 * @return the updated ScheduleAssessment object
	 */
	@PutMapping(path = APIConstants.UPDATE_SCHEDULE_ASSESSMENT_URL)
	public ScheduleAssessment updateScheduleAssessment(@RequestBody PostponedAssessmentDto postPonedAssessmentDto) {
		return scheduleAssessmentService.updateScheduleAssessment(postPonedAssessmentDto);
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Schedules an assessment to users. This method schedules an
	 *          assessment to users based on the provided ScheduleAssessmentDto
	 *          object. It delegates the scheduling operation to the
	 *          scheduleAssessmentService.
	 * @param scheduledAssessmentDto the ScheduleAssessmentDto object containing the
	 *                               assessment details to be scheduled
	 * @return the number of users the assessment was scheduled to
	 */
	@PostMapping(path = APIConstants.ADD_SCHEDULE_URL)
	public int scheduleAssessmentToUsers(@RequestBody ScheduleAssessmentDto scheduledAssessmentDto) {
		return scheduleAssessmentService.scheduleAssessmentTOUsers(scheduledAssessmentDto);

	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Schedules an assessment to a list of users. This method
	 *          schedules an assessment to a list of users based on the provided
	 *          userList and schedulingId. It delegates the scheduling operation to
	 *          the scheduleAssessmentService.
	 * @param userList     a list of user IDs to schedule the assessment to
	 * @param schedulingId the ID of the scheduling assessment
	 * @return a ResponseEntity with a status of OK (200) and the result of the
	 *         scheduling operation
	 */
	@PutMapping(path = APIConstants.SCHEDULE_ASSESSMENT_USERS_URL)
	public ResponseEntity<Object> scheduleAssessmentToUsers(@RequestBody List<Integer> userList,
			@PathVariable("schedulingId") int schedulingId) {
		return ResponseEntity.ok(scheduleAssessmentService.scheduleUser(userList, schedulingId));
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Retrieves all scheduled assessments. This method retrieves all
	 *          scheduled assessments from the system. It delegates the retrieval
	 *          operation to the scheduleAssessmentService.
	 * @return a ResponseEntity with a status of OK (200) and a list of all
	 *         scheduled assessments
	 */
	@GetMapping(path = APIConstants.GET_ALL_SCHEDULE_ASSESSMNET_URL)
	public ResponseEntity<Object> getAllScheduleAssessment() {
		return ResponseEntity.ok(scheduleAssessmentService.getAllScheduleAssessment());
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Cancels a scheduling assessment. This method cancels a
	 *          scheduling assessment with the given schedulingId. It delegates the
	 *          cancellation operation to the scheduleAssessmentService.
	 * @param schedulingId the ID of the scheduling assessment to cancel
	 * @return a ResponseEntity with a status of OK (200) and a message indicating
	 *         the cancellation of the scheduling assessment
	 */
	@DeleteMapping(path = APIConstants.CANCEL_SCHEDULE_ASSESSMENT_URL)
	public ResponseEntity<Object> cancelScheduling(@PathVariable int schedulingId,
			@PathVariable("reason") String reason, @PathVariable("date") String date) {
		return ResponseEntity.status(HttpStatus.OK)
				.body(scheduleAssessmentService.cancelScheduling(schedulingId, reason, date));
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Removes users from a scheduling assessment. This method removes
	 *          the specified users from a scheduling assessment with the given
	 *          schedulingId. It delegates the removal operation to the
	 *          scheduleAssessmentService.
	 * @param schedulingId the ID of the scheduling assessment from which to remove
	 *                     users
	 * @param userList     the list of user IDs to remove from the scheduling
	 *                     assessment
	 * @return a ResponseEntity with a status of OK (200) and a success message if
	 *         the removal is successful, or a status of BAD_REQUEST (400) if the
	 *         removal fails
	 */
	@DeleteMapping(path = APIConstants.REMOVE_USERS_FROM_SCHEDULING_URL)
	public ResponseEntity<Object> deleteUserfromScheduling(@PathVariable int schedulingId,
			@RequestBody List<Integer> userList, @PathVariable("reason") String reason,
			@PathVariable("date") String date) {
		if (scheduleAssessmentService.deleteUserfromScheduling(schedulingId, userList, reason, date)) {
			return ResponseEntity.ok(MessageConstants.SUCCESS);
		} else {
			return ResponseEntity.badRequest().build();
		}
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Retrieves a scheduling assessment by ID. This method retrieves a
	 *          scheduling assessment with the given schedulingId. It delegates the
	 *          retrieval operation to the scheduleAssessmentService.
	 * @param schedulingId the ID of the scheduling assessment to retrieve
	 * @return a ResponseEntity with a status of OK (200) and the retrieved
	 *         scheduling assessment if found, or a status of BAD_REQUEST (400) if
	 *         an error occurs
	 */
	@GetMapping(path = APIConstants.GET_ALL_SCHEDULE_ASSESSMNET_URL + "/{schedulingId}")
	public ResponseEntity<Object> getScheduleAssessmentById(@PathVariable int schedulingId) {
		try {
			return ResponseEntity.ok(scheduleAssessmentService.findScheduleAssessmentById(schedulingId));
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Retrieves a list of unscheduled users. This method retrieves a
	 *          list of users who are not currently scheduled for an assessment. It
	 *          delegates the retrieval operation to the scheduleAssessmentService.
	 * @return a ResponseEntity with a status of OK (200) and the list of
	 *         unscheduled users if successful, or a status of BAD_REQUEST (400) if
	 *         an error occurs
	 */
	@GetMapping(path = APIConstants.GET_UNSCHEDULED_USERS_URL)
	public ResponseEntity<Object> getUnScheduledUsers() {
		try {
			return ResponseEntity.ok(scheduleAssessmentService.getUnScheduledUserList());
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	/**
	 * @author sundhar.soundhar
	 * @since 06-07-2024
	 * @version 1.0
	 * @param Login {com.rts.cap.model}
	 * @return the result in the ResponseEntity<Object> : returns the list of
	 *         scheduled assessment to the user
	 * 
	 */
	@GetMapping(APIConstants.SCHEDULE_ASSESSMENT_SKILL_URL)
	public ResponseEntity<List<AssessmentDto>> getScheduledSkillAssessment(@RequestParam String email) {
		return ResponseEntity.status(HttpStatus.OK).body(scheduleAssessmentService.getScheduledSkillAssessment(email));
	}

	/**
	 * @author sundhar.soundhar
	 * @since 06-07-2024
	 * @version 1.0
	 * @param Login {com.rts.cap.model}
	 * @return the result in the ResponseEntity<Object> : returns the list of
	 *         scheduled assessment to the user
	 * 
	 */
	@PostMapping(APIConstants.SCHEDULE_ASSESSMENT_VERIFY_KEY)
	public ResponseEntity<AssessmentDto> verifyAccessKey(@RequestBody SecretKey secretKey) {
		return ResponseEntity.status(HttpStatus.OK).body(scheduleAssessmentService.validateAccessKey(secretKey));
	}

	/**
	 * @author varshinee.manisekar
	 * @since 15-07-2024
	 * @version 1.0
	 * @param userEmail The email address of the user for whom assessments are
	 *                  scheduled.
	 * @return A list of Object arrays containing ScheduleAssessment and its
	 *         associated LearningAssessment type.
	 * 
	 */
	@GetMapping(APIConstants.GET_SCHEDULED_ASSESSMENT_BY_USEREMAIL_URL)
	public List<AssessmentDto> findScheduledAssessments(@RequestParam(name = "userEmail") String userEmail) {
		return scheduleAssessmentService.findScheduledAssessmentsByEmail(userEmail);
	}

}
