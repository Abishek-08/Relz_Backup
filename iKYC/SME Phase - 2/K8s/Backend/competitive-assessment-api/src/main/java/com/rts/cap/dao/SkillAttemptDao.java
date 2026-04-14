package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.SkillAttempt;
import com.rts.cap.model.SkillResult;
import com.rts.cap.model.TestResult;

/**
 * @author sanjay.subramani
 * @since 02-09-2024
 * @version 3.0
 */

/**
 * This is an Abstraction using interface for skill attempt DAO
 */
public interface SkillAttemptDao {

	public void createSkillAttempt(SkillAttempt skillAttempt);

	public SkillAttempt findById(int attemptId);

	public void updateSkillAttempt(SkillAttempt skillAttempt);

	public List<SkillAttempt> findByUserId(int userId);

	public List<SkillAttempt> findAllSkillAttempt();

	public void addTestResult(TestResult testResult);

	public void addSkillResult(SkillResult skillResult);

}
