package com.rts.cap.service;

import java.util.List;

import com.rts.cap.dto.BatchOverallReportDto;
import com.rts.cap.dto.BatchReportGenerationDto;
import com.rts.cap.dto.BatchSkillReportDto;
import com.rts.cap.dto.BatchUsersReportGenerationDto;
import com.rts.cap.dto.GetAllAssessmentDto;
import com.rts.cap.dto.IndividualUserReportDto;
import com.rts.cap.dto.KnowledgeAssessmentCountsDto;
import com.rts.cap.dto.ScheduleAssessmentTypeDto;
import com.rts.cap.dto.UnMappedUserReportDto;

public interface ReportService {

	public List<IndividualUserReportDto> getIndividualUserReport(int schedulingId, String type);

	public UnMappedUserReportDto calculateOverallPercentagesForUnmappedUsers();

	public List<BatchReportGenerationDto> getBatchReport(int batchId, String type);

	public List<BatchUsersReportGenerationDto> getLearningAssessmentBatchUserReport(int batchId, int assessmentId);

	public List<BatchSkillReportDto> getSkillAssessmentBatchUsersReport(int batchId, int assessmentId);

	public List<BatchOverallReportDto> getOverallBatchReport(String type);

	public KnowledgeAssessmentCountsDto getScheduledLearningAssessmentDetails();

	public long getScheduledSkillAssessmentDetails();

	public ScheduleAssessmentTypeDto findAssessmentTypeByAssessmentId(int assessmentId);
	
	public List<GetAllAssessmentDto> getAllAssessment(String type);

}
