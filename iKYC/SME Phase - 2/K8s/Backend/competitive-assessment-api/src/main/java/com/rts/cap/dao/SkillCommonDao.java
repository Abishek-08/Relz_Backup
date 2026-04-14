package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.Category;
import com.rts.cap.model.Language;

/**
 * This is Class for Category Data Accessing Object Interface
 */

public interface SkillCommonDao {
	
	
	public void addCategory(Category category);
	
	public Category findByCategoryId(int categoryId);
	
	public List<Category> findAllCategories();
	
	public void addLanguage(Language language);

	public List<Language> findAllLanguage();
	
	public Language findByLanguageId(int languageId);
	
	public Language findByLanguageName(String languageName);
}


