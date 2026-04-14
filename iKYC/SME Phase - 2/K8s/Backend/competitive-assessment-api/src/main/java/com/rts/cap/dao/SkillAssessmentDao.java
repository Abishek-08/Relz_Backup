package com.rts.cap.dao;

/**
 * @author sowmiya.ramu
 * @since 04-07-2024
 * @version 2.0
 */

import java.util.List;

import com.rts.cap.model.CodingQuestionRequest;
import com.rts.cap.model.SkillAssessment;

public interface SkillAssessmentDao {
	/**
	 * 
	 * @param for creating skill assessment
	 * @return
	 * 
	 */
	public SkillAssessment createSkillAssessment(SkillAssessment skillassessment);

	public List<SkillAssessment> findAllSkillAssessment();

	public SkillAssessment findSkillAssessmentById(int skillAssessmentId);

	public SkillAssessment getSkillAssessmentByAssessmentId(int assessmentId);
	
	public CodingQuestionRequest createRequest(CodingQuestionRequest codingquestionrequest);
	
	public boolean deleteRequest(int requestId);
	 
	public List<CodingQuestionRequest> findAllRequest();
 
	public CodingQuestionRequest findRequestById(int requestId);
 
	public List<CodingQuestionRequest> getAllRequestBySkillAssessmentId(int skillAssessmentId);
 
	public boolean checkExistenceId(String level, int categoryId, int skillAssessmentId);
 
	public List<CodingQuestionRequest> findExistingRequest(String level, int categoryId, int skillAssessmentId);

}
