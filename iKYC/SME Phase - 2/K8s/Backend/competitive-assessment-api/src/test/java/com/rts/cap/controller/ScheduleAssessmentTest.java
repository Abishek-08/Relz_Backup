package com.rts.cap.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.rts.cap.dto.AssessmentDto;
import com.rts.cap.dto.PostponedAssessmentDto;
import com.rts.cap.dto.ScheduleAssessmentDto;
import com.rts.cap.model.ScheduleAssessment;

/**
 * @author ranjitha.rajaram
 * @since 08-07-2024
 * @version 2.0
 */
@SpringBootTest
class ScheduleAssessmentTest {

	@Autowired
	private ScheduleAssessmentController scheduleAssessmentController;

	@Test
	@Order(1)
	@DisplayName("Schedule Assessment to Users")
	@Disabled("Testing Purpose")
	void testScheduleAssessment() {
		ScheduleAssessmentDto dto = new ScheduleAssessmentDto();
		dto.setStartTime("10:00 AM");
		dto.setDuration("60");
		dto.setAssessmentDate("2024-07-10");
		dto.setAssessmentId(1);
		int result = scheduleAssessmentController.scheduleAssessmentToUsers(dto);
		assertThat(result).isPositive();
	}

	@Test
	@Order(2)
	@DisplayName("Get All Schedule Assessment")
	@Disabled("Testing Purpose")
	void testGetAllScheduleAssessment() {
		ResponseEntity<Object> response = scheduleAssessmentController.getAllScheduleAssessment();
		assertEquals(HttpStatus.OK, response.getStatusCode());

	}

	@Test
	@Order(3)
	@DisplayName("Update Existing Schdeule Assessment")
	@Disabled("Testing Purpose")
	void testUpdateScheduleAssessment() {
		PostponedAssessmentDto postponedAssessmentDto = new PostponedAssessmentDto();
		postponedAssessmentDto.setSchedulingId(1);
		postponedAssessmentDto.setStartTime("2024-07-16T10:00:00");
		postponedAssessmentDto.setUpdateDuration("60");
		postponedAssessmentDto.setAssessmentDate("2024-07-20");

		ScheduleAssessment updatedAssessment = scheduleAssessmentController
				.updateScheduleAssessment(postponedAssessmentDto);

		assertNotNull(updatedAssessment);
		assertEquals(1, updatedAssessment.getSchedulingId());
		assertEquals("2024-07-16T10:00:00", updatedAssessment.getStartTime());
		assertEquals("60", updatedAssessment.getDuration());
		assertEquals("2024-07-20", updatedAssessment.getAssessmentDate());
	}

