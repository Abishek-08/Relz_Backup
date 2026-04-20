package com.trace.poc.modal;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "tasks")
public class Task {

	@Id
	private String taskId;
	private String taskType;
	private String taskName;
	private String description;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;

}
