package com.rts.cap.service;

import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Language;

/**
 * @author sanjay.subramani , dharshsun.s
 * @since 28-06-2024
 * @version 1.0
 */

public interface LanguageService {

	public boolean addLanguage(Language language) throws CapBusinessException;
	
	public List<Language> findAllLanguage();
	
}
