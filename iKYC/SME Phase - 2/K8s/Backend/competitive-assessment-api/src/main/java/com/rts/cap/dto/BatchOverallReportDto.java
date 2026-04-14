package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author abishek.kumar
 * @since 30/07/2024
 */

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BatchOverallReportDto {
	
	private int batchId;
	private String batchName;
	private double overAllScore;

}
