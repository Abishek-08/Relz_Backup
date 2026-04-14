package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.AcademicDetails;
import com.rts.cap.model.Certifications;
import com.rts.cap.model.SkillAndLinks;
import com.rts.cap.model.User;
import com.rts.cap.model.WorkExperience;

public interface UserProfileDao {
	
	public User findUserById(long userId);
	
	Object getUserInformation(String label, long userId) throws CapBusinessException;
	
	// Work Experiences
	
	public WorkExperience addWorkExperience(WorkExperience workExperience);
	
	WorkExperience findById(long workexperienceId);
	
	public boolean deleteWorkExperience(long workExperienceId);

	// Academic details
	
	public AcademicDetails addAcademicDetails(AcademicDetails academicDetails);

	AcademicDetails findAcademyDetailById(long academicId) throws CapBusinessException;

	public boolean deleteDetails(String label, long infoId);

	
	public boolean addCertificates(Certifications certifications);
	
	List<Certifications> getAllCertifications(int userId);
	
	public Certifications findCertificateById(long certificateId);

	boolean removeCertificate(Certifications certifications);
	
    public SkillAndLinks addSkillAndLink(SkillAndLinks skillAndLinks);
	
	List<SkillAndLinks> getSkillAndLinkById(long userId) throws CapBusinessException;
	
	SkillAndLinks getSkillBySkillId(long skillId);
	
	public boolean deleteSkillAndLinks(long skillsId);

}
