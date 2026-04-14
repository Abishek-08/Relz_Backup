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
 * @author ranjitha.rajaram
 * @since 04-07-2024
 * @version 2.0
 */

@Entity
@Table(name = "secretkey_tbl")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SecretKey {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int secretKeyId;

	@Column(name = "secret_key")
	private String secretKey;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne(targetEntity = ScheduleAssessment.class, cascade = CascadeType.DETACH)
	@JoinColumn(name = "schedule_assessment_id")
	private ScheduleAssessment scheduleAssessment;

}
