package com.rts.cap.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author hemachandran.g
 * @since 11-07-2024
 * @version 3.0
 */
@Entity
@Table(name = "moderate_learning_assesment_tbl")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ModerateLearningAssessment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "moderate_learning_assesment_id")
	private int moderateLearningAssessmentId;

	@Column(name = "topic_id")
	private int topicId;
	
	@Column(name = "subtopic_id")
	@ManyToMany(targetEntity = Subtopic.class,cascade = CascadeType.MERGE)
	private List<Subtopic> subTopic ;
	
	@Column(name = "pass_mark")
	private int passMark;
	
	@OneToOne
	@JoinColumn(name = "assessment_id")
	private Assessment assessment;
	
	@Column(name = "number_of_questions")
	private int numberOfQuestion;

}
