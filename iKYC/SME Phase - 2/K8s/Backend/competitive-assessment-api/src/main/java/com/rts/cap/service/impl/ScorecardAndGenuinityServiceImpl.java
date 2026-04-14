package com.rts.cap.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.AssessmentDao;
import com.rts.cap.dao.ScheduleAssessmentDao;
import com.rts.cap.dao.ScorecardAndGenuinityDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.dto.UserGenuinityRecords;
import com.rts.cap.dto.UserOverAllScores;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Genuinity;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.Proctoring;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.SkillAttempt;
import com.rts.cap.model.User;
import com.rts.cap.service.ScorecardAndGenuinityService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ScorecardAndGenuinityServiceImpl implements ScorecardAndGenuinityService {
	
	private final ScorecardAndGenuinityDao scorecardAndGenuinityDao;
    private final AssessmentDao assessmentDao;
    private final ScheduleAssessmentDao scheduleAssessmentDao;
    private final UserDao userDao;

	private static final Logger LOGGER = LogManager.getLogger(ScorecardAndGenuinityServiceImpl.class);

    /**
	 * Retrieves the score card details for a specific user.
	 * 
	 * @param userId The ID of the user whose score card is to be retrieved.
	 * @return A list of LearningAssessmentScoreCard objects associated with the
	 *         given user ID.
	 */
	@Override
	public List<LearningAssessmentScoreCard> getScoreCardByUserId(long userId) {
		return scorecardAndGenuinityDao.getScoreCardByUserId(userId);
	}

	/**
	 * Retrieves the leaderboard information.
	 * 
	 * @return A list of SkillAttempt objects representing the leaderboard.
	 */
	@Override
	public List<SkillAttempt> getLeaderBoard() {
		return scorecardAndGenuinityDao.getLeaderBoard();
	}

	/**
	 * Retrieves the overall scores for a specific user, including average scores
	 * and month-wise averages.
	 * 
	 * @param userId The ID of the user whose overall scores are to be retrieved.
	 * @return A UserOverAllScores object containing the user's overall scores and
	 *         averages.
	 */
	@Override
	public UserOverAllScores getOverAllScoreByUserId(long userId) {

		// Fetch average learning and skill assessment scores
		float learningAssessmentAverage = scorecardAndGenuinityDao.getLearningScoreCard(userId);
		float skillAssessmentAverage = scorecardAndGenuinityDao.getSkillScoreCard(userId);

		// Fetch month-wise averages for learning and skill assessments
		List<Object[]> learningMonthWiseAverage = scorecardAndGenuinityDao.getLearningScoreCardMonthWise(userId);
		List<Object[]> skillMonthWiseAverage = scorecardAndGenuinityDao.getSkillScoreCardMonthWise(userId);

		// Convert the fetched month-wise averages to a list of maps for easier
		// processing
		List<Map<String, Object>> learningMonthWiseAverageMaps = convertToMapList(learningMonthWiseAverage);
		List<Map<String, Object>> skillMonthWiseAverageMaps = convertToMapList(skillMonthWiseAverage);

		// Create and populate the UserOverAllScores object with the retrieved data
		UserOverAllScores overAllScores = new UserOverAllScores();
		overAllScores.setKnowledgeOverallAverage(learningAssessmentAverage);
		overAllScores.setSkillOverallAverage(skillAssessmentAverage);
		overAllScores.setMonthLearningAverage(learningMonthWiseAverageMaps);
		overAllScores.setMonthSkillAverage(skillMonthWiseAverageMaps);
		overAllScores.setUserId(userId);

		return overAllScores;
	}

	/**
	 * Converts a list of Object arrays (representing month-wise averages) into a
	 * list of maps.
	 * 
	 * @param objectArrayList A list of Object arrays where each array contains
	 *                        date, userId, and average values.
	 * @return A list of maps with keys "month", "userId", and "average"
	 *         representing month-wise averages.
	 */
	private List<Map<String, Object>> convertToMapList(List<Object[]> objectArrayList) {
		DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
		DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("MMM-yyyy");

		return objectArrayList.stream().map(entry -> {
			// Parse and format the date
			String dateStr = (String) entry[0];
			LocalDate date = LocalDate.parse(dateStr, inputFormatter);
			String formattedDate = date.format(outputFormatter);

			// Create a map with formatted date, userId, and average values
			return Map.of("month", formattedDate, "userId", entry[1], "average", entry[2]);
		}).toList();
	}
	
	 
	/**
	 * Saves the provided genuinity object, calculates its genuinity score, and
	 * returns a response entity. If any exception occurs during this process, it
	 * logs the stack trace and returns a bad request response.
	 * 
	 * @param genuinity The {@link Genuinity} object to be saved and processed.
	 * @return A {@link ResponseEntity} containing the saved {@link Genuinity}
	 *         object if successful, or a bad request status if an error occurs.
	 */
	@Override
	public Genuinity saveGenuinity(Genuinity genuinity) {
 
		if (Objects.nonNull(genuinity)) {
			try {
				Proctoring proctoring = assessmentDao.proctoringFindByScheduledAssessmentId(
						genuinity.getProctoring().getAssessment().getAssessmentId());
				ScheduleAssessment scheduleAssessment = scheduleAssessmentDao
						.findScheduleAssessmentById(genuinity.getScheduleAssessment().getSchedulingId());
				User user = userDao.findUserById(genuinity.getUser().getUserId());
 
				genuinity.setUser(user);
				genuinity.setScheduleAssessment(scheduleAssessment);
				genuinity.setProctoring(proctoring);
 
				// Calculate the genuinity score
				double genuinityScore = calculateGenuinityScore(genuinity.getCopyPaste(), genuinity.getTabSwitch(),
						proctoring.getViolationCount());
 
				genuinity.setGenuinity(genuinityScore);
 
				genuinity = scorecardAndGenuinityDao.saveGenuinity(genuinity);
 
			} catch (Exception e) {
				LOGGER.error("Error saving genuinity", e);
 
			}
		}
		return genuinity;
	}
 
	/**
	 * Calculates the genuinity score based on violation counts.
	 *
	 * @param copyPaste         Number of copy-paste violations
	 * @param tabSwitch         Number of tab switch violations
	 * @param maxViolationCount Maximum number of allowed violations
	 * @return The calculated genuinity score as a percentage
	 * @throws CapBusinessException
	 */
	private double calculateGenuinityScore(int copyPaste, int tabSwitch, int maxViolationCount)
			throws CapBusinessException {
		int totalViolationCount = copyPaste + tabSwitch;
 
		return Optional.of(maxViolationCount).filter(v -> v > 0).map(v -> {
			if (totalViolationCount > v)
				return 0.0;
			if (totalViolationCount == 0)
				return 100.0;
			return (Double.parseDouble(String.format("%.2f", (1 - (double) totalViolationCount / v) * 100)));
		}).orElseThrow(() -> new CapBusinessException("Maximum violation count must be greater than zero."));
	}
 
	/**
	 * 
	 * This method is for geting the individual score of genuinity
	 * 
	 * @param scheduledId  For the scheduled assessment
	 * @param userId       For which user genuinity score
	 * @return             Returns the users genuinity score
	 * 	 */
	@Override
	public Genuinity getGenuinityScore(int scheduledId, long userId) {
 
		Genuinity genuinity = null;
 
		try {
			genuinity = scorecardAndGenuinityDao.findGenuinityScoreByUserIdScheduledId(scheduledId, userId);
 
		} catch (Exception e) {
			LOGGER.error("error fetching genuinity record ",e);
		}
 
		return genuinity;
	}
	/**
	 * 
	 * This method is for finding the overall Genuinity score for both  assessment
	 * And also returns the individual genuinity score of the asessment of individual user
	 * 
	 * @param userId  For the specific user both assessment overll Genuinity Percentage need to find
	 */
	@Override
	public UserGenuinityRecords getLearningAverageGenuinity(long userId)  {
		UserGenuinityRecords genuinityDTO = null;
		try {
			List<Integer> listOfSchedulingIdsLearning = scorecardAndGenuinityDao.getListofSchedulingIdFormLearningScorecard(userId);
			List<Integer> listOfSchedulingIdsSkill = scorecardAndGenuinityDao.getListofSchedulingIdFromSkillAttempt(userId);
			
			List<Double> listOfGenuinityScoreLearning= scorecardAndGenuinityDao.getAverageGenuinity(listOfSchedulingIdsLearning);
			List<Double> listOfGenuinityScoreSkill = scorecardAndGenuinityDao.getAverageGenuinity(listOfSchedulingIdsSkill);
 
			double averageLearning = calculateAverage(listOfGenuinityScoreLearning);
			double averageSkill = calculateAverage(listOfGenuinityScoreSkill);
			double overallGenuinity = scorecardAndGenuinityDao.getOverAllAverageOfTheUser(userId);
 
			genuinityDTO = new UserGenuinityRecords();
			
			genuinityDTO.setKnowledge(Math.floor(averageLearning));
			genuinityDTO.setSkill(Math.floor(averageSkill));
			genuinityDTO.setOverallAverage(Math.floor(overallGenuinity));
			return genuinityDTO;
		} catch (CapBusinessException e) {
			LOGGER.error("Error Fecthing the Genuinity Records");
		}
		return genuinityDTO;
	}
 
	/**
	 *  This Method is used for calculating the total genuinity score by average the number of violations
	 * @param scores
	 * @return It returns overall avaerage genuity
	 */
	private double calculateAverage(List<Double> scores) {
		return scores.isEmpty() ? MessageConstants.INITIAL_COUNT_FOR_GENUNITY_CALCULATION
				: scores.stream().mapToDouble(Double::doubleValue).average().orElse(0);
	}
	
	

}
