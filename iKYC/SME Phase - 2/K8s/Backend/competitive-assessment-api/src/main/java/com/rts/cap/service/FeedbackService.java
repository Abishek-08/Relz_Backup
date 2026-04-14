package com.rts.cap.service;

import java.util.List;

import com.rts.cap.dto.DynamicFeedbackDto;
import com.rts.cap.dto.FeedbackDto;
import com.rts.cap.dto.UserFeedbackDto;
/**
 * @author varshinee.manisekar
 * @since 14-06-2024
 * @version 1.0
 */
import com.rts.cap.model.Feedback;
import com.rts.cap.model.FeedbackDynamicAttribute;

public interface FeedbackService {

	Feedback addFeedback(DynamicFeedbackDto dynamicFeedbackDto);

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 09-08-2024
	 */

	public List<FeedbackDto> getFeedbackWithScheduling();
	
	public List<UserFeedbackDto> getFeedbacksByAssessmentId(int assessmentId);
	
	public List <FeedbackDynamicAttribute>getFeedbackAttributeById(int assessmentId);


}
