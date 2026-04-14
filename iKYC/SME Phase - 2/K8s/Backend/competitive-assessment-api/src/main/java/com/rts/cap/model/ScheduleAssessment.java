
package com.rts.cap.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
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
@Table(name = "schedule_assessment_tbl")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ScheduleAssessment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "scheduling_id")
	private int schedulingId;

	@ManyToMany(targetEntity = User.class, cascade = CascadeType.ALL)
	@Column(name = "user_id")
	private List<User> user;

	@OneToOne(cascade = CascadeType.DETACH)
	@JoinColumn(name = "assessment_id")
	private Assessment assessment;

	@Column(name = "assessment_date")
	private String assessmentDate;

	@Column(name = "start_time")
	private String startTime;

	@Column(name = "duration")
	private String duration;

	@Column(name = "assessment_link")
	private String assessmentLink;

	@Column(name = "scheduled_status")
	private String status;

}
