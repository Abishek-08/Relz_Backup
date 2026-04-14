package com.rts.cap.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@SpringBootTest
class SecurityQuestionAnswerControllerTest {

	@Autowired
	SecurityQuestionAnswerController securityQuestionAnswerController;
	
	/**
     * @author sundharraj.soundhar
     * @since 08-07-2024
     */
	@Test
	@DisplayName("get all the mapped questions without any questions for the user")
	@Disabled("disabled due testing purpose")
	void testGetMappedQuestionWithoutQuestion() {
		
		ResponseEntity<List<String>> response = securityQuestionAnswerController.getMappedQuestion("sundharrajs.m.s422@gmail.com");
		
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
	}
	
	/**
     * @author sundharraj.soundhar
     * @since 08-07-2024
     */
	@Test
	@DisplayName("get all the mapped questions for the user")
	@Disabled("disabled due testing purpose")
	void testGetMappedQuestion() {
	
		ResponseEntity<List<String>> response = securityQuestionAnswerController.getMappedQuestion("sundharrajs.m.s422@gmail.com");
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	
	/**
     * @author sundharraj.soundhar
     * @since 08-07-2024
     */
	@Test
	@DisplayName("get all the security questions")
	@Disabled("disabled due testing purpose")
	void getAllSecurityQuestions() {
		
		ResponseEntity<List<String>> response = securityQuestionAnswerController.getAllQuestions();
		System.out.println(response.getBody());
		assertThat(response.getBody()).isNull();

		
	}

}
