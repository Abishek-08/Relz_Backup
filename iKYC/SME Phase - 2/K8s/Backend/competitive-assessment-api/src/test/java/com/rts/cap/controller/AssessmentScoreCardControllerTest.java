//package com.rts.cap.controller;
//
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//
//import java.util.List;
//
//import org.junit.Assert;
//import org.junit.jupiter.api.Disabled;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import com.rts.cap.model.LearningAssessmentScoreCard;
//import com.rts.cap.model.SkillAttempt;
//
//
//@SpringBootTest
//class AssessmentScoreCardControllerTest {
//
//	
//	@Autowired
//	AssessmentScoreCardController assessmentScoreCardController;
//	
//	
//	/**
//	 * @author sherin.david
//	 * @version v1.0
//	 * @since 05-08-2024
//	 */
//	
//	
//	@Test
//	@DisplayName("Test Get Score card by using userId")
//	@Disabled("Disabled due to testing purpose")
//	void testGetScoreCard() {
//		List<LearningAssessmentScoreCard> scoreCard = assessmentScoreCardController.getScoreCardByUserId(1);
//		Assert.assertNotNull(scoreCard);
//	}
//	
//	
//	/**
//	 * @author sherin.david
//	 * @version v1.0
//	 * @since 05-08-2024
//	 */
//	
//	@Test
//	@DisplayName("Test Get Leaderboard")
//	@Disabled("Disabled due to testing purpose")
//	void testLeaderboard() {
//		List<SkillAttempt> leaderboard = assessmentScoreCardController.getleaderBoard();
//		Assert.assertNotNull(leaderboard);
//	}
//	
//	
//	/**
//	 * @author sherin.david
//	 * @version v1.0
//	 * @since 05-08-2024
//	 */
//	
//	@Test
//	@DisplayName("Test Get OverAll Score  by using userId")
//	@Disabled("Disabled due to testing purpose")
//	void testGetOverallScore() {
//		assertNotNull(assessmentScoreCardController.getOverAllScore(1));
//	}
//	
//	
//}
