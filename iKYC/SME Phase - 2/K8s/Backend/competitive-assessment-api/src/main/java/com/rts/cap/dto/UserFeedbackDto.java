package com.rts.cap.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserFeedbackDto {
	private int assessmentId;
	private String assessmentName;
	private String userName;
	private String userEmail;
	private double rating;
	private String feedback;
	private List<FeedbackAttributeDto> attributes;
}
