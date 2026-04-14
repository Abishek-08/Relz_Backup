package com.rts.cap.controller;
 
import static org.junit.Assert.assertNotNull;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import com.rts.cap.model.Assessment;
import com.rts.cap.model.LevelZeroLearningAssessment;
@SpringBootTest
class LevelZeroLearningControllerTest {
 
	@Autowired
	private LearningAssessmentController learningAssessmentController;
	
	@Autowired
	private AssessmentController assessmentController;
	
	@Test
	@Disabled("testing purpose")
	@DisplayName("Add L0 Learning Assessment")
	void test_addL0LeraningAssessment() {
	    LevelZeroLearningAssessment levelzeroassessment = new LevelZeroLearningAssessment();
	    levelzeroassessment.setNumberOfQuestion(8);
	    levelzeroassessment.setTopicId(1);
	    levelzeroassessment.setPassMark(58);
	    Assessment assessment = new Assessment();
	    assessment.setAssessmentId(8);
	    levelzeroassessment.setAssessment(assessment);
	    LevelZeroLearningAssessment addedL0Assessment = learningAssessmentController.createAssessment(levelzeroassessment);
	    assertNotNull(addedL0Assessment);
	}
	
	
	 @Test
    @Disabled("testing purpose")
	    @DisplayName("Get All L0 Learning Assessment")
	    void test_GetAllL0LearningAssessment() {
	        ResponseEntity<Object> LevelZeroLearningAssessment = learningAssessmentController.getLevelZeroLearningAssessmentAll();
	        assertNotNull(LevelZeroLearningAssessment);
	    }
}