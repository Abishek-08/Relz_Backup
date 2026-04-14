package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.dto.FeedbackDto;
/**
 * @author varshinee.manisekar
 * @since 14-07-2024
 * @version 1.0
 */
import com.rts.cap.model.Feedback;
import com.rts.cap.model.FeedbackDynamicAttribute;
import com.rts.cap.model.FeedbackValue;

public interface FeedbackDao {

	Feedback addFeedback(Feedback feedback);
	
	public List<FeedbackDto> getFeedbackWithScheduling();
	
	public List<Feedback> getFeedbackById(int assessmentId);
	
	public List<FeedbackDynamicAttribute>getFeedbackAttributeById(int assessmentId);
	
	public FeedbackDynamicAttribute getDynamicAttributeById(int attributeId);
	
	public boolean addOrUpdateFeedbackValue(FeedbackValue feedbackValue);
	
}
