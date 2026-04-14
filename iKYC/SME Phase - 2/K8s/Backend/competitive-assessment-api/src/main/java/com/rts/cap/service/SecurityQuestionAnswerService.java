package com.rts.cap.service;

import java.util.List;

import com.rts.cap.model.SecurityQuestionAnswers;
import com.rts.cap.model.SecurityQuestions;

/**
 * @author sundharraj.soundhar
 * @since 05-07-2024
 * @version 2.0
 * 
 */
public interface SecurityQuestionAnswerService {

public List<SecurityQuestionAnswers> mapSecurityQuestionToUser(String email,List<SecurityQuestionAnswers> securityQuestionAnswers);
	
	
	public List<String> getMappedQuestion(String email);
	
	public boolean verifySecurityQuestions(String email, List<SecurityQuestionAnswers> securityQuestionAnswers);
	
	public boolean addSecurityQuestion(SecurityQuestions questions) ;
	
	public List<String> getAllSecurityQuestion() ;

}
