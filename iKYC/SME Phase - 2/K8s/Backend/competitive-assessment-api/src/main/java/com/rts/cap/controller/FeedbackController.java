package com.rts.cap.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.dto.DynamicFeedbackDto;
import com.rts.cap.dto.FeedbackDto;
import com.rts.cap.dto.UserFeedbackDto;
import com.rts.cap.model.Feedback;
import com.rts.cap.model.FeedbackDynamicAttribute;
import com.rts.cap.service.FeedbackService;

/**
 * Controller for handling feedback-related operations.
 * 
 * This controller provides an end point for submitting feedback related to assessments.
 * 
 * @author varshinee.manisekar
 * @since 13-07-2024
 */

@RestController
@RequestMapping(path = APIConstants.USER_BASE_URL)
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * Constructor for injecting the FeedbackService into this controller.
     * @param feedbackService the service to be used for feedback operations
     */
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    /**
     * Submits feedback for a specific assessment by a user.
     * 
     * This endpoint allows a user to submit feedback related to a particular assessment.
     * 
     * @param feedback the feedback details to be submitted
     * @param userId the ID of the user providing the feedback
     * @param assessmentId the ID of the assessment for which the feedback is provided
     * @return a ResponseEntity indicating the success or failure of the feedback submission
     */
    @PostMapping(APIConstants.ADD_FEEDBACK_URL)
    public ResponseEntity<Object> addFeedback(@RequestBody DynamicFeedbackDto dynamicFeedbackDto)
                                                 {
    	/**
         * Passes the provided feedback, user ID, and assessment ID to the service layer
         * to save the feedback to the database.
         * 
         * @param feedback The feedback details to be submitted.
         * @param userId The ID of the user providing the feedback.
         * @param assessmentId The ID of the assessment for which feedback is provided.
         * @return A ResponseEntity indicating the result of the feedback submission.
         */
        Feedback addedFeedback = feedbackService.addFeedback(dynamicFeedbackDto);
        
        /**
         * Checks if the feedback was successfully added.
         * If the addedFeedback is not null, it returns an HTTP 200 OK response indicating success.
         * Otherwise, it returns an HTTP 400 Bad Request response indicating failure.
         * 
         * @return A ResponseEntity with HTTP status 200 OK if feedback is added successfully,
         *         or HTTP status 400 Bad Request if feedback submission fails.
         */
        if (addedFeedback != null) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 09-08-2024
	 * Retrieves a list of FeedbackDto objects that contain feedback information along with scheduling details.
	 * @return a list of FeedbackDto objects, each containing assessment ID, assessment name, assessment date, and a list of feedbacks
	 */
	@GetMapping(path = APIConstants.GET_ALL_FEEDBACK_URL)
	public List<FeedbackDto> getAllFeedbackWithScheduling() {
		return feedbackService.getFeedbackWithScheduling();
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 09-08-2024
	 * Retrieves a list of Feedback objects associated with the given assessment ID.
	 * @param assessmentId the ID of the assessment for which to retrieve feedback
	 * @return a list of Feedback objects associated with the given assessment ID
	 */
	@GetMapping(path = APIConstants.GET_ALL_FEEDBACK_URL + "/{assessmentId}")
	public List<UserFeedbackDto> getAllFeedbackById(@PathVariable int assessmentId) {
		return feedbackService.getFeedbacksByAssessmentId(assessmentId);
	}
	
	
	@GetMapping(path = APIConstants.GET_FEEDBACK_ATTRIBUTE_URL + "/{assessmentId}")
	public ResponseEntity<List<FeedbackDynamicAttribute>> getFeedbackAttributeById(@PathVariable int assessmentId) {
		List<FeedbackDynamicAttribute> feedbackAttribute=feedbackService.getFeedbackAttributeById(assessmentId);
		if(!feedbackAttribute.isEmpty())
			return ResponseEntity.ok().body(feedbackAttribute);
		return ResponseEntity.badRequest().build();
	}

}
