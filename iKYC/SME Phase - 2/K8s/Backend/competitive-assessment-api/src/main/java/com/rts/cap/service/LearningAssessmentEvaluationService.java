

package com.rts.cap.service;

import java.util.List;

import com.rts.cap.dto.LearningAssessmentReportDto;
import com.rts.cap.dto.LearningAssessmentScoreCardDto;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.User;

/**
 * @author prasanth.baskaran 
 * @since 16-07-2024
 * @version 3.0
 */

public interface LearningAssessmentEvaluationService {
   
	// Evaluate Learning assessment Questions and Answers based on Selected Answers	

	public boolean evaluateAssessment(LearningAssessmentScoreCardDto assessmentScoreCardDto);
	
	public List<LearningAssessmentReportDto> getUserAssessmentReport(int scheduleAssessmentId, int userId);

	public List<ScheduleAssessment> getScoreCardScheduleAssessment();
	
	public List<User> getScoreCardUserList(int scheduleId);
	
	public LearningAssessmentScoreCard getScoreCardDetails (int scheduleId, int userId);
	
	public boolean addScoreCardCompletionStatus(int schedulingId , int userId);
	
	public boolean getCompletionCount(int schedulingId, int userId);
		
}
