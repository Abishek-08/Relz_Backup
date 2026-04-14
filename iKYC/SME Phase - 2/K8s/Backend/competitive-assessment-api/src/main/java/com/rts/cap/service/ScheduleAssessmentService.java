package com.rts.cap.service;

/**
 * @author ranjitha.rajaram
 * @since 04-07-2024
 * @version 2.0
 */

import java.util.List;

import com.rts.cap.dto.AssessmentDto;
import com.rts.cap.dto.PostponedAssessmentDto;
import com.rts.cap.dto.ScheduleAssessmentDto;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.SecretKey;
import com.rts.cap.model.User;

public interface ScheduleAssessmentService {

	public int scheduleAssessmentTOUsers(ScheduleAssessmentDto scheduleAssessmentDto);

	public ScheduleAssessment updateScheduleAssessment(PostponedAssessmentDto postPonedAssessmentDto);

	public List<ScheduleAssessment> getAllScheduleAssessment();

	public List<AssessmentDto> getScheduledSkillAssessment(String email);

	public boolean scheduleUser(List<Integer> userList, int id);

	public ScheduleAssessment findScheduleAssessmentById(int schedulingId);

	/**
	 * @author ranjitha.rajaram
	 * @since 11-07-2024
	 * @version 3.0
	 */
	public boolean deleteUserfromScheduling(int schedulingId, List<Integer> userList, String reason, String date);

	public List<User> getUnScheduledUserList();

	public String cancelScheduling(int schedulingId, String reason, String date);


	/**
	 * @author sundhar.soundhar
	 * @since 07-07-2024
	 * @version 2.0
	 * @params this method takes String {java.lang} has a parameter
	 * @return ScheduleAssessment {com.rts.cap.model}
	 */
	public AssessmentDto validateAccessKey(SecretKey secretKey);

	/**
	 * @author varshinee.manisekar
	 * @since 14-07-2024
	 * @version 1.0
	 */
	public List<AssessmentDto> findScheduledAssessmentsByEmail(String userEmail);

}
