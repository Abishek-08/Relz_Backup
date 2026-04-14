package com.rts.cap.dto;

import java.util.List;

import com.rts.cap.model.SecurityQuestionAnswers;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * @author sundharraj.soundhar
 * @since 05-07-2024
 * @version 2.0
 * 
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SecurityQuestionDto {
	
	
	private int securityAnswersId;
	
	List<SecurityQuestionAnswers>  securityQuestionAnswers;

}