	@Test
	@Order(4)
	@DisplayName("Schdeule assessment to user's")
	@Disabled("Testing purpose")
	void testScheduleAssessmentToUsersById() {
		List<Integer> userList = Arrays.asList(1, 2);
		int id = 18;
		ResponseEntity<Object> response = scheduleAssessmentController.scheduleAssessmentToUsers(userList, id);
		assertEquals(HttpStatus.OK, response.getStatusCode());
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 16-07-2024
	 * @version 3.0
	 */

//	@Test
//	@Order(5)
//	@DisplayName("Delete User's from Scheduling")
//	@Disabled("Testing Purpose")
//	void testdeleteuUsersFromSchedule() {
//		List<Integer> userList = Arrays.asList(1, 2);
//		int schedulingId = 18;
//		ResponseEntity<Object> response = scheduleAssessmentController.deleteUserfromScheduling(schedulingId, userList);
//		assertEquals(HttpStatus.OK, response.getStatusCode());
//	}

//	@Test
//	@Order(6)
//	@DisplayName("Cancel Scheduling")
//	@Disabled("Testing Purpose")
//	void testCancelScheduling() {
//		int schedulingId = 6;
//		ScheduleAssessment assessment = new ScheduleAssessment();
//		assessment.setStatus(MessageConstants.ASSESSMENT_SCHEDULE_STATUS);
//		assessment.setUser(new ArrayList<>());
//		ResponseEntity<Object> response = scheduleAssessmentController.cancelScheduling(schedulingId);
//		assertEquals(ResponseEntity.ok(MessageConstants.ASSESSMENT_CANCELLED_SUBJECT), response);
//	}
//
//	@Test
//	@Order(7)
//	@DisplayName("Delete user from scheduling")
//	@Disabled("Testing Purpose")
//	void testDeleteUserFromScheduling() {
//		int schedulingId = 1;
//		List<Integer> userList = Arrays.asList(1, 2, 3);
//		ResponseEntity<Object> response = scheduleAssessmentController.deleteUserfromScheduling(schedulingId, userList);
//		assertEquals(HttpStatus.OK, response.getStatusCode());
//		assertEquals("SUCCESS", response.getBody());
//	}
//
//	@Test
//	@Order(8)
//	@DisplayName("Delete user from scheduling empty userlist")
//	@Disabled("Testing Purpose")
//	void testDeleteUserFromScheduling_EmptyUserList() {
//		int schedulingId = 1;
//		List<Integer> userList = new ArrayList<>();
//		ResponseEntity<Object> response = scheduleAssessmentController.deleteUserfromScheduling(schedulingId, userList);
//		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//	}
//
//	@Test
//	@Order(9)
//	@DisplayName("Delete user from scheduling null user list")
//	@Disabled("Testing Purpose")
//	void testDeleteUserFromScheduling_NullUserList() {
//		int schedulingId = 8;
//		List<Integer> userList = null;
//		ResponseEntity<Object> response = scheduleAssessmentController.deleteUserfromScheduling(schedulingId, userList);
//		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//	}

	@Test
	@Order(10)
	@DisplayName("Get scheduled assessment by scheduling id")
	@Disabled("Testing Purpose")
	void testGetScheduleAssessmentById() {
		int schedulingId = 5;
		ResponseEntity<Object> response = scheduleAssessmentController.getScheduleAssessmentById(schedulingId);
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertNotNull(response.getBody());
	}

	@Test
	@Order(11)
	@DisplayName("Get scheduled assessment using sinvalid scheduling Id")
	@Disabled("Testing Purpose")
	void testGetScheduleAssessmentById_InvalidSchedulingId() {
		int schedulingId = -1;
		ResponseEntity<Object> response = scheduleAssessmentController.getScheduleAssessmentById(schedulingId);
		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
	}

	@Test
	@Order(12)
	@DisplayName("Get unscheduled users from users list")
	@Disabled("Testing Purpose")
	void testGetUnScheduledUsers() {
		ResponseEntity<Object> response = scheduleAssessmentController.getUnScheduledUsers();
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertNotNull(response.getBody());
	}

	/**
	 * @author sundharraj.soundhar
	 * @since 08-07-2024
	 */

	@Test
	@DisplayName("get all the scheduled skill assessment of user")
	@Disabled("disabled due testing purpose")
	void testGetScheduleAssessment() {

		ResponseEntity<List<AssessmentDto>> response = scheduleAssessmentController
				.getScheduledSkillAssessment("sundharrajs.m.s422@gmail.com");

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}

	/**
	 * @author sundharraj.soundhar
	 * @since 08-07-2024
	 */

	@Test
	@DisplayName("get all the scheduled skill assessment of user with wrong credentials")
	@Disabled("disabled due testing purpose")
	void testGetScheduleAssessmentNegative() {

		ResponseEntity<List<AssessmentDto>> response = scheduleAssessmentController
				.getScheduledSkillAssessment("sundharrajs.m.s42@gmail.com");

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}

	/**
	 * @author sundharraj.soundhar
	 * @since 08-07-2024
	 */

//	@Test
//	@DisplayName("check the access key with correct key")
//	@Disabled("disabled due testing purpose")
//	void testVerifySecretKeyNegative() {
//
//		ResponseEntity<Object> response = scheduleAssessmentController.verifyAccessKey("lK#2ST");
//
//		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//	}

	/**
	 * @author sundharraj.soundhar
	 * @since 08-07-2024
	 */

//	@Test
//	@DisplayName("check the access key with wrong key")
//	@Disabled("disabled due testing purpose")
//	void testVerifySecretKeyPositive() {
//
//		ResponseEntity<Object> response = scheduleAssessmentController.verifyAccessKey("lK#2hT");
//
//		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
//	}

}
