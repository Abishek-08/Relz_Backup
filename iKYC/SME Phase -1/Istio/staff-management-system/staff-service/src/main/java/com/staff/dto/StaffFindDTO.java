package com.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StaffFindDTO {

	private int staffId;
	private String staffName;
	private String departmentName;
	private double salaryAmount;

}
