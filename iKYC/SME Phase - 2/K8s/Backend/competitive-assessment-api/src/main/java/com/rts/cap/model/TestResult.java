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
 * @author sanjay.subramani, Srinivasan.S, vignesh.velusamy
 * @since 12-07-2024
 * @version 1.0
 */

@Entity
@Table(name = "test_result_tbl")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TestResult {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "test_result_id")
	private int testResultId;
	
	@Column(name = "running_time")
	private long runningTime;
	
	@Column(name = "failure", length = 999999999)
	private String failure;
	
	@Column(name = "status")
	private String status;
	
	@ManyToOne
	@JoinColumn(name = "test_case_id", referencedColumnName = "test_case_id" , foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT,name = "fk_skill_test_case_id"))
	private TestCase testCase;

}
