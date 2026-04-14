package com.rts.cap.service;

import java.util.List;
import java.util.Map;

import com.rts.cap.dto.LearningAssessmentAllQuestionsDto;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

public interface LearningAssessmentEngineService {
	
	// get all the distinct question and answers with topic and subtopics using join query 
	public List<LearningAssessmentAllQuestionsDto>getAllDistinctLearningQuestionsAndAnswers();
	
	//get Correct answer based give Question Id
	public List<String>getCorrectOptions(int questionId);
	
	//get Question Content on demand basis
	public String getQuestionContent(int questionId);

	// Filter the   questions and answers based on The Topic 
	public List<LearningAssessmentAllQuestionsDto> filterQuestionByTopic(int topicId);
		
	// Filter the   questions and answers based on The Topic and SubTopic 	
	public List<LearningAssessmentAllQuestionsDto> filterQuestionBySubTopic(int topicId, int subTopicId);

	// Filter the   questions and answers based on The Topic,SubTopic and The Complexity
	public List<LearningAssessmentAllQuestionsDto> filterQuestioByQuestionComplexity(int topicId, int subTopicId,
				String complexity);
		
	// Filter the   questions and answers based on The Topic,SubTopic,Complexity and TheQuestionType	
	public List<LearningAssessmentAllQuestionsDto> filterQuestioByQuestiontype(int topicId, int subTopicId,
				String complexity,String questionType);
    
	//Get Quick Assessment Topic Based Question Count
	public Map<String, Long> getTopicBasedQuestionCount(int topicId);
	
	//Get Moderate Assessment Subtopic Based Question Count
	public long getSubtopicBasedQuestionCount(int subtopicId);
	
	//Get All Type Of Learning Assessment case:0 , case:1 , case:2 & case 3 Question & Options
	public List<LearningAssessmentAllQuestionsDto> getAllTypeOfQuestions(String type, int assessmentId);
	
	public Map<String, Long> getSubtopicComplexityQuestionCount(int subtopicId);
	
	

}
