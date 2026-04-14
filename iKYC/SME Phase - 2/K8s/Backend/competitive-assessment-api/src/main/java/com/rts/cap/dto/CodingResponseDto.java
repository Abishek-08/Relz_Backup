package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author sanjay.subramani 
 * @since 12-07-2024
 * @version 1.0
 * 
 */

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CodingResponseDto {

	private int questionId;
	private String code;
	private String language;
}
