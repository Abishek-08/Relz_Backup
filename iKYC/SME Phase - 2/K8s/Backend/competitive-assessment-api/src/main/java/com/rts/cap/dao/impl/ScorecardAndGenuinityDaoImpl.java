package com.rts.cap.dao.impl;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.ScorecardAndGenuinityDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Genuinity;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.SkillAttempt;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Repository
@Transactional
@RequiredArgsConstructor
public class ScorecardAndGenuinityDaoImpl implements ScorecardAndGenuinityDao {
	
	@PersistenceContext
    private EntityManager entityManager;

	@Override
	public List<LearningAssessmentScoreCard> getScoreCardByUserId(long userId) {
		TypedQuery<LearningAssessmentScoreCard> query = entityManager.createQuery(
				"From LearningAssessmentScoreCard where user.userId = :userId", LearningAssessmentScoreCard.class);
		query.setParameter(MessageConstants.USERID_VARIABLE, userId);
		return query.getResultList();
	}

	@Override
	public List<SkillAttempt> getLeaderBoard() {
		TypedQuery<SkillAttempt> query = entityManager.createQuery("SELECT sa FROM SkillAttempt sa WHERE sa.totalScore >= 50 AND sa.totalScore "
				+ "= ( SELECT MAX(sa2.totalScore) FROM SkillAttempt sa2 WHERE sa2.user.userId = sa.user.userId ) "
				+ "AND sa.id = ( SELECT MAX(sa3.id) FROM SkillAttempt sa3 WHERE sa3.user.userId = sa.user.userId "
				+ "AND sa3.totalScore = sa.totalScore ) ORDER BY sa.totalScore DESC, sa.id DESC", SkillAttempt.class);
		return query.getResultList();
	}

	@Override
	public float getLearningScoreCard(long userId) {
		
		Query query = entityManager.createQuery("SELECT AVG(score) FROM LearningAssessmentScoreCard WHERE user.userId = :userId");
	    query.setParameter(MessageConstants.USERID_VARIABLE, userId);
	    
	    Object result = query.getSingleResult();
	    if (result == null) {
	        return 0.0f;
	    }  
	    return ((Number) result).floatValue();
	}
	
