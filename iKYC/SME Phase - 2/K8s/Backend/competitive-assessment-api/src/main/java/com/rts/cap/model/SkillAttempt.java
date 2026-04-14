
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
import lombok.ToString;

/**
 * @author sanjay.subramani,dharshsun.s,vinolisha.vijayakumar, prem.mariyappan
 * @since 05-07-2024
 * @version 1.0
 */

@Entity
@Table(name = "skill_attempt_tbl")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SkillAttempt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "attempt_Id")
	private int attemptId;
	
	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "user_id", foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT,name = "fk_skill_user_id"))
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "scheduling_id", referencedColumnName = "scheduling_id", foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT,name = "fk_skill_scheduling_id"))
	private ScheduleAssessment scheduleAssessment;
	
	@ManyToMany
	@JoinTable(name = "skill_attempt_tbl_coding_question_tbl",
	joinColumns = @JoinColumn(referencedColumnName = "attempt_id",name = "attempt_id"),
	foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT,name = "fk_skill_attempt_id"), 
	inverseJoinColumns = @JoinColumn(referencedColumnName = "question_id", name = "question_id"), 
	inverseForeignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, name = "fk_skill_attempt_question_id"))
	private List<CodingQuestion> codingQuestions;
	
	@ManyToMany
	@JoinTable(name = "skill_attempt_tbl_skill_result_tbl",
	joinColumns = @JoinColumn(referencedColumnName = "attempt_id",name = "attempt_id"),
	foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT,name = "fk_skill_attempt_attempt_id"), 
	inverseJoinColumns = @JoinColumn(referencedColumnName = "result_id", name = "result_id"), 
	inverseForeignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, name = "fk_skill_attempt_result_id"))
	private List<SkillResult> skillResults;
	
	@Column(name = "total_score")
	private double totalScore;
	
	@Column(name = "completed_time")
	private String completedTime;
	
	@Column(name = "start_time")
	private String startTime;
	
	@Column(name = "status", columnDefinition = "varchar(255) default 'started'")
	private String status;
}
