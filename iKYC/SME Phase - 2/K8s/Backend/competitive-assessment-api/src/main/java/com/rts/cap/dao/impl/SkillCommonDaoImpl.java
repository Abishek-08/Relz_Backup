package com.rts.cap.dao.impl;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.rts.cap.dao.SkillCommonDao;
import com.rts.cap.model.Category;
import com.rts.cap.model.Language;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

/**
 * @author vignesh.velusamy,prem.mariyappan, sanjay.subramani
 * @since 02-09-2024
 * @version 2.0
 */

@Repository
@RequiredArgsConstructor
public class SkillCommonDaoImpl implements SkillCommonDao {

	private final EntityManager entityManager;

	/**
	 * Method for adding Category
	 * @param category
	 */
	@Override
	public void addCategory(Category category) {
		entityManager.persist(category);
	}

	/**
	 * Method for finding category based on id Returns a single result based on
	 * categoryId parameter
	 * @param categoryId
	 * @return Category
	 * Method for finding category based on id 
	 * Returns a single result based on categoryId parameter
	 * 	.2
	 */
	@Override
	public Category findByCategoryId(int categoryId) {
		return (Category) entityManager.createQuery("from Category where categoryId = ?1").setParameter(1, categoryId)
				.getSingleResult();
	}

	/**
	 * Method for finding all category
	 * @return List<Category>
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Category> findAllCategories() {
		return entityManager.createQuery("from Category").getResultList();
	}

	/**
	 * Method for adding a Language into database
	 * 
	 * @param language
	 */
	@Override
	public void addLanguage(Language language) {
		entityManager.persist(language);
	}

	/**
	 * Method for Finding all the coding language Returns from Language class as
	 * List
	 * 
	 * @return List<Language>
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Language> findAllLanguage() {
		return entityManager.createQuery("from Language").getResultList();
	}

	/**
	 * Method for finding a language based on language Id
	 * 
	 * @param languageId
	 * @return Language
	 */
	@Override
	public Language findByLanguageId(int languageId) {
		return (Language) entityManager.createQuery("from Language where languageId = ?1").setParameter(1, languageId)
				.getSingleResult();
	}

	/**
	 * Method for finding a language based on language name
	 * 
	 * @param languageName
	 * @return Language
	 */
	@Override
	public Language findByLanguageName(String languageName) {
		return (Language) entityManager.createQuery("from Language where languageName = ?1")
				.setParameter(1, languageName).getSingleResult();
	}
}
