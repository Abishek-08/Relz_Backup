package com.rts.cap.dao.impl;
 
/**
* @author sowmiya.ramu
* @since 04-07-2024
* @version 2.0
*/
 
import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.AssessmentDao;
import com.rts.cap.model.Assessment;
import com.rts.cap.model.Proctoring;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
 
@Repository
public class AssessmentDaoImpl implements AssessmentDao {
	EntityManager entityManager;
	/**
	 * This is an Dependency injection for the EntityManager using constructor
	 * 
	 * @param entityManager
	 */
	public AssessmentDaoImpl(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}
	/**
	 * Creates a new Assessment in the database.
	 * 
	 * @param assessment the Assessment to create
	 * @return the created Assessment
	 */
	@Override
	public Assessment createAssessment(Assessment assessment) {
 
		entityManager.persist(assessment);
		return assessment;
	}
	/**
	 * Retrieve all Assessments from the database.
	 * 
	 * @return a list of all Assessments
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Assessment> findAllAssessment() {
		return entityManager.createQuery("from Assessment").getResultList();
	}

	/**
	 * @author ranjitha.rajaram
	 * @since 04-07-2024
	 * @version 2.0
	 * @param assessmentName to find whether the assessment name is present in the
	 *                       database.
	 * @return HTTP message message with status code 200 if assessment name is found
	 */
	@Override
	public boolean findAssessmentName(String assessmentName) {
		TypedQuery<Assessment> query = entityManager
				.createQuery("SELECT b FROM Assessment b WHERE b.assessmentName = :assessmentName", Assessment.class);
		query.setParameter("assessmentName", assessmentName);
		List<Assessment> assessments = query.getResultList();
 
		return !assessments.isEmpty();
	}
	/**
	 * @author varshinee.manisekar
	 * @since 12-07-2024
	 * @version 1.0
	 * @param assessmentId The ID of the assessment to retrieve.
	 * @return The Assessment entity corresponding to the given ID.
	 */
	@Override
	public Assessment getAssessmentById(int assessmentId) {
		return entityManager.find(Assessment.class, assessmentId);
	}
	
	/**
     * Adds a new Proctoring entity to the database.
     * 
     * @param proctoring the Proctoring entity to be added
     * @return the added Proctoring entity
     */
	@Override
	public Proctoring addProctoring(Proctoring proctoring) {
		entityManager.persist(proctoring);
		return proctoring;
	}
	
	/**
     * Finds a Proctoring entity by its associated assessment ID.
     * 
     * @param assessmentId the ID of the associated assessment
     * @return the Proctoring entity associated with the given assessment ID
     * @throws jakarta.persistence.NoResultException if no Proctoring entity is found
     */
	@Override
	public Proctoring proctoringFindByScheduledAssessmentId(int assessmentId) {
		return (Proctoring) entityManager
				.createQuery("Select p from Proctoring p where p.assessment.assessmentId = :assessmentId")
				.setParameter("assessmentId", assessmentId).getSingleResult();

	}
 
}