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
@Table(name = "answer_tbl")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Answer {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "option_id")
	private int optionId;
	
	@Column(name="correct_answer")
	private int correctAnswer;
	
	@Column(name="option_content")
	private String optionContent;
	
	@Column(name="option_mark")
	private double optionMark;
	
	@ManyToOne(targetEntity = MultipleChoiceQuestion.class,cascade = CascadeType.MERGE)
	@JoinColumn(name = "question_id")
	private MultipleChoiceQuestion question;
	
	

}
