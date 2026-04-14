package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author abishek.kumar
 * @since 29/07/2024
 */

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BatchUsersReportGenerationDto {
	
	private int userId;
	private String userEmail;
	private String userName;
	private double score;
	private String result;
	private String status;
	private String duration;
	private String assessmentDate;
	private String startTime;
	private String assessmentName;
	private int assessmentId;
	private int schedulingId;

}
