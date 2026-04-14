package com.rts.cap.service;

/**
 * @author sowmiya.ramu
 * @since 04-07-2024
 * @version 2.0
 */

import java.util.List;

import com.rts.cap.model.CodingQuestionRequest;
import com.rts.cap.model.SkillAssessment;

public interface SkillAssessmentService {

	public SkillAssessment addSkillAssessment(SkillAssessment skillassessment);

	public List<SkillAssessment> findAllSkillAssessment();

	public SkillAssessment findSkillAssessmentById(int skillAssessmentid);

	public SkillAssessment getSkillAssessmentByAssessmentId(int assessmentId);
	
	public CodingQuestionRequest addCodingQuestionRequest(CodingQuestionRequest codingquestionrequest);
	 
	public boolean deleteRequest(int requestId);
 
	public CodingQuestionRequest findRequestById(int requestId);
 
	public List<CodingQuestionRequest> findAllRequest();
 
	public List<CodingQuestionRequest> getAllRequestBySkillAssessmentId(int skillAssessmentId);
 
	public List<CodingQuestionRequest> findExistingRequest(int count, String level, int categoryId, int skillAssessmentId);

}
