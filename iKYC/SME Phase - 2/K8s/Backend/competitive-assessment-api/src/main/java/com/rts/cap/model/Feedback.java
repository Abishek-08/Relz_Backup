package com.rts.cap.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "feedback_tbl")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Feedback {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "feedback_id")
	private int feedbackId;

	@Column(name = "feedback")
	private String feedback;

	@Column(name = "rating")
	private double rating;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@JoinColumn(name = "assessment_id")
	private Assessment assessment;

	@OneToMany( cascade = CascadeType.ALL, orphanRemoval = true,targetEntity = FeedbackValue.class)
	@JoinColumn(name="feedback_id")
    private List<FeedbackValue> feedbackValue = new ArrayList<>();

}
