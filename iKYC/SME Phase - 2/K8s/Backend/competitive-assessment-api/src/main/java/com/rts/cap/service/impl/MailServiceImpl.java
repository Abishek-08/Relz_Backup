package com.rts.cap.service.impl;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.service.MailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService, AsyncUncaughtExceptionHandler {

	@Value("${spring.mail.username}")
	private String sender;

	@Value("${spring.mail.displayname}")
	private String senderDisplayName;

	private static final Logger LOGGER = LogManager.getLogger(MailServiceImpl.class);
	private final JavaMailSender javaMailSender;

	/**
	 * Handles uncaught exceptions by logging the exception message and method name.
	 *
	 * @param ex     The throwable that was not caught.
	 * @param method The method where the exception occurred.
	 * @param params The parameters passed to the method.
	 */
	@Override
	public void handleUncaughtException(Throwable ex, Method method, Object... params) {
		LOGGER.error("Exception message: {}", ex.getMessage());
		LOGGER.error("Method name: {}", method.getName());
	}

	/**
	 * Sends an email with the specified details using MIME format.
	 *
	 * @param toMail  The recipient's email address.
	 * @param subject The subject of the email.
	 * @param body    The body of the email, which can include HTML content.
	 */
	private void sendMimeMail(String toMail, String subject, String body) {
		MimeMessage mimeMessage = javaMailSender.createMimeMessage();
		try {
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
			helper.setFrom(new InternetAddress(sender, senderDisplayName));
			helper.setTo(toMail);
			helper.setSubject(subject);
			helper.setText(body, true);
			javaMailSender.send(mimeMessage);
		} catch (MessagingException | UnsupportedEncodingException e) {
			LOGGER.error("Error Occurs while sending email", e);
		}
	}

	@Override
	@Async
	public void sendMail(String toMail, String subject, String body) {
		sendMimeMail(toMail, subject, body);
	}

	/**
	 * Asynchronously sends an email with the specified details.
	 *
	 * @param toMail  The recipient's email address.
	 * @param subject The subject of the email.
	 * @param body    The body of the email, which can include HTML content.
	 */
	@Override
	@Async
	public Future<Boolean> sendChangePasswordMail(String toMail, String subject, String body) {
		CompletableFuture<Boolean> future = new CompletableFuture<>();
		try {
			sendMimeMail(toMail, subject, body);
			future.complete(MessageConstants.TRUE_VARIABLE);
		} catch (Exception e) {
			LOGGER.error("Error Occurs while sending change password email", e);
			future.complete(MessageConstants.FALSE_VARIABLE);
		}
		return future;
	}

	/**
	 * Asynchronously sends an email notification to a user when they are added to a
	 * batch.
	 *
	 * @param userEmail The email address of the user being notified.
	 * @param batchName The name of the batch to which the user has been added.
	 * @param userName  The name of the user being added to the batch.
	 */
	@Override
	@Async
	public void sendUserAddedEmail(String userEmail, String batchName, String userName) {
		String htmlBody = MessageConstants.HTML_OPEN_TAG + MessageConstants.BODY_OPEN_TAG
				+ MessageConstants.ADD_USER_TABLE + MessageConstants.TABLE_ROW_OPEN + MessageConstants.TABLE_DATA_OPEN
				+ MessageConstants.HEAD2_OPEN_TAG + userName + MessageConstants.HEAD2_CLOSE_TAG
				+ MessageConstants.PARAGRAPH_STYLE_TAG1 + MessageConstants.ADD_USER_BODY_STATEMENT1
				+ MessageConstants.STRONG_OPEN_TAG + batchName + MessageConstants.STRONG_CLOSE_TAG
				+ MessageConstants.PARAGRAPH_CLOSE_TAG + MessageConstants.PARAGRAPH_STYLE_TAG1
				+ MessageConstants.ADD_USER_BODY_STATEMENT2 + MessageConstants.PARAGRAPH_CLOSE_TAG
				+ MessageConstants.PARAGRAPH_STYLE_TAG2 + MessageConstants.ADD_USER_BODY_STATEMENT3
				+ MessageConstants.PARAGRAPH_CLOSE_TAG + MessageConstants.PARAGRAPH_STYLE_TAG3
				+ MessageConstants.ADD_USER_BODY_STATEMENT4 + MessageConstants.PARAGRAPH_CLOSE_TAG
				+ MessageConstants.TABLE_DATA_CLOSE + MessageConstants.TABLE_ROW_CLOSE
				+ MessageConstants.TABLE_TAG_CLOSE + MessageConstants.BODY_CLOSE_TAG + MessageConstants.HTML_CLOSE_TAG;
		sendMimeMail(userEmail, MessageConstants.USER_BATCH_ADD_SUBJECT, htmlBody);
	}

	/**
	 * Asynchronously sends an email notification to a user when they are removed
	 * from a batch.
	 *
	 * @param userEmail The email address of the user being notified.
	 * @param batchName The name of the batch from which the user has been removed.
	 * @param userName  The name of the user who has been removed from the batch.
	 */
	@Override
	@Async
	public void sendUserBatchRemovalMail(String userEmail, String batchName, String userName) {
		String htmlBody = MessageConstants.HTML_OPEN_TAG + MessageConstants.HEAD_OPEN_TAG
				+ MessageConstants.STYLE_OPEN_TAG + MessageConstants.BODY_REMOVEUSER
				+ MessageConstants.CONTAINER_REMOVEUSER + MessageConstants.HEAD2_REMOVEUSER
				+ MessageConstants.PARAGRAPH1_REMOVEUSER + MessageConstants.HIGHLIGHT_REMOVEUSER
				+ MessageConstants.FOOTER_REMOVEUSER + MessageConstants.BUTTON_REMOVEUSER
				+ MessageConstants.STYLE_CLOSE_TAG + MessageConstants.HEAD_CLOSE_TAG + MessageConstants.BODY_OPEN
				+ MessageConstants.DIV1_OPEN_TAG + MessageConstants.STATEMENT1_REMOVEUSER
				+ MessageConstants.PARAGRAPH2_OPEN_TAG_REMOVEUSER + userName
				+ MessageConstants.PARAGRAPH2_CLOSE_TAG_REMOVEUSER + MessageConstants.PARAGRAPH3_OPEN_TAG_REMOVEUSER
				+ batchName + MessageConstants.PARAGRAPH3_CLOSE_TAG_REMOVEUSER + MessageConstants.STATEMENT2_REMOVEUSER
				+ MessageConstants.DIV2_OPEN_TAG + MessageConstants.USER_STATEMENT3 + MessageConstants.DIV1_CLOSE_TAG
				+ MessageConstants.DIV2_CLOSE_TAG + MessageConstants.BODY_CLOSE_TAG + MessageConstants.HTML_CLOSE_TAG;
		sendMimeMail(userEmail, MessageConstants.USER_BATCH_REMOVAL_SUBJECT, htmlBody);
	}

	/**
	 * Asynchronously sends an email notification to a user about an upcoming
	 * assessment schedule.
	 *
	 * @param userName       The name of the user being notified.
	 * @param userEmail      The email address of the user being notified.
	 * @param secretKey      The secret key required for the assessment.
	 * @param assessmentLink The link to access the assessment.
	 * @param assessmentDate The date of the assessment.
	 * @param startTime      The start time of the assessment.
	 * @param assessmentName The name of the assessment.
	 */
	@Override
	@Async
	public void sendAssessmentScheduleMail(String userName, String userEmail, String secretKey, String assessmentLink,
			String assessmentDate, String startTime, String assessmentName) {
		String body = MessageConstants.HTML_OPEN_TAG + MessageConstants.BODY_TAG_SCHEDULE_ASSESSMENT
				+ MessageConstants.DIV_SCHEDULE_ASSESSMENT + MessageConstants.SCHEDULE_ASSESSMENT_SUBJECT
				+ MessageConstants.PARAGRAPH1_SCHEDULE_ASSESSMENT + userName + MessageConstants.PARAGRAPH_CLOSE_TAG
				+ MessageConstants.STATEMENT1_SCHEDULE_ASSESSMENT + MessageConstants.TABLE_TAG_SCHEDULE_ASSESSMENT
				+ MessageConstants.TABLE_ROW_OPEN + MessageConstants.SCHEDULE_ASSESSMENT_HEADING_STYLES
				+ MessageConstants.SCHEDULE_ASSESSMENT_NAME + MessageConstants.TABLE_DATA_CLOSE
				+ MessageConstants.SCHEDULE_ASSESSMENT_DETAILS_STYLE + assessmentName
				+ MessageConstants.TABLE_DATA_CLOSE + MessageConstants.TABLE_ROW_CLOSE + MessageConstants.TABLE_ROW_OPEN
				+ MessageConstants.SCHEDULE_ASSESSMENT_HEADING_STYLES + MessageConstants.SCHEDULE_ASSESSMENT_DATE
				+ MessageConstants.TABLE_DATA_CLOSE + MessageConstants.SCHEDULE_ASSESSMENT_DETAILS_STYLE
				+ assessmentDate + MessageConstants.TABLE_DATA_CLOSE + MessageConstants.TABLE_ROW_CLOSE
				+ MessageConstants.TABLE_ROW_OPEN + MessageConstants.SCHEDULE_ASSESSMENT_HEADING_STYLES
				+ MessageConstants.SCHEDULE_ASSESSMENT_STARTTIME + MessageConstants.TABLE_DATA_CLOSE
				+ MessageConstants.SCHEDULE_ASSESSMENT_DETAILS_STYLE + startTime + MessageConstants.TABLE_DATA_CLOSE
				+ MessageConstants.TABLE_ROW_CLOSE + MessageConstants.TABLE_TAG_CLOSE
				+ MessageConstants.STATEMENT2_SCHEDULE_ASSESSMENT + MessageConstants.PARAGRAPH2_SCHEDULE_ASSESSMENT
				+ assessmentLink + MessageConstants.SCHEDULE_ASSESSMENT_LINK
				+ MessageConstants.SCHEDULE_ASSESSMENT_SECRETKEY + secretKey + MessageConstants.PARAGRAPH_CLOSE_TAG
				+ MessageConstants.STATEMENT3_SCHEDULE_ASSESSMENT + MessageConstants.USER_STATEMENT3
				+ MessageConstants.DIV1_CLOSE_TAG + MessageConstants.BODY_CLOSE_TAG + MessageConstants.HTML_CLOSE_TAG;

		sendMimeMail(userEmail, MessageConstants.ASSESSMENT_SCHEDULE_SUBJECT, body);
	}

	@Override
	@Async
	public void sendUpdateAssessmentMail(String userName, String userEmail, String assessmentDate, String startTime,
			String duration) {
		try {
			String body = MessageConstants.HTML_OPEN_TAG + MessageConstants.BODY_TAG_SCHEDULE_ASSESSMENT
					+ MessageConstants.DIV_SCHEDULE_ASSESSMENT + MessageConstants.UPDATE_SCHEDULE_ASSESSMENT
					+ MessageConstants.PARAGRAPH1_SCHEDULE_ASSESSMENT + userName + MessageConstants.PARAGRAPH_CLOSE_TAG
					+ MessageConstants.PARAGRAPH_OPEN_TAG + MessageConstants.ASSESSMENT_CANCELLED_BODY_STATEMENT1 + " "
					+ MessageConstants.ASSESSMENT_SCHEDULE_UPDATE_STATEMENT1 + MessageConstants.PARAGRAPH_CLOSE_TAG
					+ MessageConstants.PARAGRAPH_OPEN_TAG + MessageConstants.ASSESSMENT_CANCELLED_BODY_STATEMENT5
					+ MessageConstants.PARAGRAPH_CLOSE_TAG + MessageConstants.TABLE_TAG_SCHEDULE_ASSESSMENT
					+ MessageConstants.TABLE_ROW_OPEN + MessageConstants.SCHEDULE_ASSESSMENT_HEADING_STYLES
					+ MessageConstants.SCHEDULE_ASSESSMENT_DATE + MessageConstants.TABLE_DATA_CLOSE
					+ MessageConstants.SCHEDULE_ASSESSMENT_DETAILS_STYLE + assessmentDate
					+ MessageConstants.TABLE_DATA_CLOSE + MessageConstants.TABLE_ROW_CLOSE
					+ MessageConstants.TABLE_ROW_OPEN + MessageConstants.SCHEDULE_ASSESSMENT_HEADING_STYLES
					+ MessageConstants.SCHEDULE_ASSESSMENT_STARTTIME + MessageConstants.TABLE_DATA_CLOSE
					+ MessageConstants.SCHEDULE_ASSESSMENT_DETAILS_STYLE + startTime + MessageConstants.TABLE_DATA_CLOSE
					+ MessageConstants.TABLE_ROW_CLOSE + MessageConstants.TABLE_ROW_OPEN
					+ MessageConstants.SCHEDULE_ASSESSMENT_HEADING_STYLES
					+ MessageConstants.SCHEDULE_ASSESSMENT_DURATION + MessageConstants.TABLE_DATA_CLOSE
					+ MessageConstants.SCHEDULE_ASSESSMENT_DETAILS_STYLE + duration + MessageConstants.TABLE_DATA_CLOSE
					+ MessageConstants.TABLE_ROW_CLOSE + MessageConstants.TABLE_TAG_CLOSE
					+ MessageConstants.PARAGRAPH_OPEN_TAG + MessageConstants.UPDATE_ASSESSMENT_STATEMENT1
					+ MessageConstants.PARAGRAPH_CLOSE_TAG + MessageConstants.PARAGRAPH_OPEN_TAG
					+ MessageConstants.STATEMENT3_SCHEDULE_ASSESSMENT + MessageConstants.PARAGRAPH_CLOSE_TAG
					+ MessageConstants.USER_STATEMENT3 + MessageConstants.DIV1_CLOSE_TAG
					+ MessageConstants.BODY_CLOSE_TAG + MessageConstants.HTML_CLOSE_TAG;

			sendMimeMail(userEmail, MessageConstants.ASSESSMENT_SCHEDULE_UPDATE_STATUS, body);

		} catch (Exception e) {
			LOGGER.error("Error occurs while sending update assessment email", e);

		}
	}

	/**
	 * Asynchronously sends an email notification to a user about an updated
	 * assessment schedule.
	 *
	 * @param userName       The name of the user being notified.
	 * @param userEmail      The email address of the user being notified.
	 * @param assessmentDate The updated date of the assessment.
	 * @param startTime      The updated start time of the assessment.
	 * @param duration       The duration of the assessment.
	 */
	@Override
	@Async
	public void sendCancelAssessmentMail(String userName, String email, ScheduleAssessment scheduleAssessment,
			String reason, String date) {
		String body = MessageConstants.HTML_OPEN_TAG + MessageConstants.HEAD_OPEN_TAG + MessageConstants.STYLE_OPEN_TAG
				+ MessageConstants.USER_MAIL_REQUEST_REJECTION_BODY
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_CONTAINER
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_HEADER
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_CONTENT
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_FOOTER
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_H1_COLOR
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P1
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_HIGHLIGHT + MessageConstants.STYLE_CLOSE_TAG
				+ MessageConstants.HEAD_CLOSE_TAG + MessageConstants.BODY_OPEN
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_DIV1_OPEN_TAG
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_DIV2_OPEN_TAG
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_H1 + MessageConstants.DIV_CLOSE_TAG
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_DIV3_OPEN_TAG
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P2_OPEN_TAG + userName
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P2_CLOSE_TAG
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P3_OPEN_TAG
				+ scheduleAssessment.getAssessment().getAssessmentName()
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P3_CLOSE_TAG
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P4_OPEN_TAG + reason
				+ MessageConstants.PARAGRAPH_CLOSE_TAG + MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P5_OPEN_TAG + date
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P5_CLOSE_TAG
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P6 + MessageConstants.DIV_CLOSE_TAG
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_DIV4_OPEN_TAG
				+ MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P7 + MessageConstants.USER_MAIL_ASSESSMENT_CANCEL_P8
				+ MessageConstants.DIV_CLOSE_TAG + MessageConstants.DIV_CLOSE_TAG + MessageConstants.BODY_CLOSE_TAG
				+ MessageConstants.HTML_CLOSE_TAG;

		sendMimeMail(email, MessageConstants.ASSESSMENT_CANCELLED_SUBJECT, body);
	}

	@Override
	@Async
	public void sendReScheduleAssessmentMail(String userName, String email, ScheduleAssessment scheduleAssessment) {
		try {
			String assessmentName = scheduleAssessment.getAssessment().getAssessmentName();
			String body = MessageConstants.HTML_WITH_BODY_OPEN_TAG + MessageConstants.DIV_WITH_STYLE_OPEN_TAG
					+ MessageConstants.USER_MAIL_ASSESSMENT_RESCHEDULE_H2
					+ MessageConstants.PARAGRAPH_WITH_DEAR_OPEN_TAG + userName
					+ MessageConstants.PARAGRAPH_WITH_COMMA_CLOSE_TAG + MessageConstants.PARAGRAPH_OPEN_TAG
					+ MessageConstants.ASSESSMENT_CANCELLED_BODY_STATEMENT1 + " " + assessmentName + " "
					+ MessageConstants.ASSESSMENT_RESCHEDULE_STATEMENT1 + MessageConstants.PARAGRAPH_CLOSE_TAG
					+ MessageConstants.PARAGRAPH_OPEN_TAG + MessageConstants.ASSESSMENT_CANCELLED_BODY_STATEMENT3
					+ MessageConstants.PARAGRAPH_CLOSE_TAG + MessageConstants.PARAGRAPH_OPEN_TAG
					+ MessageConstants.ASSESSMENT_CANCELLED_BODY_STATEMENT4 + MessageConstants.PARAGRAPH_CLOSE_TAG
					+ MessageConstants.USER_MAIL_ASSESSMENT_RESCHEDULE_P
					+ MessageConstants.PARAGRAPH_FOR_BEST_REGARDS_TAG + MessageConstants.DIV_CLOSE_TAG
					+ MessageConstants.BODY_CLOSE_TAG + MessageConstants.HTML_CLOSE_TAG;

			sendMimeMail(email, assessmentName + " " + MessageConstants.ASSESSMENT_RESCHEDULE_SUBJECT, body);

		} catch (Exception e) {
			LOGGER.error("Error occurs while sending reschedule assessment email", e);

		}
	}

	/**
	 * Asynchronously sends an email notification to a user about the rescheduling
	 * of an assessment.
	 *
	 * @param userName           The name of the user being notified.
	 * @param email              The email address of the user being notified.
	 * @param scheduleAssessment An object containing details about the rescheduled
	 *                           assessment.
	 */
	@Override
	@Async
	public void sendStatusEnableMail(String userName, String userEmail) {
		try {
			String body = MessageConstants.HTML_WITH_BODY_OPEN_TAG + MessageConstants.DIV_WITH_STYLE_OPEN_TAG
					+ MessageConstants.USER_MAIL_STATUS_ENABLE_H2 + MessageConstants.PARAGRAPH_WITH_DEAR_OPEN_TAG
					+ userName + MessageConstants.PARAGRAPH_WITH_COMMA_CLOSE_TAG + MessageConstants.PARAGRAPH_OPEN_TAG
					+ MessageConstants.USER_STATUS_ACTIVE_STATEMENT1 + MessageConstants.PARAGRAPH_CLOSE_TAG
					+ MessageConstants.USER_MAIL_STATUS_ENABLE_P1 + MessageConstants.USER_MAIL_STATUS_ENABLE_P2
					+ MessageConstants.PARAGRAPH_FOR_BEST_REGARDS_TAG + MessageConstants.DIV_CLOSE_TAG
					+ MessageConstants.BODY_CLOSE_TAG + MessageConstants.HTML_CLOSE_TAG;

			sendMimeMail(userEmail, MessageConstants.USER_STATUS_ACTIVE, body);
		} catch (Exception e) {
			LOGGER.error("Error occurs while sending status enable email", e);
		}
	}

	/**
	 * Asynchronously sends an email notification to a user regarding the disabling
	 * of their account status.
	 *
	 * @param userName  The name of the user being notified.
	 * @param userEmail The email address of the user being notified.
	 */
	@Override
	@Async
	public void sendStatusDisableMail(String userName, String userEmail) {
		try {
			String body = MessageConstants.HTML_WITH_BODY_OPEN_TAG + MessageConstants.DIV_WITH_STYLE_OPEN_TAG
					+ MessageConstants.USER_MAIL_STATUS_DISABLE_H2 + MessageConstants.PARAGRAPH_WITH_DEAR_OPEN_TAG
					+ userName + MessageConstants.PARAGRAPH_WITH_COMMA_CLOSE_TAG
					+ MessageConstants.USER_MAIL_STATUS_DISABLE_P1 + MessageConstants.PARAGRAPH_OPEN_TAG
					+ MessageConstants.USER_STATUS_INACTIVE_STATEMENT1 + MessageConstants.PARAGRAPH_CLOSE_TAG
					+ MessageConstants.PARAGRAPH_OPEN_TAG + MessageConstants.ASSESSMENT_CANCELLED_BODY_STATEMENT3
					+ MessageConstants.PARAGRAPH_CLOSE_TAG + MessageConstants.USER_MAIL_STATUS_DISABLE_P2
					+ MessageConstants.PARAGRAPH_FOR_BEST_REGARDS_TAG + MessageConstants.USER_MAIL_STATUS_DISABLE_FOOTER
					+ MessageConstants.DIV_CLOSE_TAG + MessageConstants.BODY_CLOSE_TAG
					+ MessageConstants.HTML_CLOSE_TAG;

			sendMimeMail(userEmail, MessageConstants.USER_STATUS_INACTIVE, body);
		} catch (Exception e) {
			LOGGER.error("Error occurs while sending status disable email", e);
		}
	}

	@Override
	@Async
	public void sendUserRequestRejectionMail(String userName, String userEmail) {
		try {
			String body = MessageConstants.HTML_OPEN_TAG + MessageConstants.HEAD_OPEN_TAG
					+ MessageConstants.STYLE_OPEN_TAG + MessageConstants.USER_MAIL_REQUEST_REJECTION_BODY
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_CONTAINER
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_HEADER
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_HEADER1
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_CONTENT
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_CONTENT_P
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_FOOTER
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_FOOTER_P + MessageConstants.STYLE_CLOSE_TAG
					+ MessageConstants.HEAD_CLOSE_TAG + MessageConstants.BODY_OPEN
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_DIV1_OPEN
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_DIV2_OPEN
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_H1 + MessageConstants.DIV_CLOSE_TAG
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_DIV3_OPEN
					+ MessageConstants.PARAGRAPH_WITH_DEAR_OPEN_TAG + userName
					+ MessageConstants.PARAGRAPH_WITH_COMMA_CLOSE_TAG + MessageConstants.USER_MAIL_REQUEST_REJECTION_P2
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_P3 + MessageConstants.DIV_CLOSE_TAG
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_DIV4
					+ MessageConstants.USER_MAIL_REQUEST_REJECTION_P4 + MessageConstants.DIV_CLOSE_TAG
					+ MessageConstants.DIV_CLOSE_TAG + MessageConstants.BODY_CLOSE_TAG
					+ MessageConstants.HTML_CLOSE_TAG;

			sendMimeMail(userEmail, MessageConstants.USER_REQUEST_REJECTION_SUBJECT, body);

		} catch (Exception e) {
			LOGGER.error("Error occurs while sending request rejection mail", e);
		}
	}

	/**
	 * This "userRegistrationConfirmationEmail" method is used to when the user is
	 * successfully registered.
	 *
	 * @param userName
	 * @param userEmail
	 * @param userPassword
	 */
	@Override
	@Async
	public void userRegistermail(String userName, String userEmail, String userPassword) {
		try {
			String body = MessageConstants.HTML_OPEN_TAG + MessageConstants.HEAD_OPEN_TAG
					+ MessageConstants.STYLE_OPEN_TAG + MessageConstants.BODY_REMOVEUSER
					+ MessageConstants.CONTAINER_REMOVEUSER + MessageConstants.HEAD2_REMOVEUSER
					+ MessageConstants.PARAGRAPH1_REMOVEUSER + MessageConstants.USER_MAIL_REGISTER_STRONG
					+ MessageConstants.BUTTON_REMOVEUSER + MessageConstants.FOOTER_REMOVEUSER
					+ MessageConstants.STYLE_CLOSE_TAG + MessageConstants.HEAD_CLOSE_TAG + MessageConstants.BODY_OPEN
					+ MessageConstants.DIV1_OPEN_TAG + MessageConstants.USER_MAIL_REGISTER_H2_OPEN + userName
					+ MessageConstants.USER_MAIL_REGISTER_H2_CLOSE + MessageConstants.USER_MAIL_REGISTER_P1
					+ MessageConstants.USER_MAIL_REGISTER_P2_OPEN + userEmail + MessageConstants.PARAGRAPH_CLOSE_TAG
					+ MessageConstants.USER_MAIL_REGISTER_P3_OPEN + userPassword + MessageConstants.PARAGRAPH_CLOSE_TAG
					+ MessageConstants.USER_MAIL_REGISTER_P4 + MessageConstants.DIV2_OPEN_TAG
					+ MessageConstants.PARAGRAPH_FOR_BEST_REGARDS_TAG + MessageConstants.DIV_CLOSE_TAG
					+ MessageConstants.DIV_CLOSE_TAG + MessageConstants.BODY_CLOSE_TAG
					+ MessageConstants.HTML_CLOSE_TAG;
			sendMimeMail(userEmail, MessageConstants.USER_REGISTRATION_SUBJECT, body);
		} catch (Exception e) {
			LOGGER.error("Error while Sending the Registration email", e);
		}
	}

	@Override
	@Async
	public void deleteUserMail(String userName, String userEmail) {
		try {
			String body = MessageConstants.HTML_OPEN_TAG + MessageConstants.HEAD_OPEN_TAG
					+ MessageConstants.STYLE_OPEN_TAG + MessageConstants.USER_MAIL_DELETE_BODY
					+ MessageConstants.CONTAINER_REMOVEUSER + MessageConstants.HEAD2_REMOVEUSER
					+ MessageConstants.PARAGRAPH1_REMOVEUSER + MessageConstants.USER_MAIL_DELETE_HIGHLIGHT
					+ MessageConstants.FOOTER_REMOVEUSER + MessageConstants.STYLE_CLOSE_TAG
					+ MessageConstants.HEAD_CLOSE_TAG + MessageConstants.BODY_OPEN + MessageConstants.DIV1_OPEN_TAG
					+ MessageConstants.USER_MAIL_DELETE_H2 + MessageConstants.USER_MAIL_DELETE_P1_OPEN + userName
					+ MessageConstants.PARAGRAPH2_CLOSE_TAG_REMOVEUSER + MessageConstants.USER_MAIL_DELETE_P2_OPEN
					+ userEmail + MessageConstants.USER_MAIL_DELETE_P2_CLOSE + MessageConstants.USER_MAIL_DELETE_P3
					+ MessageConstants.USER_MAIL_DELETE_P4 + MessageConstants.DIV2_OPEN_TAG
					+ MessageConstants.PARAGRAPH_FOR_BEST_REGARDS_TAG + MessageConstants.DIV_CLOSE_TAG
					+ MessageConstants.DIV_CLOSE_TAG + MessageConstants.BODY_CLOSE_TAG
					+ MessageConstants.HTML_CLOSE_TAG;
			sendMimeMail(userEmail, MessageConstants.USER_DELETION_SUBJECT, body);
		} catch (Exception e) {
			LOGGER.error("Error while sending the deletion mail", e);
		}

	}

}
