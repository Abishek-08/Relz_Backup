package com.rts.cap.service;

import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.AcademicDetails;

public interface AcademicDetailsService {
	
	public AcademicDetails addAcademicDetails(AcademicDetails academicDetails, int userId);
	
	public List<AcademicDetails> getAcademicDetailsById(long userId) throws CapBusinessException;
	
	public boolean deleteAcademicDetails(long academeicId);
	
	public AcademicDetails updateAcademicDetails(AcademicDetails academicDetails, long academicId) throws CapBusinessException;

}
