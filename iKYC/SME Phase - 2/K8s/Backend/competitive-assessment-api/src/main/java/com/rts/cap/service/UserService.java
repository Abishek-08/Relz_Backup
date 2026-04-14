package com.rts.cap.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.dto.UserDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.SkillAttempt;
import com.rts.cap.model.User;

/**
 * @author abishek.kumar
 * @since 28-06-2024
 * @version 1.0
 */

public interface UserService {

	public int registerUser(UserDto userDto);

	public void saveUser(User user);

	public User findUserById(int userId);

	public boolean validateUserRegister(String userEmail);

	public List<User> findAllUser();

	public ResponseEntity<Object> updateUser(User updateUser);

	public ResponseEntity<Object> updateProfile(MultipartFile file, int userId) throws IOException;

	public HashMap<Integer, String> bulkUploadUser(MultipartFile file) throws IOException, CapBusinessException;

	public boolean updateStatus(int userId, String status);

	public List<SkillAttempt> getSkillAttemptsForUser(int userId);

	public List<LearningAssessmentScoreCard> getLearningScoreCardsByUserId(int userId);

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 06-08-2024
	 */

	public int getUserRequestCount();

	public boolean requestUserOperation(int userId);

	public void deleteUserById(int userId) throws CapBusinessException;

	public List<User> findUnBatchedUsers();

}
