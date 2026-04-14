package com.rts.cap.service;

/**
 * @author sowmiya.ramu
 * @since 04-07-2024
 * @version 2.0
 */

import java.util.List;

import com.rts.cap.model.Assessment;
import com.rts.cap.model.Proctoring;

public interface AssessmentService {

	public Assessment addAssessment(Assessment assessment);

	public List<Assessment> findAllAssessment();
	
	public boolean findAssessmentName(String assessmentName);
	
	public Assessment getAssessmentById(int assessmentId);
	
	public Proctoring addProctoring(Proctoring proctoring);

	public Proctoring proctoringFindByAssessmentId(int assessmentId);

}
