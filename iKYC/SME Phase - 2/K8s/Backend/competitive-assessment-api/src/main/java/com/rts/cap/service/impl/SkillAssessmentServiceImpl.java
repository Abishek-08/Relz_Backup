package com.rts.cap.service.impl;
 
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rts.cap.dao.SkillAssessmentDao;
import com.rts.cap.model.CodingQuestionRequest;
import com.rts.cap.model.SkillAssessment;
import com.rts.cap.service.SkillAssessmentService;

import lombok.RequiredArgsConstructor;
 
@Service
@Transactional
@RequiredArgsConstructor
public class SkillAssessmentServiceImpl implements SkillAssessmentService {
 
	private final SkillAssessmentDao skillassessmentDao;
 
	/**
     * This is the method which is used for adding a skill assessment.
     * @param skillassessment the skill assessment to be added
     * @return the added skill assessment details
     */
	@Override
	public SkillAssessment addSkillAssessment(SkillAssessment skillassessment) {
		return skillassessmentDao.createSkillAssessment(skillassessment);
	}
	 /**
     * This is the method which is used for finding a skill assessment by its ID.
      * @param skillAssessmentId the ID of the skill assessment to retrieve
     * @return the skill assessment details
     */
	@Override
	public SkillAssessment findSkillAssessmentById(int skillAssessmentId) {
		return skillassessmentDao.findSkillAssessmentById(skillAssessmentId);
	}
	 /**
     * This is the method which is used for finding all skill assessments.
     * @return List<SkillAssessment>
     */
	@Override
	public List<SkillAssessment> findAllSkillAssessment() {
		return skillassessmentDao.findAllSkillAssessment();
	}
	 /**
     * This is the method which is used for finding a skill assessment by its assessment ID.
     * @param assessmentId the ID of the assessment to retrieve the skill assessment
     * @return the skill assessment details using assessment ID
     */
	@Override
	public SkillAssessment getSkillAssessmentByAssessmentId(int assessmentId) {
		return skillassessmentDao.getSkillAssessmentByAssessmentId(assessmentId);
	}
	/**
	 * This is the method which is used for adding a new coding question request.
	 * 
	 * It gets the count, category ID, skill assessment ID, and level from the
	 * coding question request. Then, it finds an existing request with the same
	 * level, category ID, and skill assessment ID. If an existing request is found,
	 * it increments the count of the existing request and updates it. If no
	 * existing request is found, it creates a new request.
	 * 
	 * @param codingquestionrequest
	 * @return the CodingQuestionRequest object
	 */
	@Override
	public CodingQuestionRequest addCodingQuestionRequest(CodingQuestionRequest codingQuestionRequest) {
		int count = codingQuestionRequest.getCount();
		int categoryId = codingQuestionRequest.getCategory().getCategoryId();
		int skillAssessmentId = codingQuestionRequest.getSkillassessment().getSkillAssessmentId();
		String level = codingQuestionRequest.getLevel();
		CodingQuestionRequest request = skillassessmentDao
				.findExistingRequest(level, categoryId, skillAssessmentId).stream().findFirst().map(existingRequest -> {
					existingRequest.setCount(existingRequest.getCount() + count);
					return existingRequest;
				}).orElse(codingQuestionRequest);

		return skillassessmentDao.createRequest(request);
	}
	
	/**
	 * This is the method which is used for finding a coding question request by its
	 * ID.
	 * 
	 * @param requestId
	 * @return CodingQuestionRequest
	 */
	@Override
	public CodingQuestionRequest findRequestById(int requestId) {
		return skillassessmentDao.findRequestById(requestId);
	}

	/**
	 * This is the method which is used for finding all coding question requests.
	 * 
	 * @return List<CodingQuestionRequest>
	 */
	@Override
	public List<CodingQuestionRequest> findAllRequest() {
		return skillassessmentDao.findAllRequest();
	}

	/**
	 * This is the method which is used for finding all coding question requests by
	 * skill assessment ID.
	 * 
	 * @param skillAssessmentId
	 * @return List<CodingQuestionRequest>
	 */
	@Override
	public List<CodingQuestionRequest> getAllRequestBySkillAssessmentId(int skillAssessmentId) {
		return skillassessmentDao.getAllRequestBySkillAssessmentId(skillAssessmentId);
	}

	/**
	 * This is the method which is used for deleting a coding question request.
	 * 
	 * @param requestId
	 * @return boolean
	 */
	@Override
	public boolean deleteRequest(int requestId) {
		return skillassessmentDao.deleteRequest(requestId);
	}

	/**
	 * This is the method which is used for finding existing coding question
	 * requests.
	 * 
	 * @param count
	 * @param level
	 * @param categoryId
	 * @param skillAssessmentId
	 * @return List<CodingQuestionRequest>
	 */
	@Override
	public List<CodingQuestionRequest> findExistingRequest(int count, String level, int categoryId,
			int skillAssessmentId) {
		return skillassessmentDao.findExistingRequest(level, categoryId, skillAssessmentId);
	}
 
}