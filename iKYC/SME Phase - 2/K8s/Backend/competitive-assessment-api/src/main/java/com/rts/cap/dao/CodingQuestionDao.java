package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.CodingQuestion;
import com.rts.cap.model.CodingQuestionFile;
import com.rts.cap.model.TestCase;

/**
 * @author sanjay.subramani , dharshsun.s
 * @since 27-06-2024
 * @version 1.0
 */

/**
 * 
 * @author srinivasan.su
 * @since 22-08-2024
 */

/**
 * This is Class for CodingQuestion Data Accessing Object Interface
 */
public interface CodingQuestionDao {

	public void uploadCodingQuestion(CodingQuestion codingQuestion);

	public List<CodingQuestion> findAllCodingQuestion();

	public CodingQuestion updateCodingQuestion(CodingQuestion existingQuestion);

	public CodingQuestion findById(int questionId);

	public void deleteCodingQuestion(CodingQuestion codingQuestion);

	public List<CodingQuestion> filterByAll(int categoryId, String level);

	public List<CodingQuestion> filterByCategory(int categoryId);

	public int filterByAllCount(int categoryId, String level);

	public int filterByCategoryCount(int categoryId);

	public List<CodingQuestion> findRandomQuestions(int categoryId, String level, int count);

	public void uploadTestCase(TestCase testCase);

	public List<TestCase> findByCodingQuestionFile(CodingQuestionFile codingQuestionFile);

	public void deleteTestCase(TestCase testCase);

	public void addCodingQuestionFile(CodingQuestionFile codingQuestionFile);

	public void removeCodingQuestionFile(CodingQuestionFile codingQuestionFile);

}
