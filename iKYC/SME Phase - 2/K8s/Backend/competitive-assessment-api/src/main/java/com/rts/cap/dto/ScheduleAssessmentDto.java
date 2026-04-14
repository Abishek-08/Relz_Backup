package com.rts.cap.dto;

import java.util.List;

import com.rts.cap.model.FeedbackDynamicAttribute;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author ranjitha.rajaram
 * @since 04-07-2024
 * @version 2.0
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ScheduleAssessmentDto {

	private String startTime;
	private String duration;
	private String assessmentDate;
	private int assessmentId;
	private List<FeedbackDynamicAttribute>dynamicAttribute;

}
