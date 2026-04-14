package com.rts.cap.dao;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.SkillAttempt;
import com.rts.cap.model.User;

/**
 * @author abishek.kumar
 * @since 28-06-2024
 * @version 1.0
 */

public interface UserDao {

	public User addUser(User user);

	public User findUserById(long userId);

	public boolean deleteUserById(int userId);

	public boolean validateUserByUserEmail(String userEmail);

	public List<User> findAllByUser();

	public User findUserByEmail(String email);

	public String updateProfile(User user);

	public ResponseEntity<Object> updateUser(User user);

	public boolean updateStatus(int userId, String status);

	public List<SkillAttempt> findSkillAttemptsByUserId(int userId);

	public List<LearningAssessmentScoreCard> findLearningScoreCardsByUserId(int userId);
	

	public List<Object[]> findUnBatchedUsers();
	
	
}
