package com.rts.cap.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.CodingQuestion;
import com.rts.cap.service.CodingQuestionService;

import lombok.RequiredArgsConstructor;

/**
 * @author sanjay.subramani,dharshsun.s
 * @since 28-06-2024
 * @version 1.0
 */

/**
 * 
 * @author srinivasan.su
 * @since 22-08-2024
 */

@RestController
@RequestMapping(path = APIConstants.SKILL_BASE_URL)
@RequiredArgsConstructor
public class CodingQuestionController {

	private final CodingQuestionService codingQuestionService;

	/**
	 * 
	 * @param codingQuestion getting the POJO codingQuestion as string
	 * @param zipFile        as it is a file which contains
	 *                       codeSkeleton,testCaseXml,dummyCaseFile,testCaseFile
	 * @returns 200 status ok if the insertion of question or else returns the bad
	 *          request
	 */
	@PostMapping(path = APIConstants.ADD_CODING_QUESTION_URL)
	public ResponseEntity<HttpStatus> addCodingQuestion(@RequestParam String codingQuestion,
			@RequestParam String languages, @RequestParam MultipartFile[] files) throws CapBusinessException {

		if (codingQuestionService.uploadCodingQuestion(codingQuestion, languages, files)) {
			return ResponseEntity.status(HttpStatus.OK).build();
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	}

	/**
	 * method for update
	 * 
	 * @param codingQuestion getting the whole object of coding question
	 *                       using @RequestBody annotation and using it for updating
	 *                       question title and and question description
	 * @return 200 status ok if the update is success of question title and
	 *         description or else returns the bad request
	 */
	@PutMapping(path = APIConstants.UPDATE_CODING_QUESTION_URL)
	public ResponseEntity<HttpStatus> updateCodingQuestion(@RequestBody CodingQuestion codingQuestion) {
		if (codingQuestionService.updateCodingQuestion(codingQuestion))
			return ResponseEntity.status(HttpStatus.OK).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

	}

	/**
	 * Method for handling delete request Handles DELETE requests to delete a coding
	 * question identified by its questionId.
	 * 
	 * @param questionId The ID of the coding question to delete, provided as a
	 *                   request parameter.
	 * @return ResponseEntity with HTTP status 200 (OK) if the deletion is
	 *         successful, or HTTP status 400 (BAD_REQUEST) if the deletion fails.
	 */
	@DeleteMapping(path = APIConstants.DELETE_CODING_QUESTION_URL)
	public ResponseEntity<HttpStatus> deleteCodingQuestion(@RequestParam int questionId) {
		if (codingQuestionService.deleteCodingQuestion(questionId))
			return ResponseEntity.status(HttpStatus.OK).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

	}

	/**
	 * Method for handling get request for getting all coding questions Handles GET
	 * requests to return all coding question
	 * 
	 * @return codingquestion
	 */
	@GetMapping(path = APIConstants.GET_ALL_CODING_QUESTION_URL)
	public ResponseEntity<List<CodingQuestion>> getAllCodingQuestion() {
		return ResponseEntity.status(HttpStatus.OK).body(codingQuestionService.findAllCodingQuestion());
	}
	
	/**
	 * Method for handling get request for getting a specific coding question
	 * Handles GET requests to return a coding question identified by its questionId.
	 * @param questionId
	 * @return Map<String, String>
	 */
	@GetMapping(path = APIConstants.GET_CODING_QUESTION_URL)
	public ResponseEntity<CodingQuestion> getQuestionById(@PathVariable int questionId){
		return ResponseEntity.status(HttpStatus.OK).body(codingQuestionService.findCodingQuestionById(questionId));
	}

	/**
	 *This method for filter the coding questions by category
	 * @param categoryId 
	 * @return CodingQuestion
	 */
	@GetMapping(path = APIConstants.FILTER_BY_CATEGORY_URL)
	public ResponseEntity<List<CodingQuestion>> getQuestionFitlerByCategory(@PathVariable int categoryId){
		return ResponseEntity.status(HttpStatus.OK).body(codingQuestionService.filterByCategory(categoryId));
	}

	/**
	 * 
	 * This method filters coding questions by category, and level. 
	 * @param categoryId
	 * @param level
	 * @return The HTTP status of the response is OK (200) and the response body
	 *         contains the list of coding questions.
	 */
	@GetMapping(path = APIConstants.FILTER_BY_CATEGORY_AND_LEVEL_URL)
	public ResponseEntity<List<CodingQuestion>> getQuestionFitlerByLevel(@PathVariable int categoryId, @PathVariable String level){
		return ResponseEntity.status(HttpStatus.OK).body(codingQuestionService.filterByAll(categoryId, level));
	}

	/**
	 * This method filters coding questions by category, and level.
	 * @param categoryId
	 * @param level
	 * @return integer
	 */
	@GetMapping(path = APIConstants.COUNT_BY_ALL_URL)
	public ResponseEntity<Integer> getQuestionCountByAll(@PathVariable int categoryId,
			@PathVariable String level) {
		return ResponseEntity.ok(codingQuestionService.filterByAllCount(categoryId, level));
	}
	
	/**
	 * This method filters coding questions by category.
	 * @param categoryId
	 * @return the count based on category
	 */
	@GetMapping(path = APIConstants.COUNT_BY_CATEGORY_URL)
	public ResponseEntity<Integer> getQuestionCountByAll(@PathVariable int categoryId) {
		return ResponseEntity.ok(codingQuestionService.filterByCategoryCount(categoryId));
	}
}
