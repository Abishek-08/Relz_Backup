package com.rts.cap.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.SkillCommonDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Category;
import com.rts.cap.model.Language;
import com.rts.cap.service.SkillCommonService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Transactional
@Service
@RequiredArgsConstructor
public class SkillCommonServiceImpl implements SkillCommonService {

	private final SkillCommonDao skillCommonDao;

	private static final Logger LOGGER = LogManager.getLogger(SkillCommonServiceImpl.class);

	/**
	 * Service for downloading Reference document Zip file
	 */
	public void downloadZipFile(HttpServletResponse response) {
		try {
			response.setContentType(MessageConstants.CONTENT_TYPE);
			response.setHeader(MessageConstants.CONTENT_DISPOSITION, MessageConstants.REFERENCE_DOCUMENT_PATH);
			response.setStatus(HttpServletResponse.SC_OK);
			LOGGER.info("Zip File Url:{}", MessageConstants.BASEDIRPATH + MessageConstants.DEMO_ZIP_FILE);
			response.getOutputStream().write(
					Files.readAllBytes(Paths.get(MessageConstants.BASEDIRPATH + MessageConstants.DEMO_ZIP_FILE)));
		} catch (IOException e) {
			LOGGER.error("Downloading Zip File error", e);
		}
	}

	/**
	 * Adds a new category.
	 * 
	 * @param category the category to add
	 * @return true if the category was added successfully, false otherwise
	 * @throws CapBusinessException if an error occurs while adding the category
	 */
	@Override
	public boolean addCategory(Category category) throws CapBusinessException {
		boolean flag = MessageConstants.FALSE_VARIABLE;
		try {
			skillCommonDao.addCategory(category);
			flag = MessageConstants.TRUE_VARIABLE;
		} catch (Exception e) {
			LOGGER.error("Error adding category: {}", category, e);
			throw new CapBusinessException(e.getMessage());
		}
		return flag;
	}

	/**
	 * Retrieves all categories.
	 * 
	 * @return a list of all categories
	 */
	@Override
	public List<Category> findAllCategories() {
		return skillCommonDao.findAllCategories();
	}

	/**
	 * Finds a category by its ID.
	 * 
	 * @param categoryId the ID of the category to find
	 * @return the category with the given ID, or null if no such category exists
	 */
	@Override
	public Category findById(int categoryId) {
		Category category = null;
		try {
			category = skillCommonDao.findByCategoryId(categoryId);
		} catch (Exception e) {
			LOGGER.error("Error finding category with ID {}: ", categoryId, e);
		}
		return category;
	}

	// Language Service Implementation
	/**
	 * This is the method which used add language business logic.
	 * 
	 * @param language if it throws exception then {@return false} else
	 *                 {@return true}
	 */
	@Override
	public boolean addLanguage(Language language) throws CapBusinessException {
		boolean flag = false;
		try {
			skillCommonDao.addLanguage(language);
			flag = true;
		} catch (Exception e) {
			LOGGER.error("Adding Language error", e);
			throw new CapBusinessException(e.getMessage());
		}
		return flag;
	}

	/**
	 * This is the method which used for retrieving all the language business logic.
	 * 
	 * @return List<Language>
	 */
	@Override
	public List<Language> findAllLanguage() {
		return skillCommonDao.findAllLanguage();
	}
}