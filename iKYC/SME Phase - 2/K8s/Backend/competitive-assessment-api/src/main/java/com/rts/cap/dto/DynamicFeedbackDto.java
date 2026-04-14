package com.rts.cap.dto;

import com.rts.cap.model.Feedback;

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
public class DynamicFeedbackDto {
 
	private Feedback feedback;
	private int assessmentId;
	private int userId;
	private Object attribute;

}
