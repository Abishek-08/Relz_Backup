package com.rts.cap.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class LearningRandomizeQuestionDto {

	private int totalQuestionCount;	
	private int basicQuestionCount;	
	private int intermediateQuestionCount;	
	private int hardQuestionCount;	
	
	private List<Integer> subtopicIds;
	


}
