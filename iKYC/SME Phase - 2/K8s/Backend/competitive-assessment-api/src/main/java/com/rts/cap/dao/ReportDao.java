package com.rts.cap.dao;

import java.util.List;

public interface ReportDao {

	public List<Object[]> getIndividualUserSkillReport(int schedulingId);

	public List<Object[]> getIndividualUserKnowledgeReport(int schedulingId);

	public List<Object[]> getLearningBatchReport(int batchId);

	public List<Object[]> getLearningBatchUserReport(int batchId, int assessmentId);

	public List<Object[]> findSkillBatchReport(int batchId);

	public List<Object[]> findSkillAssessmentBatchUsers(int batchId, int assessmentId);

	public List<Object[]> getOverallLearningBatchReport();

	public List<Object[]> findOverallSkillBatchReport();

	public List<Object[]> findAllSkillAssessment();

	public List<Object[]> findAllKnowledgeAssessment();

	public Object[] findOverAllSkillKnowledgeScoreUnBatchedUsers();
	
	public Object[] findKnowledgeOverallAssessmentCount();
	
	public long findAllScheduledSkillAssessment();

}
