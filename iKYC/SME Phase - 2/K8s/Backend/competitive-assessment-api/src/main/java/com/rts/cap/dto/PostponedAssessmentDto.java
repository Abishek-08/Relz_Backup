
package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PostponedAssessmentDto {
	private int schedulingId;
	private String assessmentDate;
	private String startTime;
	private String updateDuration;
	private String status;
	private String reason;
	private String date;
}
