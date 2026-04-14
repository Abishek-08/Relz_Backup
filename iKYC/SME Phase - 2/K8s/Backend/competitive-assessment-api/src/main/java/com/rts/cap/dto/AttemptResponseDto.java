package com.rts.cap.dto;

import java.util.List;

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
public class AttemptResponseDto {

	private int attemptId;
	private String completedTime;
	private String startTime;
	private List<CodingResponseDto> codingResponseDtos;
	
}
