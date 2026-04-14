package com.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DepartmentDTO {
	
	private int departmentId;
	private String departmentName;
	private int staffId;

}
