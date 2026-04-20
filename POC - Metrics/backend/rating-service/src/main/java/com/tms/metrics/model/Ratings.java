package com.tms.metrics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "ratings")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Ratings {

	@Id
	private Long id;
	private double technical;
	private double behaviour;
	private double overAll;
	private String comments;
	private Long taskId;
}
