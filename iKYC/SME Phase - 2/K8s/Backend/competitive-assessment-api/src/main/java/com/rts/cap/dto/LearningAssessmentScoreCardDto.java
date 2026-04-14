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
public class LearningAssessmentScoreCardDto {
    
	private Object selectedAnswer;
	private int noOfQuestions;
	private int schedulingId;
	private String topicName;
	
	private List<LearningAssessmentAllQuestionsDto>questionContent;
	private int assessmentId;
	private int userId;
	private String type;

}
