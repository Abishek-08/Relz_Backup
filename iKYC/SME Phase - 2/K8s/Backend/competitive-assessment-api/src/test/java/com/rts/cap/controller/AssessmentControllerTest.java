package com.rts.cap.controller;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author sowmiya.ramu
 * @since 04-07-2024
 * @version 2.0
 */

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.Assert;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.rts.cap.model.Assessment;

@SpringBootTest
class AssessmentControllerTest {

	@Autowired
	private AssessmentController assessmentController;

	@Test
	@Disabled("testing purpose")
	@DisplayName("Add Assessment details")
	void test_addAssessment() {
	    Assessment assessment = new Assessment();
	    assessment.setAssessmentName("Test Assessment");
	    assessment.setInstruction("Test Instruction"); 
	    ResponseEntity<Assessment> addedAssessment = assessmentController.addAssessment(assessment);
	    assertEquals(HttpStatus.CREATED, addedAssessment.getStatusCode());
	}

//	@Test
//	@Disabled("testing purpose")
//	@DisplayName("Update existing Assessment details")
//	void test_updateAssessment() {
//		Assessment assessment = new Assessment();
//		assessment.setAssessmentId(1);
//		assessment.setAssessmentName("Update Assessment");
//		assessment.setInstruction("Test Instruction Updated");
//		assessmentController.updateAssessment(assessment);
//		Assert.assertNotNull(assessment);
//	}

	@Test
	@Disabled("testing purpose")
	@DisplayName("Assessment name exists")
	void test_verifyAssessmentName() {
		String assessmentName = "Test Assessment";
		assessmentController.verifyAssessmentName(assessmentName);
		ResponseEntity<?> response = assessmentController.verifyAssessmentName(assessmentName);
		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
	}
	

	@Test
	@Disabled("testing purpose")
	@DisplayName("View All Assessment details")
	void test_FindAllAssessment() {
		ResponseEntity<?> getallassessment = assessmentController.getAllAssessment();
		assertNotNull(getallassessment);
	}

	
	/**
	 * @author sherin.david
	 * @version v1.0
	 * @since 05-08-2024
	 */

	@Test
	@DisplayName("Get Assessment by using assessmentId")
	@Disabled("disabled due to testing purpose")
	void testGetAssessment() {
		ResponseEntity<Object> response = assessmentController.getAssessmentById(1);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	
}
