package com.rts.cap.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChosenQuestion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long topicId;
	private Long subtopicId;
	private int basicCount;
	private int intermediateCount;
	private int hardCount;

	@ManyToOne
	@JoinColumn(name = "level_three_id", nullable = false)
	@JsonBackReference
	private LevelThreeLearningAssessment levelThreeLearningAssessment;
}
