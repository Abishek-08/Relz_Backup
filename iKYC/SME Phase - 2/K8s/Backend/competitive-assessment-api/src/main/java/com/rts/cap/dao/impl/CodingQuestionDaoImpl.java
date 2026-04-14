package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.CodingQuestionDao;
import com.rts.cap.model.CodingQuestion;
import com.rts.cap.model.CodingQuestionFile;
import com.rts.cap.model.TestCase;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

/**
 * @author sanjay.subramani, dharshsun.s, prem.mariyappan, vinolisha.vijayakumar
 * @since 27-06-2024
 * @version 1.0
 * 
 */

/**
 * 
 * @author srinivasan.su
 * @since 22-08-2024
 */

@Repository
public class CodingQuestionDaoImpl implements CodingQuestionDao {

	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * This is a method to upload Coding Question into the Database Using hibernate
	 * ORM persistence class - Entity Manager
	 * 
	 * @param codingQuestion
	 * 
	 */
	@Override
	public void uploadCodingQuestion(CodingQuestion codingQuestion) {
		codingQuestion.getCodingQuestionFiles().stream().forEach(fileObject -> addCodingQuestionFile(fileObject));
		entityManager.persist(codingQuestion);
	}

	/**
	 * Method for finding all the coding questions.
	 * @return Codingquestion
	 */
	@Override
	public List<CodingQuestion> findAllCodingQuestion() {
		return entityManager.createQuery("from CodingQuestion", CodingQuestion.class).getResultList();
	}

	/**
	 * This is the method for updating the coding question of fields question title
	 * and question description alone Using hibernate ORM persistence class - Entity
	 * Manager Using persist for saving the update in database
	 */
	@Override
	public CodingQuestion updateCodingQuestion(CodingQuestion existingQuestion) {
		entityManager.merge(existingQuestion);
		return existingQuestion;
	}

	/**
	 * This is the method for finding the question by Id
	 * 
	 * @param questionId
	 * @return codingquestion corresponding to the questionId.
	 */
	@Override
	public CodingQuestion findById(int questionId) {
		return (CodingQuestion) entityManager.createQuery("from CodingQuestion where questionId = ?1")
				.setParameter(1, questionId).getSingleResult();
	}

	/**
	 * This is the method for deleting the coding question
	 * 
	 * @param codingQuestion
	 */
	@Override
	public void deleteCodingQuestion(CodingQuestion codingQuestion) {
		entityManager.remove(codingQuestion);
	}

	/**
	 * This is the method is filter of ViewAll Code Question using category,level
	 * 
	 * @param categoryId
	 * @param level
	 * @return List<CodingQuestion>
	 */
	@Override
	public List<CodingQuestion> filterByAll(int categoryId, String level) {
		return entityManager.createQuery("from CodingQuestion q where q.category.categoryId = ?1 AND q.level = ?2",
				CodingQuestion.class).setParameter(1, categoryId).setParameter(2, level).getResultList();
	}

	/**
	 * This is the method is filter of ViewAll Code Question by category only
	 * 
	 * @param categoryId
	 * @return List<CodingQuestion>
	 */
	@Override
	public List<CodingQuestion> filterByCategory(int categoryId) {
		return entityManager.createQuery("from CodingQuestion q where q.category.categoryId = ?1", CodingQuestion.class)
				.setParameter(1, categoryId).getResultList();
	}

	/**
	 * This method is to get the count based on category and level
	 * 
	 * @param categoryId
	 * @param level
	 */
	@Override
	public int filterByAllCount(int categoryId, String level) {
		return ((Long) entityManager
				.createQuery("SELECT COUNT(q) FROM CodingQuestion q WHERE q.category.categoryId = ?1 AND q.level = ?2")
				.setParameter(1, categoryId).setParameter(2, level).getSingleResult()).intValue();
	}

	/**
	 * This method is to get the count based on category
	 * 
	 * @param categoryId
	 */
	@Override
	public int filterByCategoryCount(int categoryId) {
		return ((Long) entityManager
				.createQuery("SELECT COUNT(q) from CodingQuestion q where q.category.categoryId = ? 1")
				.setParameter(1, categoryId).getSingleResult()).intValue();
	}

	/**
	 * This method is given the randomized questions which is selected from
	 * CodingQuestionRequest records
	 * 
	 * @param categoryId
	 * @param level
	 * @param count
	 * @return List<CodingQuestion>
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<CodingQuestion> findRandomQuestions(int categoryId, String level, int count) {
		String sql = "SELECT c FROM CodingQuestion c WHERE c.category.categoryId = :categoryId AND c.level = :level ORDER BY FUNCTION('RAND')";
		Query query = entityManager.createQuery(sql, CodingQuestion.class);
		query.setParameter("categoryId", categoryId);
		query.setParameter("level", level);
		query.setMaxResults(count);
		return query.getResultList();
	}

	/**
	 * This is a method to upload Test Case into the Database Using hibernate ORM
	 * persistence class - Entity Manager
	 * 
	 * @param testCase
	 */
	@Override
	public void uploadTestCase(TestCase testCase) {
		entityManager.persist(testCase);
	}

	/**
	 * Method for finding a list of test cases associated with a given coding
	 * question.
	 * 
	 * @param codingQuestion the coding question to search for
	 * @return a list of test cases related to the specified coding question
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<TestCase> findByCodingQuestionFile(CodingQuestionFile codingQuestionFile) {
		return entityManager.createQuery("from TestCase where codingQuestionFile =?1")
				.setParameter(1, codingQuestionFile).getResultList();
	}

	/**
	 * Method to delete test cases
	 */
	@Override
	public void deleteTestCase(TestCase testCase) {
		entityManager.remove(testCase);
	}

	/**
	 * Method to add codingQuestionfile record into database
	 * 
	 * @param codingQuestionFile
	 */
	@Override
	public void addCodingQuestionFile(CodingQuestionFile codingQuestionFile) {
		entityManager.persist(codingQuestionFile);
	}

	/**
	 * Method to remove codingQuestionfile record into database
	 * 
	 * @param codingQuestionFile
	 */
	@Override
	public void removeCodingQuestionFile(CodingQuestionFile codingQuestionFile) {
		entityManager.remove(codingQuestionFile);
	}

}
