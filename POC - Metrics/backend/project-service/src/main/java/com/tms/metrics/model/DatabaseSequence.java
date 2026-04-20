package com.tms.metrics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "project_database_sequences")
@Data
public class DatabaseSequence {
    
	@Id
	private String id;
	private Long seq;
}
