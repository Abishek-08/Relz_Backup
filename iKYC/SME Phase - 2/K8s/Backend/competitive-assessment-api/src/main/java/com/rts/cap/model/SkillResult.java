package com.rts.cap.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author sanjay.subramani, Srinivasan.S, vignesh.velusamy
 * @since 12-07-2024
 * @version 1.0
 */

@Entity
@Table(name = "skill_result_tbl")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SkillResult {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "result_id")
	private int resultId;
	
	@Column(name = "score")
	private double score;
	
	@ManyToMany
	@JoinTable(name = "skill_result_tbl_test_result_tbl",
	joinColumns = @JoinColumn(referencedColumnName = "result_id",name = "result_id"),
	foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT,name = "fk_skill_result_id"), 
	inverseJoinColumns = @JoinColumn(referencedColumnName = "test_result_id", name = "test_result_id"), 
	inverseForeignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, name = "fk_skill_test_result_id"))
	private List<TestResult> testResults;

	@ManyToOne
	@JoinColumn(name = "question_id", referencedColumnName = "question_id", foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT,name = "fk_skill_coding_question_id"))
	private CodingQuestion codingQuestion;
	
	@Column(name = "code", length = 999999999)
	private String code;
	
	@ManyToOne
	@JoinColumn(name = "language_id", referencedColumnName = "language_id", foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT,name = "fk_skill_result_language_id"))
	private Language language;
}
