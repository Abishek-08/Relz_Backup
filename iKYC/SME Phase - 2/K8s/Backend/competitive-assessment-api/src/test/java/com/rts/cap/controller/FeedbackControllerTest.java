package com.rts.cap.controller;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.rts.cap.model.Feedback;

@SpringBootTest
public class FeedbackControllerTest {
    
    @Autowired
    private FeedbackController feedbackController;
    
    @Test
    @DisplayName("Test Add Feedback with Valid Data")
    @Disabled("Disabled due to test purpose")
    void testAddFeedback() {
        Feedback feedback = new Feedback();
        feedback.setFeedback("This is a test feedback");
        
        long userId = 1L;
        int assessmentId = 1;

        //ResponseEntity<Object> response = feedbackController.addFeedback(feedback, userId, assessmentId);

        //assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
