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

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

@Entity
@Table(name="multiple_choice_question_tbl")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MultipleChoiceQuestion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="question_id",unique = true)
	private int questionId;	
	
	@Column(name="complexity")
	private String complexity;
	
	@Column(name="content",unique = true)
	private String content;
	
	@Column(name="is_active",columnDefinition = "varchar(255) default 'yes'")
	private String isActive;
	
	@Column(name="mark")
	private int mark;
	
	@Column(name="question_type")
	private String questionType;
	
	
	@ManyToOne(targetEntity = Subtopic.class,cascade = CascadeType.MERGE)
	@JoinColumn(name = "subtopic_id")
	private Subtopic subtopic;
	
}
