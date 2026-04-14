package com.rts.cap.dto;

/**
 * @author ranjitha.rajaram
 * @version 6.0
 * @since 06-08-2024
 */
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class KnowledgeAssessmentCountsDto {

	private long learningAssessmentCount;
	private long levelZeroCount;
	private long quickCount;
	private long moderateCount;
	private long levelThreeCount;
}
