package com.rts.cap.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.AssessmentDao;
import com.rts.cap.dao.ScheduleAssessmentDao;
import com.rts.cap.dao.SecretKeyDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.dto.AssessmentDto;
import com.rts.cap.dto.PostponedAssessmentDto;
import com.rts.cap.dto.ScheduleAssessmentDto;
import com.rts.cap.model.Assessment;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.SecretKey;
import com.rts.cap.model.User;
import com.rts.cap.service.MailService;
import com.rts.cap.service.ScheduleAssessmentService;
import com.rts.cap.utils.CommonUtils;

import lombok.RequiredArgsConstructor;

/**
 * @author ranjitha.rajaram
 * @since 04-07-2024
 * @version 2.0
 */

@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleAssessmentServiceImpl implements ScheduleAssessmentService {

	private final MailService mailService;

	private final ScheduleAssessmentDao scheduleAssessmentDao;

	private final UserDao userDao;

	private final SecretKeyDao secretKeyDao;

	private final AssessmentDao assessmentDao;


	private static final Logger LOGGER = LogManager.getLogger(ScheduleAssessmentServiceImpl.class);

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Schedules a new assessment based on the provided DTO.
	 * @param scheduleAssessmentDto the DTO containing the assessment details
	 * @return the created ScheduleAssessment object
	 */
	private ScheduleAssessment scheduleNewAssessment(ScheduleAssessmentDto scheduleAssessmentDto) {

		if (scheduleAssessmentDto.getDynamicAttribute() != null
				&& !scheduleAssessmentDto.getDynamicAttribute().isEmpty()) {
			scheduleAssessmentDto.getDynamicAttribute().forEach(attribute -> {
				attribute.setAssessment(assessmentDao.getAssessmentById(scheduleAssessmentDto.getAssessmentId()));
				scheduleAssessmentDao.addFeedbackAttribute(attribute);
			});
		}

		ScheduleAssessment assessment = new ScheduleAssessment();
		assessment.setAssessmentDate(scheduleAssessmentDto.getAssessmentDate());
		assessment.setStartTime(scheduleAssessmentDto.getStartTime());
		assessment.setDuration(scheduleAssessmentDto.getDuration());
		assessment.setAssessmentLink(MessageConstants.SKILL_ASSESSMENT_URL);
		assessment.setStatus(MessageConstants.ASSESSMENT_SCHEDULE_STATUS);
		Assessment assessment1 = new Assessment();
		assessment1.setAssessmentId(scheduleAssessmentDto.getAssessmentId());
		assessment.setAssessment(assessment1);
		return scheduleAssessmentDao.createScheduleAssessment(assessment);
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Generates a secret key for a user and scheduling assessment.
	 * @param userId       the ID of the user
	 * @param schedulingId the ID of the scheduling assessment
	 * @return the generated SecretKey object
	 */
	private SecretKey createSecretKey(int userId, int schedulingId) {
		int length = 6;
		String generateSecretKey = CommonUtils.randomTemporaryPassword(length);
		SecretKey secretKey = new SecretKey();
		secretKey.setSecretKey(generateSecretKey);
		ScheduleAssessment scheduleAssessment = scheduleAssessmentDao.findScheduleAssessmentById(schedulingId);
		secretKey.setScheduleAssessment(scheduleAssessment);
		User user = userDao.findUserById(userId);
		secretKey.setUser(user);
		return secretKeyDao.secretKeyGeneration(secretKey);
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Schedules a new assessment to users based on the provided DTO.
	 * @param scheduleAssessmentDto the DTO containing the assessment details
	 * @return the scheduling ID of the newly created assessment
	 */
	@Override
	public int scheduleAssessmentTOUsers(ScheduleAssessmentDto scheduleAssessmentDto) {
		ScheduleAssessment schedule = scheduleNewAssessment(scheduleAssessmentDto);
		return schedule.getSchedulingId();
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Schedules an assessment to a list of users.
	 * @param userList the list of user IDs to schedule the assessment for
	 * @param id       the ID of the assessment schedule
	 * @return true if the scheduling is successful, false otherwise
	 */
	@Override
	public boolean scheduleUser(List<Integer> userList, int id) {
		try {
			ScheduleAssessment schedule = scheduleAssessmentDao.findScheduleAssessmentById(id);
			userList.forEach(userId -> {
				User user = userDao.findUserById(userId);
				if (user != null) {
					schedule.getUser().add(user);
					SecretKey secretKey = createSecretKey(user.getUserId(), schedule.getSchedulingId());
					mailService.sendAssessmentScheduleMail(user.getUserName(), user.getUserEmail(),
							secretKey.getSecretKey(), schedule.getAssessmentLink(), schedule.getAssessmentDate(),
							schedule.getStartTime(), schedule.getAssessment().getAssessmentName());
				}
			});
			return true;
		} catch (Exception e) {
			LOGGER.error("An error occurred while scheduling assessments for schedule ID: {}", id, e);
			return false;
		}
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 11-07-2024
	 * @version 3.0 Method for Updates a schedule assessment based on the provided
	 *          PostponedAssessmentDto.
	 * @param postPonedAssessmentDto the PostponedAssessmentDto object containing
	 *                               the updated assessment details
	 * @return the updated ScheduleAssessment object
	 */
	@Override
	public ScheduleAssessment updateScheduleAssessment(PostponedAssessmentDto postPonedAssessmentDto) {
		ScheduleAssessment assessment = scheduleAssessmentDao
				.findScheduleAssessmentById(postPonedAssessmentDto.getSchedulingId());
		assessment.setSchedulingId(postPonedAssessmentDto.getSchedulingId());
		assessment.setAssessmentDate(postPonedAssessmentDto.getAssessmentDate());
		assessment.setStartTime(postPonedAssessmentDto.getStartTime());
		assessment.setDuration(postPonedAssessmentDto.getUpdateDuration());
		assessment.setAssessmentLink(MessageConstants.SKILL_ASSESSMENT_URL);
		assessment.setStatus(postPonedAssessmentDto.getStatus());

		if (MessageConstants.ASSESSMENT_POSTPONED_STATUS.equalsIgnoreCase(postPonedAssessmentDto.getStatus())) {
			assessment.getUser().stream()
					.forEach(user -> mailService.sendUpdateAssessmentMail(user.getUserName(), user.getUserEmail(),
							assessment.getAssessmentDate(), assessment.getStartTime(), assessment.getDuration()));
		} else if (MessageConstants.ASSESSMENT_CANCELLED_STATUS.equalsIgnoreCase(postPonedAssessmentDto.getStatus())) {
			assessment.getUser().stream()
					.forEach(user -> mailService.sendCancelAssessmentMail(user.getUserName(), user.getUserEmail(),
							assessment, postPonedAssessmentDto.getReason(), postPonedAssessmentDto.getDate()));
		} else if (MessageConstants.ASSESSMENT_SCHEDULE_STATUS.equalsIgnoreCase(postPonedAssessmentDto.getStatus())) {
			assessment.getUser().stream().forEach(user -> mailService.sendReScheduleAssessmentMail(user.getUserName(),
					user.getUserEmail(), assessment));
		}

		return scheduleAssessmentDao.updateScheduleAssessment(assessment);
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Method to retrieves a list of all schedule assessments.
	 * @return a list of ScheduleAssessment objects
	 */
	@Override
	public List<ScheduleAssessment> getAllScheduleAssessment() {
		return scheduleAssessmentDao.getAllScheduleAssessment();
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Method for deleting the users from a scheduled assessment by
	 *          their IDs.
	 * @param schedulingId the ID of the scheduling
	 * @param userList     the list of user IDs to delete
	 * @return true if the deletion is successful
	 */
	@Override
	public boolean deleteUserfromScheduling(int schedulingId, List<Integer> userList, String reason, String date) {
		ScheduleAssessment assessment = scheduleAssessmentDao.findScheduleAssessmentById(schedulingId);
		List<User> list = assessment.getUser();
		userList.forEach(userId -> {
			User userToRemove = list.stream().filter(user -> userId.equals(user.getUserId())).findFirst().orElse(null);
			if (userToRemove != null) {
				list.remove(userToRemove);
				mailService.sendCancelAssessmentMail(userToRemove.getUserName(), userToRemove.getUserEmail(),
						assessment, reason, date);
			}
		});
		deleteSecretKeys(schedulingId, userList);
		scheduleAssessmentDao.updateScheduleAssessment(assessment);
		return true;
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Method for deleting the secret keys associated with the given
	 *          user IDs.
	 * @param schedulingId the ID of the scheduling
	 * @param userList     the list of user IDs to delete secret keys for
	 */
	private void deleteSecretKeys(int schedulingId, List<Integer> userList) {
		userList.forEach(userId -> secretKeyDao.deleteUserById(schedulingId));
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Method for Finding a schedule assessment by its ID.
	 * @param schedulingId the ID of the schedule assessment
	 * @return the schedule assessment object
	 */
	@Override
	public ScheduleAssessment findScheduleAssessmentById(int schedulingId) {
		return scheduleAssessmentDao.findScheduleAssessmentById(schedulingId);
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Retrieves a list of users who are not scheduled for any
	 *          assessments.
	 * @return the list of unscheduled users
	 */
	@Override
	public List<User> getUnScheduledUserList() {
		List<User> allUsers = userDao.findAllByUser();
		List<ScheduleAssessment> allAssessments = scheduleAssessmentDao.getAllScheduleAssessment();
		Date now = new Date();
		List<User> scheduledUsers = allAssessments.stream().filter(assessment -> isAssessmentScheduled(assessment, now))
				.flatMap(assessment -> assessment.getUser().stream()).distinct().collect(Collectors.toList());
		return allUsers.stream().filter(user -> !scheduledUsers.contains(user)).collect(Collectors.toList());
	}

	/**
	 * Checks if an assessment is scheduled at the given time.
	 * 
	 * @param assessment the ScheduleAssessment object to check
	 * @param now        the current time
	 * @return true if the assessment is scheduled, false otherwise
	 */
	@SuppressWarnings("deprecation")
	private boolean isAssessmentScheduled(ScheduleAssessment assessment, Date now) {
		try {
			SimpleDateFormat dateFormatter = new SimpleDateFormat(MessageConstants.DATE_FORMAT_2);
			SimpleDateFormat timeFormatter = new SimpleDateFormat(MessageConstants.HOURS_FORMAT);
			Date assessmentDate = dateFormatter.parse(assessment.getAssessmentDate());
			Date startTime = timeFormatter.parse(assessment.getStartTime());
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(assessmentDate);
			calendar.set(Calendar.HOUR_OF_DAY, startTime.getHours());
			calendar.set(Calendar.MINUTE, startTime.getMinutes());
			calendar.set(Calendar.SECOND, 0);
			calendar.set(Calendar.MILLISECOND, 0);
			Date startDateTime = calendar.getTime();
			long durationMinutes = Long.parseLong(assessment.getDuration());
			Date endDateTime = addMinutes(startDateTime, durationMinutes);
			return !now.before(startDateTime) && !now.after(endDateTime);
		} catch (ParseException | NumberFormatException e) {
			LOGGER.error(MessageConstants.IS_ASSESSMENT_SCHEDULED, e);
			return false;
		}
	}

	/**
	 * Adds a specified number of minutes to a given date.
	 * 
	 * @param date    the date to which minutes will be added
	 * @param minutes the number of minutes to add
	 * @return the resulting date after adding the minutes
	 */
	private Date addMinutes(Date date, long minutes) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.MINUTE, (int) minutes);
		return calendar.getTime();
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0 Cancels an assessment scheduling.
	 * @param schedulingId the ID of the assessment scheduling to cancel
	 * @return a response entity with a success message if the cancellation is
	 *         successful, or a bad request response if the assessment is already
	 *         scheduled, postponed, or rescheduled
	 */
	public String cancelScheduling(int schedulingId, String reason, String date) {
		ScheduleAssessment assessment = scheduleAssessmentDao.findScheduleAssessmentById(schedulingId);

		if (assessment.getStatus().equals(MessageConstants.ASSESSMENT_SCHEDULE_STATUS)
				|| assessment.getStatus().equals(MessageConstants.ASSESSMENT_POSTPONED_STATUS)
				|| assessment.getStatus().equals(MessageConstants.ASSESSMENT_RESCHEDULED_STATUS)) {
			return MessageConstants.BAD_REQUEST;

		}
		if (assessment.getStatus().equals(MessageConstants.ASSESSMENT_CANCELLED_STATUS)) {
			List<User> users = assessment.getUser();
			users.forEach(user -> {
				mailService.sendCancelAssessmentMail(user.getUserName(), user.getUserEmail(), assessment, reason, date);
				secretKeyDao.deleteUserById(user.getUserId());

			});
			assessment.setUser(Collections.emptyList());
			assessment.setStatus(MessageConstants.ASSESSMENT_CANCELLED_STATUS);
			scheduleAssessmentDao.updateScheduleAssessment(assessment);
			scheduleAssessmentDao.deleteSchedulingById(schedulingId);

		}
		return MessageConstants.ASSESSMENT_CANCELLED_SUBJECT;
	}

	/**
	 * @author sundhar.soundhar
	 * @since 06-07-2024
	 * @version 2.0 Method list the scheduled skill assessment
	 * @param Login {com.rts.cap.model}
	 * @return the result in the ResponseEntity<Object> : returns the List
	 *         {java.util.List} ScheduleAssessment {com.rts.cap.model}
	 * 
	 */

	@Override
	public List<AssessmentDto> getScheduledSkillAssessment(String email) {

		LOGGER.info(email);
		List<AssessmentDto> scheduleAssessment = new ArrayList<>();
		try {

			List<ScheduleAssessment> scheduledAssessmentUser = scheduleAssessmentDao
					.findScheduledSkillAssessmentOfUser(email, CommonUtils.currentDateString());
			LOGGER.info(scheduledAssessmentUser);
			User user = userDao.findUserByEmail(email);

			List<AssessmentDto> scheduledAssessment = new ArrayList<>();

			scheduledAssessmentUser.forEach(scheduledAssess -> {
				AssessmentDto assessmentDto = new AssessmentDto();
				assessmentDto.setAssessmentId(scheduledAssess.getAssessment().getAssessmentId());
				assessmentDto.setAssessmentInstruction(scheduledAssess.getAssessment().getInstruction());
				assessmentDto.setDuration(scheduledAssess.getDuration());
				assessmentDto.setAssessmentDate(scheduledAssess.getAssessmentDate());
				assessmentDto.setAssessmentName(scheduledAssess.getAssessment().getAssessmentName());
				assessmentDto.setScheduledAssessmentId(scheduledAssess.getSchedulingId());
				assessmentDto.setStartTime(scheduledAssess.getStartTime());
				assessmentDto.setStatus(scheduledAssess.getStatus());
				assessmentDto.setUserId(user.getUserId());
				assessmentDto.setType(MessageConstants.SKILL_ASSESSMENT_VARIABLE);
				scheduledAssessment.add(assessmentDto);
			});

			return scheduledAssessmentUser.stream().noneMatch(sa -> true) ? Collections.emptyList()
					: scheduledAssessment;
		} catch (Exception e) {
			LOGGER.error(MessageConstants.GET_SKILL_ASSESSMENT_MESSAGE, e);
		}

		return scheduleAssessment;

	}

	/**
	 * @author sundhar.soundhar
	 * @since 07-07-2024
	 * @version 2.0 Method check the access key and then based on the access key the
	 *          assessment details will be shown
	 * @params this method takes String {java.lang} has a parameter
	 * @return ScheduleAssessment {com.rts.cap.model}
	 */

	@Override
	public AssessmentDto validateAccessKey(SecretKey secretKey) {
		AssessmentDto assessmentDto = new AssessmentDto();

		try {
			SecretKey secretKeyTemp = scheduleAssessmentDao.findScheduleAssessmentByAccessKey(secretKey);

			if (secretKeyTemp.getSecretKey().equals(secretKey.getSecretKey())) {
				ScheduleAssessment scheduledAssess = scheduleAssessmentDao
						.findScheduleAssessmentById(secretKeyTemp.getScheduleAssessment().getSchedulingId());

				assessmentDto.setAssessmentId(scheduledAssess.getAssessment().getAssessmentId());
				assessmentDto.setAssessmentInstruction(scheduledAssess.getAssessment().getInstruction());
				assessmentDto.setDuration(scheduledAssess.getDuration());
				assessmentDto.setAssessmentDate(scheduledAssess.getAssessmentDate());
				assessmentDto.setAssessmentName(scheduledAssess.getAssessment().getAssessmentName());
				assessmentDto.setScheduledAssessmentId(scheduledAssess.getSchedulingId());
				assessmentDto.setStartTime(scheduledAssess.getStartTime());
				assessmentDto.setStatus(scheduledAssess.getStatus());

				return assessmentDto;
			}

			return new AssessmentDto();
		} catch (Exception e) {
			LOGGER.error(MessageConstants.VALID_SECRETKEY_ERROR, e);
		}

		return assessmentDto;

	}

	/**
	 * @author varshinee.manisekar
	 * @since 15-07-2024
	 * @version 2.0 Method for listing scheduled knowledge assessments
	 * 
	 * @param userEmail is used based on the user's mail id, the scheduled knowledge
	 *                  assessment will be shown
	 */
	@Override
	public List<AssessmentDto> findScheduledAssessmentsByEmail(String userEmail) {

		List<Object[]> scheduledLearningAssessments = scheduleAssessmentDao.findScheduledAssessmentsByEmail(userEmail,
				CommonUtils.currentDateString());
		User user = userDao.findUserByEmail(userEmail);

		List<AssessmentDto> scheduledAssessment = new ArrayList<>();

		scheduledLearningAssessments.forEach(scheduledAssess -> {
			ScheduleAssessment scheduleAssessment = (ScheduleAssessment) scheduledAssess[0];
			String type = (String) scheduledAssess[1]; // Assuming the second element is a String type

			AssessmentDto assessmentDto = new AssessmentDto();

			assessmentDto.setAssessmentId(scheduleAssessment.getAssessment().getAssessmentId());
			assessmentDto.setAssessmentInstruction(scheduleAssessment.getAssessment().getInstruction());
			assessmentDto.setDuration(scheduleAssessment.getDuration());
			assessmentDto.setAssessmentDate(scheduleAssessment.getAssessmentDate());
			assessmentDto.setAssessmentName(scheduleAssessment.getAssessment().getAssessmentName());
			assessmentDto.setScheduledAssessmentId(scheduleAssessment.getSchedulingId());
			assessmentDto.setStartTime(scheduleAssessment.getStartTime());
			assessmentDto.setStatus(scheduleAssessment.getStatus());
			assessmentDto.setType(type);
			assessmentDto.setUserId(user.getUserId());
			scheduledAssessment.add(assessmentDto);
		});

		return scheduledAssessment;
	}

}
