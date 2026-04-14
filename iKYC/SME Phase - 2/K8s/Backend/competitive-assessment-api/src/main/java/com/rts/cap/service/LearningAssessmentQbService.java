package com.rts.cap.service;



import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import com.rts.cap.dto.LearningAssessementSingleQuestionDto;
import com.rts.cap.dto.UploadReportDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Answer;
import com.rts.cap.model.Subtopic;
import com.rts.cap.model.Topic;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

public interface LearningAssessmentQbService {
    
	
	// adding or update the single learning assessment question in database
	public boolean addOrUpdateLearningAssessmentSingleQuestion(LearningAssessementSingleQuestionDto  assessementSingleQuestionDto);
	
	// get the single learning assessment question with connected options in database
	public List<Answer> getLearningAssessmentSingleQuestion(int questionId);
	
	//get All the Topic List Method
	public List<Topic> getAllTopics();
	
	//get List of Subtopics based on selected topic
	public List<Subtopic>getSubtopicBasedOnTopic(int topicId);
	
	//delete operation for single question with connected options
	public boolean deleteSingleQuestionWithOptions(int questionId);
	 
	// enable a single question 
	 public boolean updateSingleQuestionStatus(int questionId, String status);
	 
	// add or Update a new Topic 
	 public boolean addOrUpdateTopic(Topic topic);
	 
	 //add or Update a new Subtopic
	 public boolean addOrUpdateSubTopic(Subtopic subtopic);
	 
	 public boolean deleteSingleAnswer(int answerId);

	//This method used for to convert excel to Question and upload into database
	public UploadReportDto excelToQuestions(InputStream inputStream) throws IOException, CapBusinessException;
}
