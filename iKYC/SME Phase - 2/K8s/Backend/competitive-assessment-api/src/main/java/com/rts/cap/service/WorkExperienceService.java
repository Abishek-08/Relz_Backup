package com.rts.cap.service;

import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.WorkExperience;

public interface WorkExperienceService {
	
	List<WorkExperience> getWorkExperienceById(long userId) throws CapBusinessException;
	
}
