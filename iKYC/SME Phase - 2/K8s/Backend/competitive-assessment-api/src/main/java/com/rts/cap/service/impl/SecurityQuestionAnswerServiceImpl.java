package com.rts.cap.service.impl;

import com.rts.cap.service.SecurityQuestionAnswerService;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.SecurityQuestionAnswersDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.model.SecurityQuestionAnswers;
import com.rts.cap.model.SecurityQuestions;
import com.rts.cap.model.User;
import lombok.RequiredArgsConstructor;

/**
 * @author sundharraj.soundhar
 * @since 05-07-2024
 * @version 2.0
 * 
 */

@Service
@Transactional
@RequiredArgsConstructor
public class SecurityQuestionAnswerServiceImpl implements SecurityQuestionAnswerService {

	
	private final SecurityQuestionAnswersDao securityQuestionAnswersDao;

	private final UserDao userDao;

	private static final Logger LOGGER = LogManager.getLogger(SecurityQuestionAnswerServiceImpl.class);

	/**
	 * @author sundhar.soundhar
	 * @since 05-07-2024
	 * @version 1.0
	 * @param SecurityQuestionDto
	 * Maps security questions to a user with respective answers from the user.
	 * @return a list of mapped security question answers
	 * @purpose this method will map the security questions to the user with
	 *          respective answer from the user
	 */
	@Override
	public List<SecurityQuestionAnswers> mapSecurityQuestionToUser(String email,
			List<SecurityQuestionAnswers> securityQuestionAnswers) {
		List<SecurityQuestionAnswers> result = new ArrayList<>();
		try {
			User user = userDao.findUserByEmail(email);

			if (securityQuestionAnswersDao.getAnswersByUserEmail(email).size() > MessageConstants.ZERO_VARIABLE) {
				LOGGER.error("Security question answers already exist for user with email: {}", email);
			} else if (!securityQuestionAnswers.isEmpty()
					&& securityQuestionAnswers.size() >= MessageConstants.NO_OF_SECURITY_QUESTRIONS) {
				securityQuestionAnswers.forEach(answer -> {
					BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();
					answer.setAnswers(bCrypt.encode(answer.getAnswers()));
					answer.setUser(user);
					securityQuestionAnswersDao.addAnswer(answer);
					result.add(answer);
				});
			}
		} catch (Exception e) {
			LOGGER.error("An error occurred while mapping security question answers to user with email: {}", email, e);
		}
		return result;
	}

	/**
	 * @author sundhar.soundhar
	 * @since 05-07-2024
	 * @version 1.0
	 * @param email
	 * Retrieves the mapped security questions for a user.
	 * @return a list of mapped security questions for the user
	 */
	public List<String> getMappedQuestion(String email) {
		try {
			List<SecurityQuestionAnswers> securityQuestionAnswers = securityQuestionAnswersDao
					.getAnswersByUserEmail(email);
			return !securityQuestionAnswers.isEmpty()
					? securityQuestionAnswers.stream().map(SecurityQuestionAnswers::getQuestions).toList()
					: Collections.emptyList();
		} catch (Exception e) {
			LOGGER.error("An error occurred while getting mapped security questions for user with email: {}", email, e);
			return Collections.emptyList();
		}
	}

	/**
	 * @author sundhar.soundhar
	 * @since 05-07-2024
	 * @version 1.0
	 * Verifies the answers to security questions for a user.
	 * @param SecurityQuestionDto
	 * @param email the email address of the user
	 * @param securityQuestionAnswers the list of security question answers provided by the user
	 * @return true if all answers match, false otherwise
	 */
	public boolean verifySecurityQuestions(String email, List<SecurityQuestionAnswers> securityQuestionAnswers) {

		try {
			// Retrieve stored questions and answers for the given email
			List<SecurityQuestionAnswers> storedQuestionAnswers = securityQuestionAnswersDao
					.getAnswersByUserEmail(email);

			if (storedQuestionAnswers != null) {
				// Collect stored answers into a map for faster lookup
				Map<String, String> storedQuestions = storedQuestionAnswers.stream().collect(
						Collectors.toMap(SecurityQuestionAnswers::getQuestions, SecurityQuestionAnswers::getAnswers));

				// Check if the provided answers match the stored answers
				BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
				return securityQuestionAnswers.stream()
						.allMatch(providedAnswer -> storedQuestions.containsKey(providedAnswer.getQuestions())
								&& passwordEncoder.matches(providedAnswer.getAnswers(),
										storedQuestions.get(providedAnswer.getQuestions())));
			}
			return true;
		} catch (Exception e) {
			LOGGER.error("An error occurred while verifying security questions for user with email: {}", email, e);
			return false;
		}
	}

	
	/**
	 * Adds a new security question to the system.
	 * @param questions the security question to be added
	 * @return true if the question is added successfully, false otherwise
	 */
	@Override
	public boolean addSecurityQuestion(SecurityQuestions questions) {
		return securityQuestionAnswersDao.addSecurityQuestion(questions);
	}

	/**
	 * Retrieves a list of all security questions available in the system.
	 * @return a list of security questions
	 */
	@Override
	public List<String> getAllSecurityQuestion() {
		return securityQuestionAnswersDao.getAllSecurityQuestion();
	}
}
