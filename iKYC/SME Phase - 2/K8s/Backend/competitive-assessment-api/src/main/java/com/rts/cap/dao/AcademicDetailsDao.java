package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.AcademicDetails;

public interface AcademicDetailsDao {

	public AcademicDetails addAcademicDetails(AcademicDetails academicDetails);

	List<AcademicDetails> getAcademicDetailsById(long userId) throws CapBusinessException;

	AcademicDetails findAcademyDetailById(long academicId) throws CapBusinessException;

	public boolean deleteAcademicDetails(long academeicId);

}
