package com.rts.cap.service.impl;

import java.io.IOException;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.UserProfileDao;
import com.rts.cap.dto.UserInformationDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.AcademicDetails;
import com.rts.cap.model.Certifications;
import com.rts.cap.model.SkillAndLinks;
import com.rts.cap.model.User;
import com.rts.cap.model.WorkExperience;
import com.rts.cap.service.UserProfileService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

	private final UserProfileDao userProfileDao;

	private static final Logger LOGGER = LogManager.getLogger(WorkExperienceServiceImpl.class);

	@Override
	public WorkExperience addWorkExperience(WorkExperience workExperience, long userId) {
		User user = userProfileDao.findUserById(userId);
		workExperience.setUser(user);
		return userProfileDao.addWorkExperience(workExperience);
	}

	@Override
	public WorkExperience updateWorkExperience(WorkExperience workExperience, long experienceId) {
		try {
			WorkExperience existing = userProfileDao.findById(experienceId);

			if (existing != null) {
				existing.setCompanyName(workExperience.getCompanyName());
				existing.setDescription(workExperience.getDescription());
				existing.setFromYear(workExperience.getFromYear());
				existing.setToYear(workExperience.getToYear());
				existing.setLocation(workExperience.getLocation());
				existing.setRole(workExperience.getRole());
				return userProfileDao.addWorkExperience(existing);
			}

		} catch (Exception e) {
			LOGGER.error("Failed to update", e);
		}
		return workExperience;
	}

	@Override
	public boolean deleteUserInformation(String label, long infoId) {
		return userProfileDao.deleteDetails(label, infoId);
	}

	// Academic Details
	@Override
	public AcademicDetails addAcademicDetails(AcademicDetails academicDetails, int userId) {
		User user = userProfileDao.findUserById(userId);
		academicDetails.setUser(user);
		return userProfileDao.addAcademicDetails(academicDetails);
	}

	@Override
	public AcademicDetails updateAcademicDetails(AcademicDetails academicDetails, long academicId)
			throws CapBusinessException {
		try {
			AcademicDetails existingAcademicdetails = userProfileDao.findAcademyDetailById(academicId);

			existingAcademicdetails.setCgpa(academicDetails.getCgpa());
			existingAcademicdetails.setDegree(academicDetails.getDegree());
			existingAcademicdetails.setInstituteName(academicDetails.getInstituteName());
			existingAcademicdetails.setStream(academicDetails.getStream());
			existingAcademicdetails.setFromDuration(academicDetails.getFromDuration());
			existingAcademicdetails.setToDuration(academicDetails.getToDuration());

			return userProfileDao.addAcademicDetails(existingAcademicdetails);

		} catch (Exception e) {
			throw new CapBusinessException(MessageConstants.RECORD_NOT_FOUND);
		}
	}

	@Override
	public Certifications addCertificates(int userId, String issueDate, String verificationId, String institutionName,
			String certificateName, MultipartFile file) {

		Certifications certifications = null;
		try {
			User user = userProfileDao.findUserById(userId);
			certifications = new Certifications();
			certifications.setCertificate(file.getBytes());
			certifications.setUser(user);
			certifications.setInstitutionName(institutionName);
			certifications.setIssueDate(issueDate);
			certifications.setVerificationId(verificationId);
			certifications.setCertificateName(certificateName);

			userProfileDao.addCertificates(certifications);

		} catch (IOException e) {
			LOGGER.error("Failed to Add Certifiates", e);
		}
		return certifications;

	}

	/**
	 * @param skillAndLinks the skill and link to be added
	 * @return the added skill and link
	 */
	@Override
	public SkillAndLinks addSkillAndLink(SkillAndLinks skillAndLinks) {
		return userProfileDao.addSkillAndLink(skillAndLinks);
	}

	/**
	 * Retrieves a list of skills and links associated with a user.
	 * 
	 * @param userId the ID of the user
	 * @return a list of skills and links
	 * @throws CapBusinessException if an error occurs during the retrieval process
	 */
	@Override
	public List<SkillAndLinks> getSkillAndLinkById(long userId) throws CapBusinessException {
		return userProfileDao.getSkillAndLinkById(userId);
	}

	/**
	 * Updates a skill and its associated links in the database.
	 * 
	 * @param skillAndLinks the updated skill and links object
	 * @param skillsId      the ID of the skill to be updated
	 * @return the updated skill and links object if the update is successful,
	 *         otherwise the original object
	 */
	@Override
	public SkillAndLinks updateSkillAndLinks(SkillAndLinks skillAndLinks, long skillsId) {
		try {
			SkillAndLinks skill = userProfileDao.getSkillBySkillId(skillsId);
			if (skill != null) {
				skill.setGitHubLink(skillAndLinks.getGitHubLink());
				skill.setLinkedIn(skillAndLinks.getLinkedIn());
				skill.setPortfolio(skillAndLinks.getPortfolio());
				skill.setSkills(skillAndLinks.getSkills());
				return userProfileDao.addSkillAndLink(skill);
			}
		} catch (Exception e) {
			LOGGER.error("Update Skill and Links error", e);
		}
		return skillAndLinks;
	}

	@SuppressWarnings("unchecked")
	@Override
	public UserInformationDto getUserInformationDetails(long userId) throws CapBusinessException {

		return new UserInformationDto(
				(List<WorkExperience>) userProfileDao.getUserInformation("work", userId),
				(List<SkillAndLinks>) userProfileDao.getUserInformation("skill", userId),
				(List<Certifications>) userProfileDao.getUserInformation("certificates", userId),
				(List<AcademicDetails>) userProfileDao.getUserInformation("academics", userId));
		
	}
}
