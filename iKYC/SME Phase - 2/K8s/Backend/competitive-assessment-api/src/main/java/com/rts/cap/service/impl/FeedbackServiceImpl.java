package com.rts.cap.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rts.cap.dao.AssessmentDao;
import com.rts.cap.dao.FeedbackDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.dto.DynamicFeedbackDto;
import com.rts.cap.dto.FeedbackAttributeDto;
import com.rts.cap.dto.FeedbackDto;
import com.rts.cap.dto.UserFeedbackDto;
import com.rts.cap.model.Assessment;
import com.rts.cap.model.Feedback;
import com.rts.cap.model.FeedbackDynamicAttribute;
import com.rts.cap.model.FeedbackValue;
import com.rts.cap.model.User;
import com.rts.cap.service.FeedbackService;

import lombok.RequiredArgsConstructor;

/**
 * @author varshinee.manisekar
 * @since 14-07-2024
 * @version 1.0
 */

@Service
@Transactional
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

	private final FeedbackDao feedbackDao;
	private final UserDao userDao;
	private final AssessmentDao assessmentDao;
	private final ObjectMapper objectMapper;

	private static final Logger LOGGER = LogManager.getLogger(FeedbackServiceImpl.class);

	/**
	 * Add feedback method for getting feedback from user after assessment
	 * 
	 * @param userId,assessmentId
	 * @return feedback given by user
	 */
	@Override
	public Feedback addFeedback(DynamicFeedbackDto dynamicFeedbackDto) {
		LOGGER.info("method initiated");
		Feedback feedback = new Feedback();
		feedback.setRating(dynamicFeedbackDto.getFeedback().getRating());
		feedback.setFeedback(dynamicFeedbackDto.getFeedback().getFeedback());
		Object attribute = dynamicFeedbackDto.getAttribute();
		Map<Integer, Object> feedbackAttributes = objectMapper.convertValue(attribute,
				new TypeReference<Map<Integer, Object>>() {
				});
		List<FeedbackValue> feedbackValues = null;

		if (feedbackAttributes != null) {
			LOGGER.info("method calling .....");
			feedbackValues = feedbackAttributes.entrySet().stream().map(entry -> {
				FeedbackValue feedbackValue = new FeedbackValue();
				LOGGER.info(entry.getKey());
				FeedbackDynamicAttribute dynamicAttribute = feedbackDao.getDynamicAttributeById(entry.getKey());
				LOGGER.info(dynamicAttribute);
				feedbackValue.setFeedbackDynamicAttribute(dynamicAttribute);
				feedbackValue.setAttributeValue((String) entry.getValue());
				feedbackDao.addOrUpdateFeedbackValue(feedbackValue);
				return feedbackValue;
			}).toList();
		}
		System.err.println(feedbackValues);
		feedback.setFeedbackValue(feedbackValues);
		User user = userDao.findUserById(dynamicFeedbackDto.getUserId());
		feedback.setUser(user);
		LOGGER.info(dynamicFeedbackDto.getAssessmentId());
		Assessment assessment = assessmentDao.getAssessmentById(dynamicFeedbackDto.getAssessmentId());
		feedback.setAssessment(assessment);
		LOGGER.info(feedback);
		System.err.println(feedback);
		return feedbackDao.addFeedback(feedback);
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 09-08-2024 Retrieves a list of FeedbackDto objects that contain
	 *        feedback information along with scheduling details. This method
	 *        delegates to the FeedbackDao to fetch the required data from the
	 *        database.
	 * @return a list of FeedbackDto objects, each containing assessment ID,
	 *         assessment name, assessment date, and a list of feedbacks
	 */
	@Override
	public List<FeedbackDto> getFeedbackWithScheduling() {
		LOGGER.info(feedbackDao.getFeedbackWithScheduling());
		return feedbackDao.getFeedbackWithScheduling();
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 09-08-2024 Retrieves a list of Feedback objects associated with the
	 *        given assessment ID. This method delegates to the FeedbackDao to fetch
	 *        the required data from the database.
	 * @param assesmentId the ID of the assessment for which to retrieve feedback
	 * @return a list of Feedback objects associated with the given assessment ID
	 */
	@Override
	public List<UserFeedbackDto> getFeedbacksByAssessmentId(int assessmentId) {
		List<Feedback> feedbacks = feedbackDao.getFeedbackById(assessmentId);

		return feedbacks.stream().map(feedback -> {
			UserFeedbackDto dto = new UserFeedbackDto();
			dto.setAssessmentId(feedback.getAssessment().getAssessmentId());
			dto.setAssessmentName(feedback.getAssessment().getAssessmentName());
			dto.setUserName(feedback.getUser().getUserName());
			dto.setUserEmail(feedback.getUser().getUserEmail());
			dto.setRating(feedback.getRating());
			dto.setFeedback(feedback.getFeedback());

			// Map feedback values to the list of attributes
			List<FeedbackAttributeDto> attributes = feedback.getFeedbackValue().stream().map(fv -> {
				FeedbackAttributeDto attributeDto = new FeedbackAttributeDto();
				attributeDto.setAttributeName(fv.getFeedbackDynamicAttribute().getAttributeName());
				attributeDto.setAttributeType(fv.getFeedbackDynamicAttribute().getAttributeType());
				attributeDto.setAttributeValue(fv.getAttributeValue());
				return attributeDto;
			}).collect(Collectors.toList());

			dto.setAttributes(attributes);
			return dto;
		}).collect(Collectors.toList());
	}

	@Override
	public List<FeedbackDynamicAttribute> getFeedbackAttributeById(int assessmentId) {

		List<FeedbackDynamicAttribute> feedbackAttribute = null;
		try {
			return feedbackDao.getFeedbackAttributeById(assessmentId);

		} catch (Exception e) {
			LOGGER.error("Error while getting feedback attribute", e);
		}
		return feedbackAttribute;
	}

}
