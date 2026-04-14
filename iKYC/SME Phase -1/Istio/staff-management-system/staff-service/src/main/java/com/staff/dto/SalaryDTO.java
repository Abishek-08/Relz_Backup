package com.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SalaryDTO {

	private int salaryId;
	private double salaryAmount;
	private int departmentId;
	private int staffId;

}
