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
@Table(name = "subtopic_tbl")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Subtopic {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "subtopic_id")
	private int subtopicId;
	
	@Column(name = "subtopic_name")
	private String subtopicName;
	
	@ManyToOne(targetEntity = Topic.class,cascade = CascadeType.MERGE)
	@JoinColumn(name = "topic_id")
	private Topic topic;
	
	
}
