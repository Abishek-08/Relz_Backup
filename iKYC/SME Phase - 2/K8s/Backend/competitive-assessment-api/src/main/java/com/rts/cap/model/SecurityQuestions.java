package com.rts.cap.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "security_question_tbl")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SecurityQuestions {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int securityQuestionId;
	private String question;

}
