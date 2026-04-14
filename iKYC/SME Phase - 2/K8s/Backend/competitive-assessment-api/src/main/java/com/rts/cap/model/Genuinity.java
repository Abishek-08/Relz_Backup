package com.rts.cap.model;

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

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "genuinity_tbl")
public class Genuinity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "genuinity_id")
	private int genuinityId;

	@Column(name = "genuinity")
	private double genuinity;
	
	@Column(name = "copy_paste_warning")
	private int copyPaste;
	
	@Column(name = "tab_switching_warning")
	private int tabSwitch;

	@ManyToOne
	@JoinColumn(name = "proctoring_id")
	private Proctoring proctoring;
	
	
	@ManyToOne
	@JoinColumn(name = "schedule_assessment_id")
	private ScheduleAssessment scheduleAssessment;
	

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

}
