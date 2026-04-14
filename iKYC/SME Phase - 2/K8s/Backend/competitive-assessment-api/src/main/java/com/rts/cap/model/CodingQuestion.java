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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author sanjay.subramani , dharshsun.s
 * @since 27-06-2024
 * @version 1.0
 */

@Entity
@Table(name = "coding_question_tbl")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CodingQuestion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_id")
	private int questionId;

	@Column(name = "question_title")
	private String questionTitle;

	@Column(length = 999999999, name = "question_description")
	private String questionDescription;

	@ManyToOne
	@JoinColumn(name = "category_id", referencedColumnName = "category_id", foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, name = "fk_skill_category_id"))
	private Category category;

	@Column(name = "level")
	private String level;

	@OneToMany
	@JoinTable(name = "coding_question_tbl_coding_question_file_tbl", 
	joinColumns = @JoinColumn(referencedColumnName = "question_id", name = "question_id"), 
	foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, name = "fk_coding_question_id"), 
	inverseJoinColumns = @JoinColumn(referencedColumnName = "file_id", name = "file_id"), 
	inverseForeignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, name = "fk_skill_file_id"), 
	uniqueConstraints = {
			@UniqueConstraint(columnNames = "file_id", name = "uk_skill_file_id") })
	private List<CodingQuestionFile> codingQuestionFiles;

}
