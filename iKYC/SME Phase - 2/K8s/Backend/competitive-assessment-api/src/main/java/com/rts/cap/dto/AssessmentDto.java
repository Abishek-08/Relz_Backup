package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author sundharraj.soundhar
 * @since 06-07-2024
 * @version 2.0
 * 
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AssessmentDto {

	private int assessmentId;
	private int scheduledAssessmentId;
	private int userId;
	private String assessmentInstruction;
	private String assessmentName;
	private String assessmentDate;
	private String startTime;
	private String duration;
	private String status;
	private String type;

}
