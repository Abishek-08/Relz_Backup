package com.rts.cap.model;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
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

/**
 * @author sanjay.subramani
 * @since 22-08-2024
 * @version 1.0
 */

@Entity
@Table(name = "coding_question_file_tbl")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CodingQuestionFile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "file_id")
	private int fileId;

	@Column(length = 999999999, name = "code_skeleton", nullable = false)
	private String codeSkeleton;

	@Column(length = 999999999, name = "test_case_file", nullable = false)
	private String testCaseFile;

	@Column(length = 999999999, name = "dummy_case_file", nullable = false)
	private String dummyCaseFile;

	@Column(length = 999999999, name = "test_case_xml", nullable = false)
	private String testCaseXml;

	@Column(name = "test_class_name")
	private String testClassName;

	@Column(name = "dummy_class_name")
	private String dummyClassName;

	@ManyToOne
	@JoinColumn(name = "language_id", referencedColumnName = "language_id", foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, name = "fk_skill_language_id"))
	private Language language;
}
