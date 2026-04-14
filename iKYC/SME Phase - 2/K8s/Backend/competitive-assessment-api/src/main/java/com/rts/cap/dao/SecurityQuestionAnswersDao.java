package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.SecurityQuestionAnswers;
import com.rts.cap.model.SecurityQuestions;

/*
 * 
 * @author sundharraj.soundhar
 * @since 05-07-2024
 * @version 2.0
 *
 */

public interface SecurityQuestionAnswersDao {
	
	public boolean addAnswer(SecurityQuestionAnswers answers);
	
	public boolean removeAnswer(SecurityQuestionAnswers answers);
	
	public List<SecurityQuestionAnswers> getAnswersByUserEmail(String userEmail);
	
	public boolean addSecurityQuestion(SecurityQuestions questions);
	
	public boolean removeQuestion(SecurityQuestions questions);
	
	public List<String> getAllSecurityQuestion();

}
