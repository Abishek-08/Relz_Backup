package com.rts.cap.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.dto.AttemptResponseDto;
import com.rts.cap.dto.CodingQuestionDto;
import com.rts.cap.dto.RunResultDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.SkillAttempt;
import com.rts.cap.service.SkillAttemptService;

import lombok.RequiredArgsConstructor;

/**
 * @author dharshsun.s,vinolisha.vijayakumar, prem.mariyappan, sanjay.subramani,
 *         srinivasan.su , vignesh.velusamy
 * @since 02-09-2024
 * @version 3.0
 */

@RestController
@RequestMapping(path = APIConstants.SKILL_BASE_URL)
@RequiredArgsConstructor
public class SkillAttemptController {

	private final SkillAttemptService skillAttemptService;

	/**
	 * @param userId is a detail of the user Who attempting the assessment
	 * @param schedulingId is containing the request of the needed question details
	 * @returns the list of CodingQuestionDTO which contains only necessary fields
	 */
	@PostMapping(path = APIConstants.MAPPING_CODING_QUESTION_URL)
	public ResponseEntity<Integer> mapCodingQuestion(@PathVariable int userId, @PathVariable int schedulingId) {
		return ResponseEntity.ok(skillAttemptService.mapCodingQuestion(userId, schedulingId));
	}

	/**
	 * This is method which is return the List<CodingQuestionDTO> on demand of skill
	 * attempt id
	 * @param skillAttemptId
	 * @return List<CodingQuestionDTO>
	 */
	@GetMapping(path = APIConstants.GET_MAPPED_CODING_QUESTION_URL)
	public ResponseEntity<List<CodingQuestionDto>> getCodingQuestions(@PathVariable int attemptId) {
		return ResponseEntity.ok(skillAttemptService.getCodingQuestions(attemptId));
	}

	/**
	 * This is method which is return the RunResultDto on after the running the code
	 * @param questionId
	 * @param code
	 * @return RunResultDto
	 * @throws CapBusinessException
	 */
	@PostMapping(path = APIConstants.RUN_CODE_URL)
	public ResponseEntity<RunResultDto> executeCode(@RequestParam int questionId, @RequestParam String code,
			@RequestParam String language) throws CapBusinessException {
		return ResponseEntity.ok(skillAttemptService.executeCode(questionId, code, language));
	}

	/**
	 * This is method which is return HttpStatus on after the submitting the code
	 * @param attemptId
	 * @param codingResponseDtos
	 * @return ResponseEntity<HttpStatus>
	 * @throws CapBusinessException
	 */
	@PutMapping(path = APIConstants.SUBMIT_CODE_URL)
	public ResponseEntity<SkillAttempt> postSubmittedResponse(@RequestBody AttemptResponseDto attemptResponseDto)
			throws CapBusinessException {
		skillAttemptService.updateEvaluationStatus(attemptResponseDto.getAttemptId());
		if (skillAttemptService.postSubmittedResponse(attemptResponseDto))
			return ResponseEntity.status(HttpStatus.OK).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	}

	/**
	 * This is method for returning the skill attempt object
	 * @param attemptId
	 * @return
	 */
	@GetMapping(path = APIConstants.GET_SKILL_ATTEMPT_URL)
	public ResponseEntity<SkillAttempt> getSkillAttempt(@RequestParam int attemptId) {
		return ResponseEntity.ok(skillAttemptService.findById(attemptId));
	}

	/**
	 * This method is for taking the all the assessment attempted by a userId
	 * @param userId
	 * @return List<SkillAttempt> based on userId
	 * @throws CapBusinessException
	 */
	@GetMapping(path = APIConstants.GET_USER_SCORECARD)
	public ResponseEntity<List<SkillAttempt>> getUserScoreCard(@RequestParam int userId) throws CapBusinessException {
		return ResponseEntity.ok(skillAttemptService.findByUserId(userId));

	}

	/**
	 * This method is return the output for custom input given by the user.
	 * @param inputs
	 * @param code
	 * @return output
	 * @throws CapBusinessException 
	 */
	@PostMapping(path = APIConstants.CUSTOM_RUN_CODE_URL)
	public ResponseEntity<String> customExecuteCode(@RequestParam String inputs, @RequestParam String code, @RequestParam String language) throws CapBusinessException {
		return ResponseEntity.ok(skillAttemptService.customExecuteCode(inputs, code, language));
	}

	
}
