package com.rts.cap.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.dto.UserInformationDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.AcademicDetails;
import com.rts.cap.model.Certifications;
import com.rts.cap.model.SkillAndLinks;
import com.rts.cap.model.WorkExperience;

public interface UserProfileService {

	// General Delete And Get
	public boolean deleteUserInformation(String label, long infoId);
	
	public UserInformationDto getUserInformationDetails(long userId) throws CapBusinessException;

	// Work Experiences
	public WorkExperience addWorkExperience(WorkExperience workExperience, long userId);

	public WorkExperience updateWorkExperience(WorkExperience workExperience, long userId);

	// Academics Details
	public AcademicDetails addAcademicDetails(AcademicDetails academicDetails, int userId);

	public AcademicDetails updateAcademicDetails(AcademicDetails academicDetails, long academicId)
			throws CapBusinessException;

	// Certifications
	public Certifications addCertificates(int userId, String issueDate, String verificationId, String institutionName,
			String certificateName, MultipartFile file);
	
	public SkillAndLinks addSkillAndLink(SkillAndLinks skillAndLinks);
	
	// Skill and Links
	List<SkillAndLinks> getSkillAndLinkById(long userId) throws CapBusinessException;
	
	SkillAndLinks updateSkillAndLinks(SkillAndLinks skillAndLinks, long skillsId);
}
