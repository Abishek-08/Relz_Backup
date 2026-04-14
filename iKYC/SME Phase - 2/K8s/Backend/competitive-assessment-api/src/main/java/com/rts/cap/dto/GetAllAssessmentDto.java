package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GetAllAssessmentDto {
	
	private int schedulingId;
	private String assessmentName;

}
