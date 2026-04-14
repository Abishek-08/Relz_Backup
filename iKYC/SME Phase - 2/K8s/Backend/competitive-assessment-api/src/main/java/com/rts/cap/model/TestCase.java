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
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
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
@Table(name = "test_case_tbl")
@XmlAccessorType(XmlAccessType.FIELD)
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestCase {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "test_case_id")
	private int testCaseId;
	
	@Column(name = "test_case_name")
	private String testCaseName;

	@Column(name = "test_method_name")
	private String testMethodName;

	@Column(name = "description")
	private String description;
	
	@Column(name = "mark")
	private double mark;
	
	@ManyToOne
	@JoinColumn(name = "file_id", referencedColumnName = "file_id", foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT,name = "fk_test_file_id"))
	private CodingQuestionFile codingQuestionFile;
	
}
