package com.rts.cap.model;

/**
 * @author jothilingam.a
 * @since 12-07-2024
 * @version 1.0
 */


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

@Entity
@Table(name = "quick_learning_assessment_tbl")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class QuickLearningAssessment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "quick_learning_assessment_id")
	private int quickLearningAssessmentId;

	@Column(name = "topic_id")
	private int topicId;

	@Column(name = "number_of_questions")
	private int numberOfQuestion;

	@Column(name = "basic")
	private int basic;

	@Column(name = "intermediate")
	private int intermediate;

	@Column(name = "hard")
	private int hard;

	@Column(name = "pass_mark")
	private int passMark;

	@OneToOne
	@JoinColumn(name = "assessment_id")
	private Assessment assessment;

}
