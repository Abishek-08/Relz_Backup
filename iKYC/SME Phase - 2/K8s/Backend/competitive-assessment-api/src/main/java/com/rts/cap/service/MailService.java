package com.rts.cap.service;

import java.util.concurrent.Future;

import com.rts.cap.model.ScheduleAssessment;

public interface MailService {

	public void sendMail(String toMail, String subject, String body);

	public void sendUserAddedEmail(String userEmail, String batchName, String userName);

	public void sendUserBatchRemovalMail(String userEmail, String batchName, String userName);

	public void sendAssessmentScheduleMail(String userName, String userEmail, String secretKey, String assessmentLink,
			String assessmentDate, String startTime, String assessmentName);

	public Future<Boolean> sendChangePasswordMail(String toMail, String subject, String body);

	public void sendCancelAssessmentMail(String userName,String email, ScheduleAssessment scheduleAssessment,String reason,String date);

	public void sendUpdateAssessmentMail(String userName, String userEmail, String assessmentDate, String startTime,
			String duration);
	
	public void sendReScheduleAssessmentMail(String userName, String email,ScheduleAssessment scheduleAssessement);

	public void  sendStatusEnableMail(String userName, String userEmail);

	public void sendStatusDisableMail(String userName, String userEmail);
	
	public void sendUserRequestRejectionMail(String userName, String userEmail);
	
	public void userRegistermail(String userName, String userEmail, String userPassword);
	
	public void deleteUserMail(String userName, String userEmail);
}
