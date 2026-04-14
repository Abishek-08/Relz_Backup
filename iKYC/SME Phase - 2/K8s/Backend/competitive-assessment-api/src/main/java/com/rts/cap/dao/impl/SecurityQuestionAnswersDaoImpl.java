package com.rts.cap.dao.impl;


import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.SecurityQuestionAnswersDao;
import com.rts.cap.model.SecurityQuestionAnswers;
import com.rts.cap.model.SecurityQuestions;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;


/**
 * @author sundharraj.soundhar
 * @since 05-07-2024
 * @version 2.0
 * 
 */

@Repository
@RequiredArgsConstructor
public class SecurityQuestionAnswersDaoImpl implements SecurityQuestionAnswersDao {

	private final EntityManager entityManager;
	
	private static final Logger LOGGER = LogManager.getLogger(SecurityQuestionAnswersDaoImpl.class);

	@Override
	public boolean addAnswer(SecurityQuestionAnswers answers) {

		try {
			entityManager.persist(answers);
			return MessageConstants.TRUE_VARIABLE;
		} catch (Exception e) {
			LOGGER.error("Failed to Add Answer", e);
			return MessageConstants.FALSE_VARIABLE;
		}
	}

	@Override
	public boolean removeAnswer(SecurityQuestionAnswers answers) {

		try {
			entityManager.remove(answers);
			return MessageConstants.TRUE_VARIABLE;
		} catch (Exception e) {
			return MessageConstants.FALSE_VARIABLE;
		}

	}

	@Override
	public List<SecurityQuestionAnswers> getAnswersByUserEmail(String userEmail) {
        return entityManager.createQuery(
                "SELECT sqa FROM SecurityQuestionAnswers sqa WHERE sqa.user.userEmail = :userEmail", SecurityQuestionAnswers.class)
            .setParameter("userEmail", userEmail)
            .getResultList();
    }


	@Override
	public boolean addSecurityQuestion(SecurityQuestions questions) {
		
		try {
			entityManager.persist(questions);
			return MessageConstants.TRUE_VARIABLE;
		} catch (Exception e) {
			LOGGER.error("Failed to Add Questions", e);
			return MessageConstants.FALSE_VARIABLE;
		}
		
		
	}

	@Override
	public boolean removeQuestion(SecurityQuestions questions) {
		
		try {
			entityManager.remove(questions);
			return MessageConstants.TRUE_VARIABLE;
		} catch (Exception e) {
			LOGGER.error("Failed to Remove Questions", e);
			return MessageConstants.FALSE_VARIABLE;
		}
	}

	@Override
	public List<String> getAllSecurityQuestion() {
		
		return entityManager.createQuery("select questions.question from SecurityQuestions questions", String.class).getResultList();
	}
}
