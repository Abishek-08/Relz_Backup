package com.rts.cap.dto;

import java.util.List;
import com.rts.cap.model.CodingQuestion;
import lombok.Getter;
import lombok.Setter;

/**
 * @author sanjay.subramani
 * @since 23-08-2024
 * @version 1.0
 */
@Setter
@Getter
public class CodingQuestionDto {
	
	private int questionId;
	private String questionTitle;
	private String questionDescription;
	private String categoryName;
	private String level;
	private List<CodingQuestionSkeletonDto> codingQuestionSkeletonDtos;
	
	/**
	 * @param questionId
	 * @param questionTitle
	 * @param questionDescription
	 * @param categoryName
	 * @param level
	 */
	public CodingQuestionDto(CodingQuestion codingQuestion) {
		super();
		this.questionId = codingQuestion.getQuestionId();
		this.questionTitle = codingQuestion.getQuestionTitle();
		this.questionDescription = codingQuestion.getQuestionDescription();
		this.categoryName = codingQuestion.getCategory().getCategoryName();
		this.level = codingQuestion.getLevel();
		this.codingQuestionSkeletonDtos = codingQuestion.getCodingQuestionFiles().stream().map(CodingQuestionSkeletonDto::new).toList();
	}
}
