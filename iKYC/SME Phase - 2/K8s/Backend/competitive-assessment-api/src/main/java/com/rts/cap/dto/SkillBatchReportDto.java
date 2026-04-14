package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SkillBatchReportDto {
	
	private int batchId;
	private int schedulingId;
	private int userId;
	private double totalScore;
	private String assessmentName;

}
