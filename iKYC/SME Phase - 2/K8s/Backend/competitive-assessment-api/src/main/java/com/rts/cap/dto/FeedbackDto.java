package com.rts.cap.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FeedbackDto {

	private int assessmentId;
	private String assessmentName;
	private String assessmentDate;
	private List<String> feedbacks;
}
