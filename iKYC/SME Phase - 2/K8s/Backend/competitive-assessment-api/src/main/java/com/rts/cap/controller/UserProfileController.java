package com.rts.cap.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.dto.UserInformationDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.AcademicDetails;
import com.rts.cap.model.Certifications;
import com.rts.cap.model.SkillAndLinks;
import com.rts.cap.model.WorkExperience;
import com.rts.cap.service.UserProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = APIConstants.USER_BASE_URL)
@RequiredArgsConstructor
public class UserProfileController {

	private final UserProfileService userProfileService;
	
	// Work Experiences Block
	@PostMapping(APIConstants.ADD_WORK_EXPERIENCE_URL)
	public WorkExperience addWorkExperience(@RequestBody WorkExperience workExperience, @RequestParam long userId) {
		return userProfileService.addWorkExperience(workExperience, userId);
	}

	@PutMapping(APIConstants.UPDATE_WORK_EXPERIENCE_URL + "/{userId}")
	public WorkExperience updateWorkExperience(@RequestBody WorkExperience workExperience,
			@PathVariable("userId") long userId) {
		return userProfileService.updateWorkExperience(workExperience, userId);
	}
	
	// Academics Details
	@PostMapping(APIConstants.ADD_ACADEMIC_DETAILS_URL)
	public AcademicDetails addAcademicDetails(@RequestBody AcademicDetails academicDetails, @RequestParam int userId){
		 return userProfileService.addAcademicDetails(academicDetails, userId);
	}
	
	@PutMapping(APIConstants.UPDATE_ACADEMIC_DETAILS_URL+"/{academicId}")
	public AcademicDetails updateAcademicDetails(@RequestBody AcademicDetails academicDetails, @PathVariable("academicId") long academicId) throws CapBusinessException{
		 return userProfileService.updateAcademicDetails(academicDetails, academicId);
	}
	

	@PostMapping(path =APIConstants.CERTIFICATION_BASE_URL+ "/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Certifications> addCertificates(@PathVariable("userId") int userId,
			@RequestParam("issueDate") String issueDate, @RequestParam("verificationId") String verificationId,
			@RequestParam("institutionName") String institutionName, @RequestParam("file") MultipartFile file,
			@RequestParam("certificateName") String certificateName) {

		Certifications certifications = userProfileService.addCertificates(userId, issueDate, verificationId,
				institutionName, certificateName, file);
		if (certifications == null)
			return ResponseEntity.badRequest().build();
		return ResponseEntity.ok(certifications);
	}

	
	@PostMapping(APIConstants.ADD_SKILL_LINK_URL)
	public SkillAndLinks addSkillAndLink(@RequestBody SkillAndLinks skillAndLinks){
		return userProfileService.addSkillAndLink(skillAndLinks);
	}
	
	@PutMapping(APIConstants.UPDATE_SKILL_LINK_URL+"/{skillId}" )
	public SkillAndLinks updateSkillAndLink(@RequestBody SkillAndLinks skillAndLinks, @PathVariable("skillId") long skillId){
		return userProfileService.updateSkillAndLinks(skillAndLinks, skillId);
	}
	
	// Delete Operation
	@DeleteMapping("/{label}/{infoId}")
	public boolean deleteInformation(@PathVariable String label, @PathVariable long infoId) {
		return userProfileService.deleteUserInformation(label, infoId);
	}
	
	//Get Operations
	@GetMapping(APIConstants.USER_PROFILE_DETAILS)
	public UserInformationDto getUserInformations(@RequestParam("userId") long  userId) throws CapBusinessException {
		 return userProfileService.getUserInformationDetails(userId);
	}
	
}
