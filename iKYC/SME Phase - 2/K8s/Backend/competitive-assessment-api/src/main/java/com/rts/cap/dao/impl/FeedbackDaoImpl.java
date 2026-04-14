package com.rts.cap.dao.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.FeedbackDao;
import com.rts.cap.dto.FeedbackDto;
import com.rts.cap.model.Feedback;
import com.rts.cap.model.FeedbackDynamicAttribute;
import com.rts.cap.model.FeedbackValue;

/**
 * @author varshinee.manisekar
 * @since 14-07-2024
 * @version 1.0
 */

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

@Repository
public class FeedbackDaoImpl implements FeedbackDao {
	
	private static final Logger LOGGER = LogManager.getLogger(FeedbackDaoImpl.class);

	private final EntityManager entityManager;

	public FeedbackDaoImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	public Feedback addFeedback(Feedback feedback) {
		entityManager.persist(feedback);
		return feedback;
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 09-08-2024
	 * Retrieves a list of FeedbackDto objects that contain feedback information along with scheduling details.
	 * This method uses a JPQL query to fetch the required data from the database, and then processes the results to create a list of FeedbackDto objects. 
	 * @return a list of FeedbackDto objects, each containing assessment ID, assessment name, assessment date, and a list of feedbacks
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<FeedbackDto> getFeedbackWithScheduling() {
		  List<Object[]> results = entityManager
	                .createQuery("SELECT a.assessmentId, a.assessmentName, sa.assessmentDate, f.feedback "
	                        + "FROM Feedback f " + "JOIN ScheduleAssessment sa ON f.assessment.id = sa.assessment.id "
	                        + "JOIN Assessment a ON a.assessmentId = sa.assessment.id")
	                .getResultList();

	        Map<Integer, FeedbackDto> assessmentMap = new LinkedHashMap<>();

	        for (Object[] result : results) {
	            int assessmentId = (int) result[0];
	            String assessmentName = (String) result[1];
	            String assessmentDate = (String) result[2];
	            String feedback = (String) result[3];

	            assessmentMap
	                    .computeIfAbsent(assessmentId,
	                            id -> new FeedbackDto(assessmentId, assessmentName, assessmentDate, new ArrayList<>()))
	                    .getFeedbacks().add(feedback);
	        }

	        return new ArrayList<>(assessmentMap.values());
	    }
	

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 09-08-2024
	 * Retrieves a list of Feedback objects associated with the given assessment ID.
	 * This method uses a JPQL query to fetch the required data from the database, and returns a list of Feedback objects.
	 * @param assessmentId the ID of the assessment for which to retrieve feedback
	 * @return a list of Feedback objects associated with the given assessment ID
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Feedback> getFeedbackById(int assessmentId) {
		Query query = entityManager
				.createQuery("from Feedback where assessment.assessmentId=:assessmentId", Feedback.class)
				.setParameter("assessmentId", assessmentId);
		return query.getResultList();

	}

	@Override
	public List<FeedbackDynamicAttribute> getFeedbackAttributeById(int assessmentId) {
		return entityManager.createQuery("from FeedbackDynamicAttribute where assessment.assessmentId=:assessmentId",FeedbackDynamicAttribute.class)
				.setParameter("assessmentId", assessmentId).getResultList();
	}

	@Override
	public FeedbackDynamicAttribute getDynamicAttributeById(int attributeId) {
		return entityManager.find(FeedbackDynamicAttribute.class,attributeId);
	}

	@Override
	public boolean addOrUpdateFeedbackValue(FeedbackValue feedbackValue) {
			try {
				if (feedbackValue.getFeedbackValueId() > 0) {
					entityManager.merge(feedbackValue);
					return MessageConstants.TRUE_VARIABLE;
				} else {
					entityManager.persist(feedbackValue);
					return MessageConstants.TRUE_VARIABLE;
				} 
			} catch (Exception e) {
			   LOGGER.error("Error While adding Feedback Value",e);
			}
		return MessageConstants.FALSE_VARIABLE;
	}


}
