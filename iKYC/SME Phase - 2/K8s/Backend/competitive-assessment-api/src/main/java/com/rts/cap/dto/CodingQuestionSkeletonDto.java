package com.rts.cap.dto;

import com.rts.cap.model.CodingQuestionFile;
import lombok.Getter;
import lombok.Setter;

/**
 * @author sanjay.subramani
 * @since 23-08-2024
 * @version 1.0
 */
@Setter
@Getter
public class CodingQuestionSkeletonDto {

	private String languageName;
	private String codeSkeleton;
	
	/**
	 * @param languageName
	 * @param codeSkeletion
	 */
	public CodingQuestionSkeletonDto(CodingQuestionFile codingQuestionFile) {
		super();
		this.languageName = codingQuestionFile.getLanguage().getLanguageName();
		this.codeSkeleton = codingQuestionFile.getCodeSkeleton();
	}	
}
