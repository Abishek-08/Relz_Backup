package com.rts.cap.controller;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.rts.cap.dto.LearningAssessmentAllQuestionsDto;

@SpringBootTest
class LearningAssessmentEngineControllerTest {

	/**
	 * @autowired LearningAssessmentEngineController
	 */

	@Autowired
	private LearningAssessmentEngineController learnignAssessmentEngineController;

	@Test
	@DisplayName("Get all Learning Assessment Question Based On The Topic")
	@Disabled("testing purpose")
	void testfilterQuestionsByTopic() {
		assertNotNull(learnignAssessmentEngineController.filterByTopic(2));
	}

	@Test
	@DisplayName("Get all Learning Assessment Question Based On The Topic And SubTopic")
	@Disabled("testing purpose")
	void testfilterQuestionsByTopicAndSubTopic() {
		assertNotNull(learnignAssessmentEngineController.filterBySubTopic(2, 15));
	}

	@Test
	@DisplayName("Get all Learning Assessment Question Based On The Topic,SubTopic and Complexity")
	@Disabled("testing purpose")
	void testfilterQuestionsByTopicAndSubTopicAndComplexity() {
		assertNotNull(learnignAssessmentEngineController.filterByQuestionComplexity(1, 100, "hard"));
	}

	@Test
	@DisplayName("Get all Learning Assessment Question Based On The Topic,SubTopic,Complexity and QuestionType")
	@Disabled("testing purpose")
	void testfilterQuestionsByTopicAndSubTopicAndComplexityAndType() {
		assertNotNull(learnignAssessmentEngineController.filterByQuestionType(1, 10, "easy", "ssq"));
	}
	
	

	/**
	 * @author karpagam.boothanathan
	 * @since 24-07-2024
	 * @version 4.0
	 */
	
	@Test
	@Disabled("Integration purpose")
	@DisplayName("Get Level Three Assesment Randomized question")
	void getLevelthreeAssessment() {
		
		String assessmentType = "Advance";
		int assessmentId = 3;
		List<LearningAssessmentAllQuestionsDto> response = learnignAssessmentEngineController.getAllTypeAssessmentQuestions(assessmentType, assessmentId);
		assertNotNull(response);
		
	}

	
}
