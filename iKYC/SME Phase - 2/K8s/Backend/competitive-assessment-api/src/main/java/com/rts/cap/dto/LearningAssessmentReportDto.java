package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LearningAssessmentReportDto {
	
	private String question;
	private String complexity;
	private int questionMark;
	private String questionType;
	private String topicName;
	private String subtopicName;
	private String optionGiven;
	private String selectedAnswers;
	private double evaluationMark;
	

}
