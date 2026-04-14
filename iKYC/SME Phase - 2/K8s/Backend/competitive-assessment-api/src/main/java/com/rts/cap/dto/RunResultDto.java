package com.rts.cap.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author sanjay.subramani 
 * @since 11-07-2024
 * @version 1.0
 * 
 */


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RunResultDto {

	private int testCount;
	
	private long testRunTime;
	
	private boolean wasSuccessful;
	
	private int failureCount;
	
	private List<String> failureList;
	
	private String exception;
	
}
