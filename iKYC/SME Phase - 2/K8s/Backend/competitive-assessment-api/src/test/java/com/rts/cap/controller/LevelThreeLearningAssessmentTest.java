package com.rts.cap.controller;

import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.rts.cap.model.Assessment;
import com.rts.cap.model.ChosenQuestion;
import com.rts.cap.model.LevelThreeLearningAssessment;

@SpringBootTest
public class LevelThreeLearningAssessmentTest {
	
	@Autowired
	private LearningAssessmentController learningAssessmentController;

	    @Test
		@DisplayName("Get All Level Three Learning Assessment")
		@Disabled("build purpose")
	    public void testGetAllLevelThreeLearningAssessmet() {
	    	 List<LevelThreeLearningAssessment> levelthree = learningAssessmentController.getAllLevelThreeLearningAssessmet();
			 assertNotNull(levelthree);
	    }
	    
	    @Test
	    @Disabled("Build purpose")
	    @DisplayName("Test Level Three Learning Assessment")
	    public void testAddLevelThreeLearningAssessment() {
	    	LevelThreeLearningAssessment levelThree = new LevelThreeLearningAssessment();
	    	Long id = 1L;
	    	Assessment assessment = new Assessment();
	    	
	    	assessment.setAssessmentId(1);
	    	
	    	ChosenQuestion chosenquestion = new ChosenQuestion();
	    	
	    	chosenquestion.setBasicCount(10);
	    	chosenquestion.setHardCount(20);
	    	chosenquestion.setIntermediateCount(20);
	    	chosenquestion.setLevelThreeLearningAssessment(levelThree);
	    	chosenquestion.setSubtopicId(id);
	    	chosenquestion.setTopicId(id);
	    	
	    	List<ChosenQuestion> listQuestion = new ArrayList<>();
	    	listQuestion.add(chosenquestion);
	    	
	    	levelThree.setTotalNumberOfQuestions(100);
	    	levelThree.setPassMarks(50);
	    	levelThree.setAssessment(assessment);
	    	levelThree.setChosenQuestions(listQuestion);
	    }
}
