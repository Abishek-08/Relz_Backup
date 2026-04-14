package com.rts.cap.dto;

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
public class FeedbackAttributeDto {
	private String attributeName;
	private String attributeType;
	private String attributeValue;
}
