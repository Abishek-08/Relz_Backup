package com.rts.cap.dto;

import java.util.List;

import com.rts.cap.model.MultipleChoiceQuestion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LearningAssessmentAllQuestionsDto {

	    private int questionId;
	    private String complexity;
	    private String content;
	    private String isActive;
	    private int mark;
	    private String questionType;
	    private String topicName;
	    private int subtopicId;
	    private String subtopicName;
	    private List<String> optionContents;

	    public LearningAssessmentAllQuestionsDto(MultipleChoiceQuestion question, List<String> optionContents,String topicName, String subtopicName,int subtopicId) {
	    	 this.questionId = question.getQuestionId();
	         this.complexity = question.getComplexity();
	         this.content = question.getContent();
	         this.isActive = question.getIsActive();
	         this.mark = question.getMark();
	         this.questionType = question.getQuestionType();
	         this.optionContents = optionContents;
	         this.topicName = topicName;
	         this.subtopicId = subtopicId;
	         this.subtopicName = subtopicName;
	    }
}
