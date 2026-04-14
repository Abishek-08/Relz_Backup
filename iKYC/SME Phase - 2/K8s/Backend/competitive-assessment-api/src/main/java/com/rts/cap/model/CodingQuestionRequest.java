package com.rts.cap.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@Table(name = "coding_question_request_tbl")
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CodingQuestionRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "request_id")
	private int requestId;
	
	@Column(name = "level")
	private String level;

	@Column(name = "count")
	private int count;

	@ManyToOne(targetEntity = SkillAssessment.class, cascade = CascadeType.MERGE)
	@JoinColumn(name = "skillassessment_id")
	private SkillAssessment skillassessment;

	@ManyToOne(targetEntity = Category.class, cascade = CascadeType.MERGE)
	@JoinColumn(name = "category_id")
	private Category category;

}
