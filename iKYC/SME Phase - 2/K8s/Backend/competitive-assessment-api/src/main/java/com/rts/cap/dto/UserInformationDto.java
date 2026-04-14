package com.rts.cap.dto;

import java.util.List;

import com.rts.cap.model.AcademicDetails;
import com.rts.cap.model.Certifications;
import com.rts.cap.model.SkillAndLinks;
import com.rts.cap.model.WorkExperience;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class UserInformationDto {
	
	List<WorkExperience> workExperience;
	
	List<SkillAndLinks> skillAndLinks;
	
	List<Certifications> certifications;
	
	List<AcademicDetails> academicDetails;

}
