package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.AcademicDetailsDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.AcademicDetails;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class AcademicDetailsDaoImpl implements AcademicDetailsDao {

	EntityManager entityManager;

	/**
	 * This addAcademicDetails() method is to add the academic detail
	 * 
	 * @param academicDetails - to add the details
	 * @return academicDetails object
	 */
	@Override
	public AcademicDetails addAcademicDetails(AcademicDetails academicDetails) {

		entityManager.persist(academicDetails);

		return academicDetails;

	}

	/**
	 * This getAcademicDetailsById() - method is to filter the academic details by
	 * using the userId
	 * 
	 * @param userId - to fetch the academic details of that particular userId
	 * @return List of object of Academic detail
	 */

	@Override
	public List<AcademicDetails> getAcademicDetailsById(long userId) throws CapBusinessException {
		try {
			TypedQuery<AcademicDetails> query = entityManager.createQuery(
					"Select ad From AcademicDetails ad where ad.user.userId = :userId ", AcademicDetails.class);
			query.setParameter("userId", userId);
			return query.getResultList();
		} catch (Exception e) {
			throw new CapBusinessException(MessageConstants.DETAILS_NOT_FOUND);
		}
	}

	/**
	 * This findAcademicDetailById() - method is used to find the academic detail by
	 * using their ID
	 * 
	 * @param academicId - is used to fetch that particular id's academic detail
	 * @return that specific detail as an object
	 */

	@Override
	public AcademicDetails findAcademyDetailById(long academicId) throws CapBusinessException {

		try {
			return entityManager.find(AcademicDetails.class, academicId);
		} catch (Exception e) {
			throw new CapBusinessException(MessageConstants.RECORD_NOT_FOUND);
		}
	}

	/**
	 * This deleteAcademicDetails() method deletes the academic detail based on the
	 * id
	 * 
	 * @param academeicId - used to filter the academic details
	 * @return academic details of that specific id as an object
	 */

	@Override
	public boolean deleteAcademicDetails(long academeicId) {
		AcademicDetails details = entityManager.find(AcademicDetails.class, academeicId);
		if (details != null) {
			entityManager.remove(details);
			return true;
		} else {
			return false;
		}
	}

}
