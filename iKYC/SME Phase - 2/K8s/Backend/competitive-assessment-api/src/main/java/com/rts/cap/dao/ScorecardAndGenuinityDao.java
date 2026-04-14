package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Genuinity;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.SkillAttempt;

public interface ScorecardAndGenuinityDao {
	
	public List<LearningAssessmentScoreCard> getScoreCardByUserId(long userId);
	
	public List<SkillAttempt> getLeaderBoard();

	float getLearningScoreCard(long userId);

	float getSkillScoreCard(long userId);
	
	List<Object[]> getLearningScoreCardMonthWise(long userId);
	
	List<Object[]> getSkillScoreCardMonthWise(long userId);Genuinity saveGenuinity(Genuinity genuinity);

	Genuinity findGenuinityScoreByUserIdScheduledId(int schedulingId, long userId);
	
	List<Integer> getListofSchedulingIdFormLearningScorecard(long userId) throws CapBusinessException;
	
	double getAverageGenuinity(long schedulingId);
	
	List<Integer> getListofSchedulingIdFromSkillAttempt(long userId) throws CapBusinessException;
	
	double getOverAllAverageOfTheUser(long userId) throws CapBusinessException;

	List<Double> getAverageGenuinity(List<Integer> schedulingIds);
	
	
	
}
