package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author abishek.kumar 
 * @since 30/07/2024
 */

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BatchReportGenerationDto {
	
	private int assessmentId;
	private String assessmentName;
	private double averageMarks;
	

}
