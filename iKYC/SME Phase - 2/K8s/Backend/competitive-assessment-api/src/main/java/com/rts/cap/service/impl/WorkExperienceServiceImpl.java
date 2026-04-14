package com.rts.cap.service.impl;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.rts.cap.dao.UserDao;
import com.rts.cap.dao.WorkExperienceDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.WorkExperience;
import com.rts.cap.service.WorkExperienceService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class WorkExperienceServiceImpl implements WorkExperienceService {
	
	private final WorkExperienceDao workExperienceDao;
	
	private final UserDao userDao;
	
	private static final Logger LOGGER = LogManager.getLogger(WorkExperienceServiceImpl.class);

	 /**
     * Retrieve a work experience by its ID.
     * 
     * @param workExpereinceId the ID of the work experience to retrieve
     * @return a list of work experiences with the specified ID
     * @throws CapBusinessException if an error occurs during the retrieval process
     */
	@Override
	public List<WorkExperience> getWorkExperienceById(long workExpereinceId) throws CapBusinessException {
		return workExperienceDao.getWorkExperienceById(workExpereinceId);	
	}
	
	
}
