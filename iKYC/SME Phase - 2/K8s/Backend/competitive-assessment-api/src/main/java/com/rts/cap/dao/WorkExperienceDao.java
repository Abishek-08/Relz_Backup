package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.WorkExperience;

public interface WorkExperienceDao {
	
	List<WorkExperience> getWorkExperienceById(long userId) throws CapBusinessException;
	
}
