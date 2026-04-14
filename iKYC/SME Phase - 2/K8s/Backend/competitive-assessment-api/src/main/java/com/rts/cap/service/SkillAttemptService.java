package com.rts.cap.service;

import java.util.List;

import com.rts.cap.dto.AttemptResponseDto;
import com.rts.cap.dto.CodingQuestionDto;
import com.rts.cap.dto.RunResultDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.SkillAttempt;


/**
 * @author dharshsun.s,vinolisha.vijayakumar, prem.mariyappan, sanjay.subramani
 * @since 07-07-2024
 * @version 1.0
 */

/**
 * This interface for giving schedulingId, userId to return some specific fields
 */
public interface SkillAttemptService {
	
	public List<CodingQuestionDto> getCodingQuestions(int attemptId);
	
	public int mapCodingQuestion(int userId, int schedulingId);

	public RunResultDto executeCode(int questionId, String code, String language) throws CapBusinessException;
	
	public boolean postSubmittedResponse(AttemptResponseDto attemptResponseDto) throws CapBusinessException;
	
	public boolean updateEvaluationStatus(int attemptId);
	
	public SkillAttempt findById(int attemptId);
	
	public List<SkillAttempt>findByUserId(int userId) throws CapBusinessException;
	
	public String customExecuteCode(String inputs, String code, String language) throws CapBusinessException;
	
}
