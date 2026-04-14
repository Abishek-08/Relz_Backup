package com.rts.cap.controller;

import static org.junit.Assert.assertNotNull;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;


@SpringBootTest
 class ModerateLearningAssessmentControllerTest {

	@Autowired
	private LearningAssessmentController learningAssessmentController;
	
	@Test
	@Disabled("build purpose")
	@DisplayName("Get All Moderate Learning Assessment")
	void test_GetAllModerateLearninAssessment() {
		ResponseEntity<Object> moderateLearninAssessment = learningAssessmentController.getModerateLearningAssessmentAll();
		assertNotNull(moderateLearninAssessment);
	}
	
	
}
