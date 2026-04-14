package com.rts.cap.model;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


/**
 * @author karpagam.b
 * @since 19-07-2024
 * @version 4.0
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "learning_assessment_score_card_tbl")
@Entity
public class LearningAssessmentScoreCard {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "score_id")
	private int scoreId;

	@Column(name = "score")
	private double score;

	@Column(name = "status")
	private String status;
	
	
	@Column(name = "completion_status",columnDefinition = "varchar(255) default 'started'")
	private String completionStatus;
	
	@Lob
	@Column(name="assessment_report",columnDefinition = "LONGBLOB")
	private byte[] assessmentReport;
	
	@ManyToOne(targetEntity = Topic.class, cascade = CascadeType.MERGE)
	@JoinColumn(name = "topic_id")
	private Topic topicId;
	
	@ManyToOne(targetEntity = ScheduleAssessment.class, cascade = CascadeType.MERGE)
	@JoinColumn(name = "schedule_assessment_id")
	private ScheduleAssessment scheduleAssessment;

	@ManyToOne(targetEntity = User.class, cascade = CascadeType.MERGE)
	@JoinColumn(name = "user_id")
	private User user;
	
}
