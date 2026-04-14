package com.rts.cap.model;

import jakarta.persistence.Column;
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
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

@Entity
@Table(name = "topic_tbl")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Topic {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "topic_id")
	private int topicId;
	
	
	@Column(name = "topic_creation_date")
	private String topicCreationDate;
	
	@Column(name="topic_name",unique = true)
	private String topicName;

}
