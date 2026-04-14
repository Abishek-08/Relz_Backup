package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.Answer;
import com.rts.cap.model.MultipleChoiceQuestion;
import com.rts.cap.model.Subtopic;
import com.rts.cap.model.Topic;


/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

public interface LearningAssessmentQbDao {
     
	 public Topic getTopicById(int topicId);
	 public Subtopic getSubtopicById(int subtopicId);
	 public MultipleChoiceQuestion getQuestionById(int questionId);
	 public MultipleChoiceQuestion getQuestionByName(String content); 
	 public boolean addOrUpdateLearningAssessmentSingleQuestion(MultipleChoiceQuestion question);
	 public boolean addOrUpdateLearningAssessmentSingleAnswer(Answer answer);
	 public List<Answer> getMultipleChoiceQuestionById(int questionId);
	 public List<Topic> getAllTopics();
	 public List<Subtopic> getSubtopicBasedOnTopic(int topicId);
	 public boolean deleteSingleQuestion(int questionId);
	 public boolean updateSingleQuestionStatus(int questionId,String status);
	 public boolean addOrUpdateTopics(Topic topic);
	 public boolean addOrUpdateSubtopic(Subtopic subtopic );
	 public boolean deleteSingleAnswer(int answerId);
	 public boolean questionExistOrNot(String questionContent);
	 public Topic getOrCreateTopic(String topicName);
	 public Subtopic getOrCreateSubtopic(Topic topic, String subtopicName);
	
}