	@Override
	public float getSkillScoreCard(long userId) {
		
		Query query = entityManager.createQuery("SELECT AVG(totalScore) FROM SkillAttempt WHERE user.userId = :userId");
		query.setParameter(MessageConstants.USERID_VARIABLE, userId);
		
		Object result = query.getSingleResult();
		if (result == null) {
			return 0.0f;
		}
		
		return ((Number) result).floatValue();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> getLearningScoreCardMonthWise(long userId) {
		
	    String sqlQuery = "WITH assessments_with_month AS ( "
	            + "SELECT sa.assessment_date, lasc.user_id, lasc.score, DATE_FORMAT(STR_TO_DATE(sa.assessment_date, '%m/%d/%Y'), '%Y-%m') AS month_year "
	            + "FROM learning_assessment_score_card_tbl lasc "
	            + "JOIN schedule_assessment_tbl sa ON lasc.schedule_assessment_id = sa.scheduling_id "
	            + "WHERE lasc.user_id = :user_id), "
	            + "monthly_avg AS ( "
	            + "SELECT month_year, AVG(score) AS average_score "
	            + "FROM assessments_with_month "
	            + "GROUP BY month_year "
	            + "HAVING COUNT(*) > 1), "
	            + "unique_assessments AS ( "
	            + "SELECT a.assessment_date, a.user_id, a.month_year, "
	            + "CASE WHEN m.average_score IS NOT NULL THEN m.average_score ELSE a.score END AS final_score, "
	            + "ROW_NUMBER() OVER (PARTITION BY a.month_year ORDER BY a.assessment_date) AS row_num "
	            + "FROM assessments_with_month a "
	            + "LEFT JOIN monthly_avg m ON a.month_year = m.month_year) "
	            + "SELECT assessment_date, user_id, final_score AS score "
	            + "FROM unique_assessments "
	            + "WHERE row_num = 1 "
	            + "ORDER BY assessment_date, user_id";

	    Query nativeQuery = entityManager.createNativeQuery(sqlQuery);
	    nativeQuery.setParameter("user_id", userId);
	    return nativeQuery.getResultList();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> getSkillScoreCardMonthWise(long userId) {
		String sqlQuery = "WITH assessments_with_month AS ( "
	            + "SELECT sa.assessment_date, lasc.user_id, lasc.total_score, DATE_FORMAT(STR_TO_DATE(sa.assessment_date, '%m/%d/%Y'), '%Y-%m') AS month_year "
	            + "FROM skill_attempt_tbl lasc "
	            + "JOIN schedule_assessment_tbl sa ON lasc.scheduling_id = sa.scheduling_id "
	            + "WHERE lasc.user_id = :user_id), "
	            + "monthly_avg AS ( "
	            + "SELECT month_year, AVG(total_score) AS average_score "
	            + "FROM assessments_with_month "
	            + "GROUP BY month_year "
	            + "HAVING COUNT(*) > 1), "
	            + "unique_assessments AS ( "
	            + "SELECT a.assessment_date, a.user_id, a.month_year, "
	            + "CASE WHEN m.average_score IS NOT NULL THEN m.average_score ELSE a.total_score END AS final_score, "
	            + "ROW_NUMBER() OVER (PARTITION BY a.month_year ORDER BY a.assessment_date) AS row_num "
	            + "FROM assessments_with_month a "
	            + "LEFT JOIN monthly_avg m ON a.month_year = m.month_year) "
	            + "SELECT assessment_date, user_id, final_score AS score "
	            + "FROM unique_assessments "
	            + "WHERE row_num = 1 "
	            + "ORDER BY assessment_date, user_id";

	    Query nativeQuery = entityManager.createNativeQuery(sqlQuery);
	    nativeQuery.setParameter("user_id", userId);
	    return nativeQuery.getResultList();
	}	
	
	
    // Methods related to Genuinity
    @Override
    public Genuinity saveGenuinity(Genuinity genuinity) {
        return entityManager.merge(genuinity);
    }

    @Override
    public Genuinity findGenuinityScoreByUserIdScheduledId(int schedulingId, long userId) {
        String query = "SELECT g FROM Genuinity g WHERE g.user.userId = :userId "
                + "AND g.scheduleAssessment.schedulingId = :schedulingId";
        return entityManager.createQuery(query, Genuinity.class).setParameter(MessageConstants.USERID_VARIABLE, userId)
                .setParameter("schedulingId", schedulingId).getSingleResult();
    }

    @Override
    public List<Integer> getListofSchedulingIdFormLearningScorecard(long userId) throws CapBusinessException {
        String jpqlQuery = "SELECT l.scheduleAssessment.schedulingId " + "FROM LearningAssessmentScoreCard l "
                + "WHERE l.user.userId = :userId";
        try {
            return entityManager.createQuery(jpqlQuery, Integer.class).setParameter(MessageConstants.USERID_VARIABLE, userId).getResultList();
        } catch (Exception e) {
            throw new CapBusinessException("Error retrieving scheduling IDs from learning scorecard");
        }
    }

    @Override
    public List<Integer> getListofSchedulingIdFromSkillAttempt(long userId) throws CapBusinessException {
        String jpqlQuery = "SELECT l.scheduleAssessment.schedulingId FROM SkillAttempt l "
                + "WHERE l.user.userId = :userId";
        try {
            return entityManager.createQuery(jpqlQuery, Integer.class).setParameter(MessageConstants.USERID_VARIABLE, userId).getResultList();
        } catch (Exception e) {
            throw new CapBusinessException("Error retrieving scheduling IDs from skill attempt");
        }
    }

    @Override
    public double getAverageGenuinity(long schedulingId) {
        String query = "SELECT CASE "
                + " WHEN EXISTS (SELECT 1 FROM Genuinity g WHERE g.scheduleAssessment.schedulingId = :schedulingId) "
                + "THEN (SELECT MAX(g.genuinity) FROM Genuinity g WHERE g.scheduleAssessment.schedulingId = :schedulingId) "
                + "ELSE -1 "
                + "END AS genuinity_score";
        return (Double) entityManager.createQuery(query).setParameter("schedulingId", schedulingId)
                .getSingleResult();
    }
    
    @Override
    public List<Double> getAverageGenuinity(List<Integer> schedulingIds) {
        if (schedulingIds == null || schedulingIds.isEmpty()) {
            return List.of();
        }

        String queryStr = "SELECT CASE " +
                "WHEN COUNT(g.genuinity) > 0 THEN MAX(g.genuinity) " +
                "ELSE -1 " +
                "END " +
                "FROM Genuinity g " +
                "WHERE g.scheduleAssessment.schedulingId IN :schedulingIds " +
                "GROUP BY g.scheduleAssessment.schedulingId";

        TypedQuery<Double> query = entityManager.createQuery(queryStr, Double.class);
        query.setParameter("schedulingIds", schedulingIds);

        List<Double> results = query.getResultList();

        // Ensure results are properly filtered, converting to Double if needed
        return results.stream()
                .map(result -> result)
                .filter(score -> score != -1)
                .toList();
    }

    @Override
    public double getOverAllAverageOfTheUser(long userId) throws CapBusinessException {
        try {
            String query = "SELECT AVG(g.genuinity) FROM Genuinity g WHERE g.user.userId = :userId";
            return (Double) entityManager.createQuery(query).setParameter(MessageConstants.USERID_VARIABLE, userId).getSingleResult();
        } catch (Exception e) {
            throw new CapBusinessException("User Id Not Found");
        }
    }
   

    }
