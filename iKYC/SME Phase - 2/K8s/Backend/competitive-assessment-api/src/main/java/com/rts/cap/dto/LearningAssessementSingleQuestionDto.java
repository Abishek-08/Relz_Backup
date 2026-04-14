package com.rts.cap.dto;

import java.util.List;

import com.rts.cap.model.Answer;
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
public class LearningAssessementSingleQuestionDto { 
	
	private MultipleChoiceQuestion question;
	private List<Answer>answer;
	
}
