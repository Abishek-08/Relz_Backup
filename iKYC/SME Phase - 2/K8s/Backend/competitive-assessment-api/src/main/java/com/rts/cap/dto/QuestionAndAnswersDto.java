package com.rts.cap.dto;

import com.rts.cap.model.Answer;
import com.rts.cap.model.MultipleChoiceQuestion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionAndAnswersDto{
   
	private MultipleChoiceQuestion question;
    private Answer answer;
}