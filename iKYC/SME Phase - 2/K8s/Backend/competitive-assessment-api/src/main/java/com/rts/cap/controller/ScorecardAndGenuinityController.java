package com.rts.cap.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.dto.UserGenuinityRecords;
import com.rts.cap.dto.UserOverAllScores;
import com.rts.cap.model.Genuinity;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.SkillAttempt;
import com.rts.cap.service.ScorecardAndGenuinityService;

import lombok.RequiredArgsConstructor;

/**
 * Controller for managing scorecard and genuinity information related to user
 * assessments. This controller provides endpoints to retrieve knowledge-based
 * assessment scorecards, leaderboard details, overall user scores, and genuinity
 * scores.
 * 
 * @author sathiyan.sivarajan
 * @version 1.0
 * @since 18-07-2024
 */
@RestController
@RequestMapping(path = APIConstants.USER_BASE_URL)
@RequiredArgsConstructor
public class ScorecardAndGenuinityController {

       private final ScorecardAndGenuinityService scorecardAndGenuinityService;

    /**
     * @param userId the ID of the user whose scorecard details are to be retrieved
     * @return a list of LearningAssessmentScoreCard objects for the specified user
     */
    @GetMapping(APIConstants.GET_LEARNING_SCORECARD_URL)
    public List<LearningAssessmentScoreCard> getScoreCardByUserId(@PathVariable long userId) {
        return scorecardAndGenuinityService.getScoreCardByUserId(userId);
    }

    /**
     * Retrieves the leaderboard details.
     * 
     * @return a list of SkillAttempt objects representing the leaderboard scores
     */
    @GetMapping(APIConstants.GET_LEADERBOARD_URL)
    public List<SkillAttempt> getLeaderBoard() {
        return scorecardAndGenuinityService.getLeaderBoard();
    }

    /**
     * Retrieves the overall score for a specific user.
     * 
     * @param userId the ID of the user whose overall score information is to be
     *               retrieved
     * @return a UserOverAllScores object containing various score metrics for the
     *         specified user
     */
    @GetMapping(APIConstants.GET_OVERALL_SCORE_USER)
    public UserOverAllScores getOverAllScore(@PathVariable long userId) {
        return scorecardAndGenuinityService.getOverAllScoreByUserId(userId);
    }

    /**
     * Saves a genuinity score.
     * 
     * @param genuinity the genuinity score to be saved
     * @return a ResponseEntity containing the saved Genuinity object
     */
    @PostMapping(APIConstants.GENUINITY_BASE_URL + APIConstants.ADD_GENUINITY_SCORE)
    public ResponseEntity<Genuinity> saveGenuinity(@RequestBody Genuinity genuinity) {
        try {
            Genuinity savedGenuinity = scorecardAndGenuinityService.saveGenuinity(genuinity);
            return ResponseEntity.ok(savedGenuinity);
        } catch (Exception e) {
            // Log the exception if needed
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Retrieves a genuinity score for a specific user and scheduled ID.
     * 
     * @param scheduledId the ID of the scheduled genuinity assessment
     * @param userId      the ID of the user whose genuinity score is to be
     *                    retrieved
     * @return a ResponseEntity containing the Genuinity object for the specified
     *         scheduled ID and user ID
     */
    @GetMapping(APIConstants.GENUINITY_BASE_URL + APIConstants.GET_GENUINITY_SCORE + "/{scheduledId}/{userId}")
    public ResponseEntity<Genuinity> getGenuinityScore(@PathVariable int scheduledId, @PathVariable long userId) {
        Genuinity genuinity = scorecardAndGenuinityService.getGenuinityScore(scheduledId, userId);
        if (genuinity != null) {
            return ResponseEntity.ok(genuinity);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Retrieves the average genuinity score for a user based on learning records.
     * 
     * @param userId the ID of the user for whom the average genuinity score is to
     *               be retrieved
     * @return a UserGenuinityRecords object containing the average genuinity scores
     */
    @GetMapping(APIConstants.GENUINITY_BASE_URL + APIConstants.GET_LEARNING_GENUINITY_AVERAGE)
    public ResponseEntity<UserGenuinityRecords> getGenuinityAverageLearning(@PathVariable("userId") long userId) {
        UserGenuinityRecords genuinity = scorecardAndGenuinityService.getLearningAverageGenuinity(userId);
		if (Objects.isNull(genuinity)) {
		    return ResponseEntity.noContent().build();
		} else {
		    return ResponseEntity.ok(genuinity);
		}
    }
}
