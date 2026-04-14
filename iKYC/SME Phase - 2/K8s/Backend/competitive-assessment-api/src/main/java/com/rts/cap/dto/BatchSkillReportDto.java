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
public class BatchSkillReportDto {
	
	private int userId;
	private String userEmail;
	private String userName;
	private double totalScore;
	private String status;
	private String assessmentName;
	private String startTime;
	private String assessmentDate;
	private String duration;
	private int assessmentId;
	private int schedulingId;
	private int attemptId;
	

}
