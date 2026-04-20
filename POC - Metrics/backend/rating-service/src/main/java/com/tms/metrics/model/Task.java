package com.tms.metrics.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author karpagam.boothanathan
 * @since 08-12-2025
 * @version 1.0
 */


@Document(collection = "tasks")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Task {
	
	@Id
	private Long taskId;
	private String taskName;
	
	private Long employeeId;
	private Long projectId;
	

}
