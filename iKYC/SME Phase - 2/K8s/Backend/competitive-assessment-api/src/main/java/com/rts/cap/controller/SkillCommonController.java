package com.rts.cap.controller;

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
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Category;
import com.rts.cap.model.Language;
import com.rts.cap.service.SkillCommonService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * @author prem.mariyappan,dharshsun.s,vinolisha.v, sanjay.subramani
 * @since 02-09-2024
 * @version 2.0
 */

@RestController
@RequestMapping(path = APIConstants.SKILL_BASE_URL)
@RequiredArgsConstructor
public class SkillCommonController {

	private final SkillCommonService skillCommonService;

	/**
	 * Method for downloading reference document
	 * 
	 * @param response
	 * @return the httpstatus
	 */
	@GetMapping(path = APIConstants.GET_REFERENCE_DOCUMENT_URL)
	public ResponseEntity<HttpStatus> downloadZipFile(HttpServletResponse response) {
		skillCommonService.downloadZipFile(response);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	/**
	 * Method for adding category
	 * 
	 * @param category
	 * @return the status ok if the category is added or the bad request.
	 * @throws CapBusinessException
	 */
	@PostMapping(path = APIConstants.ADD_CATEGORY_URL)
	public ResponseEntity<HttpStatus> addCategory(@RequestBody Category category) throws CapBusinessException {
		if (skillCommonService.addCategory(category))
			return ResponseEntity.status(HttpStatus.OK).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	}

	/**
	 * Method for Getting All Categories List
	 * 
	 * @return all categories list of object
	 */
	@GetMapping(path = APIConstants.GET_ALL_CATEGORY_URL)
	public ResponseEntity<List<Category>> findAllCategories() {
		return ResponseEntity.status(HttpStatus.OK).body(skillCommonService.findAllCategories());
	}

	/**
	 * Method for getting category by categoryId
	 * 
	 * @param categoryId
	 * @return the specific category object
	 */
	@GetMapping(path = APIConstants.GET_CATEGORY_URL)
	public ResponseEntity<Category> findByCategoryid(@PathVariable int categoryId) {
		return ResponseEntity.status(HttpStatus.OK).body(skillCommonService.findById(categoryId));
	}

	/**
	 * Method for Add Language
	 * 
	 * @param language
	 * @return language is added or not in the status message.
	 * @throws CapBusinessException
	 */
	@PostMapping(path = APIConstants.ADD_LANGUAGE_URL)
	public ResponseEntity<HttpStatus> addLanguage(@RequestBody Language language) throws CapBusinessException {
		if (skillCommonService.addLanguage(language))
			return ResponseEntity.status(HttpStatus.OK).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	}

	/**
	 * Method for getting all language as list
	 * 
	 * @return all the languages in database if the status is ok.
	 */
	@GetMapping(path = APIConstants.GET_ALL_LANGUAGE_URL)
	public ResponseEntity<List<Language>> getAllLanguage() {
		return ResponseEntity.ok(skillCommonService.findAllLanguage());
	}
	
}
