package com.rts.cap.service;

 
import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Category;
import com.rts.cap.model.Language;

import jakarta.servlet.http.HttpServletResponse;

/**
 * @author  dharshsun.s ,prem.mariyappan
 * @since 02-09-2024
 * @version 2.0
 * 
 */

public interface SkillCommonService {
	
	public void downloadZipFile(HttpServletResponse response);
	
    public boolean addCategory(Category category) throws CapBusinessException;
	
	public Category findById(int categoryId);
	
	public List<Category> findAllCategories();
	
    public boolean addLanguage(Language language) throws CapBusinessException;
	
	public List<Language> findAllLanguage();
 

}
