package com.rts.cap.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.CodingQuestion;

/**
 * @author sanjay.subramani , dharshsun.s
 * @since 27-06-2024
 * @version 1.0
 * 
 */

/**
 * 
 * @author srinivasan.su
 * @since 22-08-2024
 */

public interface CodingQuestionService {

	public boolean uploadCodingQuestion(String codingQuestion, String languagues, MultipartFile[] files) throws CapBusinessException;

	public List<CodingQuestion> findAllCodingQuestion();

	public boolean updateCodingQuestion(CodingQuestion codingQuestion);

	public boolean deleteCodingQuestion(int questionId);

	public List<CodingQuestion> filterByAll(int categoryId, String level);

	public List<CodingQuestion> filterByCategory(int categoryId);

	public int filterByAllCount(int categoryId, String level);

	public int filterByCategoryCount(int categoryId);
	
	public CodingQuestion findCodingQuestionById(int questionId);

}
