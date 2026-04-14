package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IndividualUserReportDto {
	
	private int userId;
	private String userEmail;
	private String userName;
	private double score;
	private String status;
	private String assessmentDate;
	private String assessmentName;
	private int schedulingId;
	private int attemptId;

}
