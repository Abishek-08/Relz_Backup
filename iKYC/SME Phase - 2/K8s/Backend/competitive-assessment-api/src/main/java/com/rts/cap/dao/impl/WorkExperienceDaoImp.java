package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.WorkExperienceDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.WorkExperience;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

@Repository
public class WorkExperienceDaoImp implements WorkExperienceDao {

	EntityManager entityManager;
	/**
	 * This is an Dependency injection for the EntityManager using constructor
	 * 
	 * @param entityManager
	 */
	public WorkExperienceDaoImp(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}
	
	/**
     * Retrieve a list of work experiences by user ID.
     * 
     * @param userId the ID of the user to retrieve work experiences for
     * @return a list of work experiences for the specified user
     * @throws CapBusinessException if an error occurs during the retrieval process
     */
	@Override
	public List<WorkExperience> getWorkExperienceById(long userId) throws CapBusinessException {
		try {
			TypedQuery<WorkExperience> query = entityManager.createQuery(
					"Select ad From WorkExperience ad where ad.user.userId = :userId ", WorkExperience.class);
			query.setParameter("userId", userId);
			return query.getResultList();
		} catch (Exception e) {
			throw new CapBusinessException("Details Not Found");
		}
	}
	
}
