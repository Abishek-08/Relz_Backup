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

@Entity
@Table(name = "feedback_value_tbl")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class FeedbackValue {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "feedback_value_id")
	private int feedbackValueId;
	
	@Column(name = "attribute_value")
	private String attributeValue;
	
	@ManyToOne(targetEntity = FeedbackDynamicAttribute.class,cascade = CascadeType.MERGE)
    @JoinColumn(name="attribute_id")
    private FeedbackDynamicAttribute feedbackDynamicAttribute;
	
}
