package com.rts.cap.controller;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.rts.cap.model.SkillAssessment;

@SpringBootTest
class SkillAssessmentControllerTest {

	@Autowired
	private SkillAssessmentController skillAssessmentController;

	@Autowired
	private AssessmentController assessmentController;

	@Test
	@Disabled("testing purpose")
	@DisplayName("GetAll SkillAssessment Details")
	void test_getAllSkillAssessment() {
		ResponseEntity<?> getallskillassessment = skillAssessmentController.getAllSkillAssessment();
		assertNotNull(getallskillassessment);
	}

	@Test
	@Disabled("testing purpose")
	@DisplayName("Find Skill Assessment By Id")
	void test_findSkillAssessmentById() {
		SkillAssessment skillAssessment = new SkillAssessment();
		skillAssessment.setSkillAssessmentId(1);
		skillAssessmentController.findSkillAssessmentById(1);
		ResponseEntity<?> findSkillAssessmentById = skillAssessmentController.findSkillAssessmentById(1);
		assertEquals(HttpStatus.OK, findSkillAssessmentById.getStatusCode());
	
	}

//	@Test
//	@Disabled("testing purpose")
//	@DisplayName("Get Skill Assessment Details Using Assessment Id")
//	void test_getSkillAssessmentByAssessmentId() {
//	    SkillAssessment skillAssessment = new SkillAssessment();
//	    skillAssessment.setAssessment(new Assessment());
//	    skillAssessmentController.getSkillAssessmentByAssessmentId(1);
//	    SkillAssessment skillAssessmentDetails = skillAssessmentController.getSkillAssessmentByAssessmentId(1);
//        assertEquals(skillAssessment, skillAssessmentDetails);
//	}
	


}
