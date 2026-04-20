package com.tms.metrics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "employees")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Employee {
	
	@Id
	private Long id;
	private Long employeeId;
	private String employeeName;
	private String role;
	private String employeeEmail;


}
