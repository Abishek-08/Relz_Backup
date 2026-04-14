package com.rts.cap.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.AcademicDetailsDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.AcademicDetails;
import com.rts.cap.model.User;
import com.rts.cap.service.AcademicDetailsService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AcademicDetailsServiceImpl implements AcademicDetailsService {

	private final AcademicDetailsDao academicDetailsDao;

	private final UserDao userDao;

	/**
	 * This method - addAcademicDetails() is created to add the academic detail to
	 * particular user Here, finding the user for a specific id. And then adding the
	 * academic detail to that particular user
	 * 
	 * @param academicDetails - to create academic details, userId - to find whether
	 *                        the user is present or not
	 * @return an academicDetails object
	 */

	@Override
	public AcademicDetails addAcademicDetails(AcademicDetails academicDetails, int userId) {
		User user = userDao.findUserById(userId);
		academicDetails.setUser(user);

		return academicDetailsDao.addAcademicDetails(academicDetails);
	}

	/**
	 * This method - getAcademicDetailsById(), is to fetch the academic details of
	 * that particular user
	 * 
	 * @param userId - to get the user academic details
	 * @return List is academicDetails which is present in the user profile
	 */

	@Override
	public List<AcademicDetails> getAcademicDetailsById(long userId) throws CapBusinessException {
		return academicDetailsDao.getAcademicDetailsById(userId);
	}

	/**
	 * This method - deleteAcademicDetails(), is to delete the academic detail
	 * 
	 * @param academeicId - to delete that particular academic detail
	 */

	@Override
	public boolean deleteAcademicDetails(long academeicId) {
		return academicDetailsDao.deleteAcademicDetails(academeicId);
	}

	/**
	 * This method - updateAcademicDetails(), is to update the details.
	 * 
	 * @param academicDetails - to update the particular object, academicId - to
	 *                        find where the academic detail present or not
	 * @return {@link AcademicDetails}
	 * 
	 *         Finding that particular academic Id and changing the required fields.
	 *         And checking where the academic detail is present or not using try
	 *         catch block.
	 */

	@Override
	public AcademicDetails updateAcademicDetails(AcademicDetails academicDetails, long academicId)
			throws CapBusinessException {
		try {
			AcademicDetails existingAcademicdetails = academicDetailsDao.findAcademyDetailById(academicId);

			existingAcademicdetails.setCgpa(academicDetails.getCgpa());
			existingAcademicdetails.setDegree(academicDetails.getDegree());
			existingAcademicdetails.setInstituteName(academicDetails.getInstituteName());
			existingAcademicdetails.setStream(academicDetails.getStream());
			existingAcademicdetails.setFromDuration(academicDetails.getFromDuration());
			existingAcademicdetails.setToDuration(academicDetails.getToDuration());

			return academicDetailsDao.addAcademicDetails(existingAcademicdetails);

		} catch (Exception e) {
			throw new CapBusinessException(MessageConstants.RECORD_NOT_FOUND);
		}
	}
}
