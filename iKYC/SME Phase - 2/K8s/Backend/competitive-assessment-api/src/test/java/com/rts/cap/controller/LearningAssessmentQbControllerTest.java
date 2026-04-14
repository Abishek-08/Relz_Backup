package com.rts.cap.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.rts.cap.dto.LearningAssessementSingleQuestionDto;
import com.rts.cap.model.Answer;
import com.rts.cap.model.MultipleChoiceQuestion;
import com.rts.cap.model.Subtopic;
import com.rts.cap.model.Topic;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

@SpringBootTest
class LearningAssessmentQbControllerTest {

	/**
	 * @autowired learningAssessmentQbController
	 */
	@Autowired
	private LearningAssessmentQbController learningAssessmentQbController;
	
	
    
    
    @Test
	@DisplayName("Should add learning assessment question")
    @Disabled("testing purpose")
	void testAddLearningAssessmentSingleQuestion() {
    	  // Use assertions to verify that the question has been successfully added
		MultipleChoiceQuestion mcq = new MultipleChoiceQuestion();
		mcq.setComplexity("basic");
		mcq.setContent("What is a lambda function in Python?");
		mcq.setMark(1);
		mcq.setQuestionType("SSQ");

		Subtopic subtopic = new Subtopic();
		subtopic.setSubtopicId(1);
		Topic topic = new Topic();
		topic.setTopicId(1);
		subtopic.setTopic(topic);
		mcq.setSubtopic(subtopic);

		List<Answer> answers = Arrays.asList(
				answer(0, "A built-in function for performing mathematical calculations", 0),
				answer(0, "A function that is defined with the def keyword", 0),
				answer(1, "An anonymous function defined using the lambda keyword", 1),
				answer(0, "A function that can only be used with strings", 0));

		LearningAssessementSingleQuestionDto dto = new LearningAssessementSingleQuestionDto();
		dto.setAnswer(answers);
		dto.setQuestion(mcq);

		assertTrue(learningAssessmentQbController.addLearningAssessmentSingleQuestion(dto));
	}
    
    private Answer answer(int correctAnswer, String optionContent, int optionMark) {
		Answer answer = new Answer();
		answer.setCorrectAnswer(correctAnswer);
		answer.setOptionContent(optionContent);
		answer.setOptionMark(optionMark);
		return answer;
	}
    
    @Test
	@DisplayName("get Learning Assessment specifc Single question with their respective answers")
    @Disabled("testing purpose")
	void testGetLearningAssessmentSingleQuestion() {
		int questionId = 2;
		assertNotNull(learningAssessmentQbController.getLearningAssessmentSingleQuestion(questionId));
	}
    
    @Test
	@DisplayName("Should update learning assessment question")
    @Disabled("testing purpose")
	void testUpdateLearningAssessmentSingleQuestion() {
		MultipleChoiceQuestion mcq = new MultipleChoiceQuestion();
		mcq.setQuestionId(11);
		mcq.setComplexity("Intermediate");
		mcq.setContent("What is a lambda function in Python?");
		mcq.setMark(1);
		mcq.setQuestionType("SSQ");

		Subtopic subtopic = new Subtopic();
		subtopic.setSubtopicId(1);
		Topic topic = new Topic();
		topic.setTopicId(1);
		subtopic.setTopic(topic);
		mcq.setSubtopic(subtopic);

		List<Answer> answers = new ArrayList<>();

		answers.add(createAnswer(19, 0, "A built-in function for performing mathematical calculations", 0));
		answers.add(createAnswer(20, 0, "A function that is defined with the def keyword", 0));
		answers.add(createAnswer(21, 1, "An anonymous function defined using the lambda keyword", 1));
		answers.add(createAnswer(22, 0, "A function that can only be used with strings", 0));

		LearningAssessementSingleQuestionDto dto = new LearningAssessementSingleQuestionDto();
		dto.setAnswer(answers);
		dto.setQuestion(mcq);

		assertTrue(learningAssessmentQbController.updateLearningAssessmentSingleQuestion(dto));

	}

	private Answer createAnswer(int optionId, int correctAnswer, String optionContent, int optionMark) {
		Answer answer = new Answer();
		answer.setOptionId(optionId);
		answer.setCorrectAnswer(correctAnswer);
		answer.setOptionContent(optionContent);
		answer.setOptionMark(optionMark);
		return answer;
	}
	
	

	@Test
	@Disabled("build purpose")
	@DisplayName("Get all Learning Assessment Topics")
	void testGetAllTopics() {
		assertNotNull(learningAssessmentQbController.getAllTopics());
	}

	@Test
	@DisplayName("Get all Learning Assessment Subtopics based on Topics")
	@Disabled("testing purpose")
	void testGetAllSubtopicsBasedOnTopic() {
		int topicId = 1;
		assertNotNull(learningAssessmentQbController.getSubtopicsBasedOnTopic(topicId));

	}
	
	@Test
	@DisplayName("Delete Learning Assessment single questions with their respective answers")
	@Disabled("testing purpose")
	void testDeleteSingleQuestionWithOptions() {
		int questionId = 5;
		assertEquals(true, learningAssessmentQbController.deleteSingleQuestionWithOptions(questionId));
	}
	
	
	@Test
	@DisplayName("Disable Learning Assessment Single Question")
	@Disabled("testing purpose")
	void testDisableSingleQuestionDisable() {
		int questionId = 1;
		assertEquals(true, learningAssessmentQbController.updateLearningAssessmentQuestionStatus(questionId,"no"));
	}
	

	@Test
	@DisplayName("Enable Learning Assessment Single Question")
	@Disabled("testing purpose")
	void testEnableSingleQuestionEnable() {
		int questionId = 1;
		assertEquals(true,learningAssessmentQbController.updateLearningAssessmentQuestionStatus(questionId,"yes"));
	}
	
	
}
