package com.rts.cap.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import com.rts.cap.dto.LearningAssessmentScoreCardDto;

/**
 * @author karpagam.boothanathan
 * @since 24-07-2024
 * @version 4.0
 */

@SpringBootTest
class LearningAssessmentEvaluationControllerTest {

	/**
	 * @autowired LearningAssessmentEvaluationController
	 */

	@Autowired
	private LearningAssessmentEvaluationController learningAssessmentEvaluationController;

	@Test
	@DisplayName("Evalauating mark for learning Assessment based on Topic")
	@Disabled("Integration purpose")
	public void testEvaluateLearningAssessment() {

		LearningAssessmentScoreCardDto learningAssessmentScoreCardDto = new LearningAssessmentScoreCardDto();

		ResponseEntity<Boolean> response = learningAssessmentEvaluationController
				.evaluateLearningAssessment(learningAssessmentScoreCardDto);

		assertEquals(ResponseEntity.ok(true), response);

	}
}
