package com.rts.cap.model;

import jakarta.persistence.CascadeType;
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
@Getter
@Setter
@Table(name = "skillassessment_tbl")
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SkillAssessment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int skillAssessmentId;

	@OneToOne(targetEntity = Assessment.class, cascade = CascadeType.DETACH)
	@JoinColumn(name = "assessment_id")
	private Assessment assessment;

	

}
