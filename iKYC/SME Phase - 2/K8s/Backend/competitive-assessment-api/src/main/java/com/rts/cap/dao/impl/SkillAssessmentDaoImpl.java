package com.rts.cap.dao.impl;
 
/**
* @author sowmiya.ramu
* @since 04-07-2024
* @version 2.0
*/
 
import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.SkillAssessmentDao;
import com.rts.cap.model.CodingQuestionRequest;
import com.rts.cap.model.SkillAssessment;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
 
@Repository
public class SkillAssessmentDaoImpl implements SkillAssessmentDao {
 
	EntityManager entityManager;
	/**
	 * This is an Dependency injection for the EntityManager using constructor
	 * 
	 * @param entityManager
	 */
	public SkillAssessmentDaoImpl(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}
	/**
	 * Creates a new SkillAssessment in the database.
	 * 
	 * @param skillassessment the SkillAssessment to create
	 * @return the created SkillAssessment
	 */
	@Override
	public SkillAssessment createSkillAssessment(SkillAssessment skillassessment) {
		entityManager.persist(skillassessment);
		return skillassessment;
	}
	/**
	 * Finds a SkillAssessment by its ID.
	 * 
	 * @param skillAssessmentId the ID of the SkillAssessment to find
	 * @return the SkillAssessment with the given ID, or null if not found
	 */

 
	@Override
	public SkillAssessment findSkillAssessmentById(int skillAssessmentId) {
		return entityManager.find(SkillAssessment.class, skillAssessmentId);
	}
	/**
	 * Retrieve all SkillAssessments from the database.
	 * 
	 * @return a list of all SkillAssessments
	 */
	@SuppressWarnings("unchecked")
	public List<SkillAssessment> findAllSkillAssessment() {
		return entityManager.createQuery("from SkillAssessment").getResultList();
	}
	/**
	 * Retrieve a SkillAssessment by its associated Assessment ID.
	 * 
	 * @param assessmentId the ID of the Assessment to find the SkillAssessment
	 * @return the SkillAssessment associated with the given Assessment ID
	 */
	@Override
	public SkillAssessment getSkillAssessmentByAssessmentId(int assessmentId) {
		TypedQuery<SkillAssessment> query = entityManager.createQuery(
				"FROM SkillAssessment c WHERE c.assessment.assessmentId = :assessmentId", SkillAssessment.class);
		query.setParameter("assessmentId", assessmentId);
		return query.getSingleResult();
	}
	
	/**
	 * Create CodingQuestionRequest in the database.
	 * 
	 * @param coding question request the CodingQuestionRequest to create
	 * @return the created CodingQuestionRequest
	 */
	@Override
	public CodingQuestionRequest createRequest(CodingQuestionRequest codingquestionrequest) {
		entityManager.persist(codingquestionrequest);
		return codingquestionrequest;
	}
	/**
	 * Delete a CodingQuestionRequest from the database.
	 * 
	 * @param requestId the ID of the CodingQuestionRequest to delete
	 * @return true if the deletion is successful, false otherwise
	 */
	@Override
	public boolean deleteRequest(int requestId) {
		try {
			CodingQuestionRequest codingquestionrequest = entityManager.find(CodingQuestionRequest.class, requestId);
			entityManager.remove(codingquestionrequest);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	/**
	 * Find a CodingQuestionRequest by its request ID.
	 * 
	 * @param requestId the ID of the CodingQuestionRequest to find
	 * @return the CodingQuestionRequest with the given ID, or null if not found
	 */
	@Override
	public CodingQuestionRequest findRequestById(int requestId) {
		return entityManager.find(CodingQuestionRequest.class, requestId);

	}
	/**
	 * Retrieve all CodingQuestionRequest from the database.
	 * @return a list of all CodingQuestionRequests
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<CodingQuestionRequest> findAllRequest() {
		return entityManager.createQuery("from CodingQuestionRequest").getResultList();
	}
	/**
	 * Retrieve all CodingQuestionRequest for a given SkillAssessment ID.
	 * 
	 * @param skillAssessmentId the ID of the SkillAssessment to find requests for
	 * @return a list of CodingQuestionRequests for the given SkillAssessment ID
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<CodingQuestionRequest> getAllRequestBySkillAssessmentId(int skillAssessmentId) {
		Query query = entityManager.createQuery(
				"FROM CodingQuestionRequest c WHERE c.skillassessment.skillAssessmentId = :skillAssessmentId");
		query.setParameter("skillAssessmentId", skillAssessmentId);
		return query.getResultList();
	}
	/**
	 * Find existing CodingQuestionRequests for a given level, category ID, and
	 * SkillAssessment ID.
	 * 
	 * @param level             the level of the CodingQuestionRequest to find
	 * @param categoryId        the ID of the category to find requests
	 * @param skillAssessmentId the ID of the SkillAssessment to find requests 
	 * @return a list of existing CodingQuestionRequests for the given level,
	 *         category ID, and SkillAssessment ID
	 */
	@Override
	public List<CodingQuestionRequest> findExistingRequest(String level, int categoryId, int skillAssessmentId) {
		TypedQuery<CodingQuestionRequest> query = entityManager.createQuery(
				"SELECT c FROM CodingQuestionRequest c WHERE c.level = :level AND c.category.categoryId = :categoryId AND c.skillassessment.skillAssessmentId = :skillAssessmentId",
				CodingQuestionRequest.class);
		query.setParameter("level", level);
		query.setParameter("categoryId", categoryId);
		query.setParameter("skillAssessmentId", skillAssessmentId);
		return query.getResultList();

	}
	/**
	 * Checks if a CodingQuestionRequest exists for a given level, category ID, and
	 * SkillAssessment ID.
	 * 
	 * @param level             the level of the CodingQuestionRequest to check
	 * @param categoryId        the ID of the category to check requests
	 * @param skillAssessmentId the ID of the SkillAssessment to check requests
	 * @return true if a CodingQuestionRequest exists for the given level, category
	 *         ID, and SkillAssessment ID, false otherwise
	 */
	@Override
	public boolean checkExistenceId(String level, int categoryId, int skillAssessmentId) {
		TypedQuery<CodingQuestionRequest> query = entityManager.createQuery(
				"SELECT c FROM CodingQuestionRequest c WHERE  c.level = :level AND c.category.categoryId = :categoryId AND c.skillassessment.skillAssessmentId = :skillAssessmentId",
				CodingQuestionRequest.class);
		query.setParameter("level", level);
		query.setParameter("categoryId", categoryId);
		query.setParameter("skillAssessmentId", skillAssessmentId);
		List<CodingQuestionRequest> requests = query.getResultList();

		return !requests.isEmpty();
	}

 
}