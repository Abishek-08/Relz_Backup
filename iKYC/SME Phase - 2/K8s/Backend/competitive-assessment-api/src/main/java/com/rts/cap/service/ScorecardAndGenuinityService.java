package com.rts.cap.service;

import java.util.List;

import com.rts.cap.dto.UserGenuinityRecords;
import com.rts.cap.dto.UserOverAllScores;
import com.rts.cap.model.Genuinity;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.SkillAttempt;

public interface ScorecardAndGenuinityService {
	
	// AssessmentScoreCardService methods
	public List<LearningAssessmentScoreCard> getScoreCardByUserId(long userId);
	
	public List<SkillAttempt> getLeaderBoard();

	public UserOverAllScores getOverAllScoreByUserId(long userId);

    // GenuinityService methods
	Genuinity saveGenuinity(Genuinity genuinity);
	
		Genuinity getGenuinityScore(int scheduledId, long userId);
	
		UserGenuinityRecords getLearningAverageGenuinity(long userId);

}
