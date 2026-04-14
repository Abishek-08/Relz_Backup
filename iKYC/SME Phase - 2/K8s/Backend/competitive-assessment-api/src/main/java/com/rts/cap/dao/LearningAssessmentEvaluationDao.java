package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.Answer;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.User;

public interface LearningAssessmentEvaluationDao {

	// get Correct answer object based on Question Id
	public List<Answer> getCorrectAnswer(int questionId);

	public boolean addScoreforLearningAssessment(LearningAssessmentScoreCard learningassessmentScoreCard);

	public byte[] getUserLearningAssessmentReport(int scheduleAssessmentId, int userId);

	public List<ScheduleAssessment> getScoreCardScheduleAssessment();

	public List<User> getScoreCardUserList(int scheduleId);

	public List<LearningAssessmentScoreCard> getAllScoreCard();

	public int getLearningAssementScoreId(int scheduleAssessmentId, int userId);

	LearningAssessmentScoreCard getScoreCardDetails(int scheduleId, int userId);

	public boolean getCompletionCount(int schedulingId, int userId);

	public int getQuestionWholeMark(int questionId);

}
