package com.rts.cap.controller;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.model.Category;
import com.rts.cap.model.CodingQuestionRequest;
import com.rts.cap.model.SkillAssessment;

@SpringBootTest
class CodingQuestionRequestControllerTest {

	

	@SuppressWarnings("unused")
	@Autowired
	private SkillCommonController SkillCommonController; 

	@SuppressWarnings("unused")
	@Autowired
	private SkillAssessmentController skillAssessmentController;

	@Test
	@Disabled("testing purpose")
	@DisplayName("Add coding question request")
	void test_AddCodingQuestionRequest() {
		SkillAssessment skillAssessment = new SkillAssessment();
		skillAssessment.setSkillAssessmentId(1);

		Category category = new Category();
		category.setCategoryId(1);

		CodingQuestionRequest codingquestionrequest = new CodingQuestionRequest();
		codingquestionrequest.setLevel("Easy");
		codingquestionrequest.setCount(1);
		codingquestionrequest.setSkillassessment(skillAssessment);
		codingquestionrequest.setCategory(category);

		skillAssessmentController.addCodingQuestionRequest(codingquestionrequest);

		ResponseEntity<CodingQuestionRequest> response = skillAssessmentController
				.addCodingQuestionRequest(codingquestionrequest);

		assertEquals(HttpStatus.CREATED, response.getStatusCode());
	}

	@Test
	@Disabled("testing purpose")
	@DisplayName("Get All Request")
	 void test_GetAllRequest() {
		ResponseEntity<?> getAllRequest = skillAssessmentController.getAllRequest();
		assertNotNull(getAllRequest);
	}

	@Test
	@Disabled("testing purpose")
	@DisplayName("Get request details using requestId")
	void test_GetRequestById() {
		int requestId = 1;
		CodingQuestionRequest codingquestionrequest = new CodingQuestionRequest();
		codingquestionrequest.setRequestId(requestId);
		skillAssessmentController.getRequestById(requestId);

		ResponseEntity<?> getRequestById = skillAssessmentController.getRequestById(requestId);
		CodingQuestionRequest responseBody = (CodingQuestionRequest) getRequestById.getBody();
		assertNotNull(responseBody);
		assertEquals(requestId, responseBody.getRequestId());
	}


	@Test
	@Disabled("testing purpose")
	@DisplayName("Delete request details using requestId")
	 void test_DeleteRequest() {
		int requestId = 1;
		ResponseEntity<?> response = skillAssessmentController.deleteRequest(requestId);

		if (response.getStatusCode() == HttpStatus.OK) {
			assertEquals(MessageConstants.SUCCESS, response.getBody());
		} else {
			assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
		}
	}

}
