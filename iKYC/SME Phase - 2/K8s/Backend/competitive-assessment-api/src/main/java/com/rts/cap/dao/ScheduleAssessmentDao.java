package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.Assessment;
import com.rts.cap.model.FeedbackDynamicAttribute;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.SecretKey;

/**
 * @author ranjitha.rajaram
 * @since 04-07-2024
 * @version 2.0
 */

public interface ScheduleAssessmentDao {

	public ScheduleAssessment createScheduleAssessment(ScheduleAssessment scheduleAssessment);

	public ScheduleAssessment findScheduleAssessmentById(int assessmentId);
	
	public boolean addFeedbackAttribute(FeedbackDynamicAttribute dynamicAttribute);

	public ScheduleAssessment updateScheduleAssessment(ScheduleAssessment scheduleAssessment);

	public List<ScheduleAssessment> getAllScheduleAssessment();

	public boolean deleteSchedulingById(int schedulingId);

	public SecretKey findScheduleAssessmentByAccessKey(SecretKey secretKey);
	
	public List<ScheduleAssessment> findSchedulingByUser(int userId);
	
    List<Object[]> findScheduledAssessmentsByEmail(String userEmail, String currentDate);
    
    public Assessment findAssessmentBySchedulingId(int schedulingId);
    
    
    /**
	 * @author varshinee.manisekar
	 * @since 14-07-2024
	 * @version 1.0
	 */

	public List<ScheduleAssessment> findScheduledSkillAssessmentOfUser(String email, String dateString);
	
	


}
