package com.rts.cap.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author sundharraj.soundhar
 * @since 27-07-2024
 * @version 5.0
 * 
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserOverAllScores {
	
	private long userId;
	private double knowledgeOverallAverage;
	private double skillOverallAverage;
	private List<Map<String, Object>> monthSkillAverage;
	private List<Map<String, Object>> monthLearningAverage;

}
