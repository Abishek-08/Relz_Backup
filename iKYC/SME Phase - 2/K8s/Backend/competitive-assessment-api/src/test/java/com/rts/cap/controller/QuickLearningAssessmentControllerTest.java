package com.rts.cap.controller;

import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.rts.cap.model.QuickLearningAssessment;

@SpringBootTest
class QuickLearningAssessmentControllerTest {

	@Autowired
	private LearningAssessmentController learningAssessmentController;

	@Test
	@Disabled("build purpose")
	@DisplayName("create Quick Learning Assessment")
	void test_addQuickLearningAssessment() {
		// Arrange
		QuickLearningAssessment quickLearningAssessment = new QuickLearningAssessment();
		quickLearningAssessment.setTopicId(1);
		quickLearningAssessment.setNumberOfQuestion(15);
		quickLearningAssessment.setBasic(3);
		quickLearningAssessment.setIntermediate(5);
		quickLearningAssessment.setHard(7);
		QuickLearningAssessment addedQuickLearningAssessment = learningAssessmentController
				.addQuickLearningAssesment(quickLearningAssessment);
		assertNotNull(addedQuickLearningAssessment);

	}

	@Test
	@Disabled("build purpose")
	@DisplayName("get All Learning Assessment")
	void test_getAllQuickLearningAssessment() {
		List<QuickLearningAssessment> quickLearningAssessment = learningAssessmentController
				.getAllQuickLearningAssesment();
		assertNotNull(quickLearningAssessment);
	}

	

}
