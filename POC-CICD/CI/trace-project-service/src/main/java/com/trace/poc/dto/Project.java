package com.trace.poc.dto;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "projects")
public class Project {

	@Id
	private String projectId;
	private String projectName;
	private String projectCode;
	private String accountName;
	private String projectLocation;
	private String projectStartDate;
	private String projectEndDate;
	private String projectStatus;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;

}
