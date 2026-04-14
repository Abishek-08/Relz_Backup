package com.rts.cap.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.model.SecurityQuestionAnswers;
import com.rts.cap.model.SecurityQuestions;
import com.rts.cap.service.SecurityQuestionAnswerService;

/**
 * Controller for managing security question answers related to user accounts.
 * 
 * This controller provides endpoints for mapping security questions to users,
 * retrieving mapped security questions, and verifying answers to security
 * questions.
 * 
 * @author sundhar.soundhar
 * @since 05-07-2024
 * @version 2.0
 */
@RestController
@RequestMapping(path = APIConstants.SECURITY_BASE_URL)
public class SecurityQuestionAnswerController {

	private SecurityQuestionAnswerService securityQuestionAnswerService;

	public SecurityQuestionAnswerController(SecurityQuestionAnswerService securityAnswerService) {
		super();
		this.securityQuestionAnswerService = securityAnswerService;
	}

	/**
	 * @param email                   
	 * @param securityQuestionAnswers
	 * @return a ResponseEntity indicating the result of the operation
	 */
	
	@PostMapping("/add/{email}")
	public ResponseEntity<Object> mapSecurityQuestion(@PathVariable("email") String email,
			@RequestBody List<SecurityQuestionAnswers> securityQuestionAnswers) {
		try {
			List<SecurityQuestionAnswers> result = securityQuestionAnswerService.mapSecurityQuestionToUser(email,
					securityQuestionAnswers);
			if (result.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
			} else {
				return ResponseEntity.ok(result);
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * This endpoint returns a list of security questions associated with the user
	 * identified by the provided email.
	 * 
	 * @param email the email address of the user
	 * @return a ResponseEntity containing a list of mapped security questions
	 */
	@GetMapping(path = APIConstants.SECURITY_MAPPED_QUESTIONS)
	public ResponseEntity<List<String>> getMappedQuestion(@PathVariable("email") String email) {
		List<String> mappedQuestions = securityQuestionAnswerService.getMappedQuestion(email);
		return !mappedQuestions.isEmpty() ? ResponseEntity.ok(mappedQuestions)
				: ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
	}


	/**
	 * 
	 * @param email                   the email address of the user
	 * @param securityQuestionAnswers a list of security questions and answers to be
	 *                                verified
	 * @return a ResponseEntity containing a boolean indicating the result of the
	 *         verification
	 */
	@PostMapping(path = APIConstants.SECURITY_VERIFY_ANSWER + "/{email}")
	public ResponseEntity<Boolean> verifySecurityQuestions(@PathVariable("email") String email,
			@RequestBody List<SecurityQuestionAnswers> securityQuestionAnswers) {
		boolean result = securityQuestionAnswerService.verifySecurityQuestions(email, securityQuestionAnswers);
		return result ? ResponseEntity.ok().body(MessageConstants.TRUE_VARIABLE)
				: ResponseEntity.badRequest().body(MessageConstants.FALSE_VARIABLE);
	}

	/**
	 * @param securityQuestions the security question to be added
	 * @return a ResponseEntity indicating whether the addition was successful
	 */
	@PostMapping
	public ResponseEntity<Boolean> addQuestions(@RequestBody SecurityQuestions securityQuestions) {
		/**
		 * Passes the security question to the service layer to add it to the system.
		 * 
		 * @return a ResponseEntity indicating whether the addition of the security
		 *         question was successful.
		 */
		boolean isSuccess = securityQuestionAnswerService.addSecurityQuestion(securityQuestions);
		return isSuccess ? ResponseEntity.ok(MessageConstants.TRUE_VARIABLE)
				: ResponseEntity.ok(MessageConstants.FALSE_VARIABLE);
	}

	/**
	 * Retrieves all available security questions.
	 * 
	 * This endpoint returns a list of all security questions currently available in
	 * the system.
	 * 
	 * @return a ResponseEntity containing a list of all security questions
	 */
	@GetMapping
	public ResponseEntity<List<String>> getAllQuestions() {
		/**
		 * Passes the request to the service layer to retrieve all security questions.
		 * 
		 * @return a ResponseEntity containing a list of all security questions
		 *         available in the system.
		 */
		List<String> questions = securityQuestionAnswerService.getAllSecurityQuestion();
		return ResponseEntity.ok(questions);

	}

}
