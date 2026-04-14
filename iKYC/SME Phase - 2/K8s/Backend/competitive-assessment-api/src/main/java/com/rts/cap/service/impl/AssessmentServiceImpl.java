package com.rts.cap.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rts.cap.dao.AssessmentDao;
import com.rts.cap.model.Assessment;
import com.rts.cap.model.Proctoring;
import com.rts.cap.service.AssessmentService;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class AssessmentServiceImpl implements AssessmentService {

	private AssessmentDao assessmentDao;

	/**
	 * This is the method which is used for adding a new assessment.
	 * 
	 * @param assessment the assessment to be added
	 * @return the added assessment
	 */
	@Override
	public Assessment addAssessment(Assessment assessment) {
		return assessmentDao.createAssessment(assessment);
	}

	/**
	 * This is the method which is used for finding all assessments.
	 * 
	 * @return List<Assessment>
	 */
	@Override
	public List<Assessment> findAllAssessment() {
		return assessmentDao.findAllAssessment();
	}

	/**
	 * This is the method which is used for checking if an assessment name exists.
	 * 
	 * @param assessmentName the name of the assessment to check
	 * @return true if the assessment name exists, false otherwise
	 */
	@Override
	public boolean findAssessmentName(String assessmentName) {
		return assessmentDao.findAssessmentName(assessmentName);
	}

	/**
	 * This is the method which is used for finding an assessment by its ID.
	 * 
	 * @param assessmentId the ID of the assessment to retrieve
	 * @return the assessment with the specified ID
	 */
	@Override
	public Assessment getAssessmentById(int assessmentId) {
		return assessmentDao.getAssessmentById(assessmentId);
	}
	
	 /**
     * Adds a new Proctoring entity using the ProctoringDao.
     * 
     * @param proctoring the Proctoring entity to be added
     * @return the added Proctoring entity
     */
	@Override
	public Proctoring addProctoring(Proctoring proctoring) {

		return assessmentDao.addProctoring(proctoring);
	}
	

    /**
     * Finds a Proctoring entity by its associated assessment ID.
     * 
     * @param assessmentId the ID of the associated assessment
     * @return the Proctoring entity associated with the given assessment ID
     */

	@Override
	public Proctoring proctoringFindByAssessmentId(int assessmentId) {

		return assessmentDao.proctoringFindByScheduledAssessmentId(assessmentId);

	}

}