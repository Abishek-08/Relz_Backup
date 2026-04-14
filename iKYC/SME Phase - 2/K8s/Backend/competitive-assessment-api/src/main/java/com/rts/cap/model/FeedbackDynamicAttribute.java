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
@Table(name="feedback_dynamic_attribute_tbl")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FeedbackDynamicAttribute {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="attribute_id")
	private int attributeId;
	
	@Column(name ="attribute_name")
	private String attributeName;
	
	@Column(name="attribute_type")
	private String attributeType;
	
	@ManyToOne(targetEntity = Assessment.class, cascade = CascadeType.MERGE)
	@JoinColumn(name = "assessment_id")
	private Assessment assessment;

}
