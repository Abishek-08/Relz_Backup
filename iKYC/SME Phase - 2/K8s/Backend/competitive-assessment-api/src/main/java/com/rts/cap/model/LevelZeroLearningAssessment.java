package com.rts.cap.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


/**
 * @author hemachandran.g
 * @since 22-07-2024
 * @version 1.0
 */

@Entity
@Table(name = "level_zero_learning_assessment_tbl")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LevelZeroLearningAssessment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "level_zero_learning_assessment_id")
	private int levelZeroLearningAssessmentId;
		
	@Column(name = "topic_id")
	private int topicId;

	@Column(name = "number_of_questions")
	private int numberOfQuestion;
	
	@Column(name = "pass_mark")
	private int passMark;
	
	@OneToOne
	@JoinColumn(name = "assessment_id")
	private Assessment assessment;

}
