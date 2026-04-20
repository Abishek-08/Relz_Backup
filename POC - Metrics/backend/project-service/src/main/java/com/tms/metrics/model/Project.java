package com.tms.metrics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "projects")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Project {
	
	@Id
	private Long id;
	private String projectName;
	private String createdAt;
	private String closedAt;
	private boolean isActive;

}
