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
 * @author sundharraj.soundhar
 * @since 05-07-2024
 * @version 2.0
 * 
 */

@Entity
@Table(name = "security_answer_tbl")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SecurityQuestionAnswers {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int securityAnswersId;
	private String answers;
	
	@ManyToOne(targetEntity = User.class, cascade = CascadeType.MERGE)
	@JoinColumn(name = "user_id")
	private User user;
	
	@Column(name="question")
	private String questions;

}
