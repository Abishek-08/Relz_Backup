package com.rts.cap.service;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.rts.cap.dto.CodingQuestionDto;
import com.rts.cap.exception.CapBusinessException;

/**
 * @author srinivasan.su 
 * @since 15-07-2024
 */
/**
 * @author vinolisha.v
 * @since 24-07-2024
 */

@SpringBootTest
@TestMethodOrder(OrderAnnotation.class)
class SkillAttemptTest {

	@Autowired
	SkillAttemptService skillAttemptService;

	/**
	 *This test method is to map a question to a user based on scheduling 
	 */

	@Test
	@Order(1)
	@Disabled("Integration Purpose")
	void testMappingQuestion() {
	 assertNotEquals(0,skillAttemptService.mapCodingQuestion(1, 1));
	}

	/**
	 * This test method is to check get the mapped coding questions for a attempt.
	 * Based on the attempt Id. it will get the question details.
	 */

	@Test
	@Order(2)
	@Disabled("Integration Purpose")
	void testGetCodingQuestions() {
		List<CodingQuestionDto> listOfquestions = skillAttemptService.getCodingQuestions(1);
		assertNotNull(listOfquestions);
	}
	
	/**
	 * This test method is to fetch the skill attempt record based on attempTd
	 */

	@Test
	@Order(3)
	@Disabled("Integration Purpose")
	void testfetchAttemptDetailsById() {
		assertNotNull(skillAttemptService.findById(1)); 
	}
	
	@Test
	@Order(4)
	@Disabled("Integration Purpose")
	void testfetchScoreUserById() throws CapBusinessException {
		assertNotNull(skillAttemptService.findByUserId(1)); 
	}
}
