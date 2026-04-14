package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.dto.LearningAssessmentAllQuestionsDto;
import com.rts.cap.model.LevelThreeLearningAssessment;
import com.rts.cap.model.LevelZeroLearningAssessment;
import com.rts.cap.model.ModerateLearningAssessment;
import com.rts.cap.model.MultipleChoiceQuestion;
import com.rts.cap.model.QuickLearningAssessment;


/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

public interface LearningAssessmentEngineDao {
	
	// Get All the Distinct questions and answers
	public List<Object[]> findAllDistinctLearningQuestionsAndAnswers();
	
	// Get Correct answer in on demand basis
	public List<String>getCorrectOptions(int questionId);
	
	// get Specific Question on demand basis
	public String getQuestionContent(int questionId);
	
	/**
	 * @author jeeva.sekar , logeshK.sekar
	 * @since 28-06-2024
	 * @version 1.0
	 */
		 
	// Filter the questions Based on Topic
	public List<LearningAssessmentAllQuestionsDto> getAllQuestionAndAnswerByTopic(int topicId);

	// Filter the questions Based on Topic and SubTopic
	public List<LearningAssessmentAllQuestionsDto> getAllQuestionAndAnswerBySubTopic(int topicId, int subtopicId);

	// Filter the questions Based on Topic,SubTopic and Complexity
	public List<LearningAssessmentAllQuestionsDto> getAllQuestionAndAnswerByComplexity(int topicId, int subTopicId,
				String complexity);

	// Filter the questions Based on Topic,SubTopic,Complexity and QuestionType
	public List<LearningAssessmentAllQuestionsDto> getAllQuestionAndAnswerByQuestionType(int topicId, int subTopicId,
				String complexity, String questionType);

	
	// Get The Answers Based On The Question 
	public List<String> getOptionContentsForQuestion(MultipleChoiceQuestion question);
	
	//Get Question Count Based on Topic
	public long executeCountQuery(int topicId,String complexity);
	
	//Get Question Count Based on subtopic
	public long executeSubtopicComplexityCount(int subtopicId, String complexity);
	
	//Get Question Count Based on Subtopic Id
	public long executeSubtopicCountQuery(int subtopicId);
	
	//Get all Complexity question based on Topic
	public List<MultipleChoiceQuestion> getAllTopicQuestion(int topicId,String complexity);
	
	//Get all Complexity question based on Subtopic
	public List<MultipleChoiceQuestion> getAllSubtopicQuestion(int subtopicId,String complexity);
	
	//get learning assessment criteria from Quick_Learning_Assessment_Table
	public QuickLearningAssessment getLevelOneLearningAssessmentCriteria(int assessmentId);
	
	//get learning assessment criteria from Moderate_Learning_Assessment_Table
	public ModerateLearningAssessment getLevelTwoLearningAssessmentCriteria(int assessmentId);

    //get learning assessment criteria from Level_Zero Assessment 
	public LevelZeroLearningAssessment getLevelZeroLearningAssessmentCriteria(int assessmentId);
	

	/**
	 * @author karpagam.boothanathan
	 * @since 24-07-2024
	 * @version 4.0
	 */
	
	//get learning assessment criteria from Moderate_Learning_Assessment_Table
	public LevelThreeLearningAssessment getLevelThreeLearningAssessmentCriteria(int assessmentId);

	

}
