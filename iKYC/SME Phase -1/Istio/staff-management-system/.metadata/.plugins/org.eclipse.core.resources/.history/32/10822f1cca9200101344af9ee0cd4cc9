package com.staff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.staff.dto.DepartmentDTO;

@FeignClient(name="department-service", url="http://department-service")
public interface DepartmentClient {
	
	@GetMapping("/department/get/staff/{staffId}")
	DepartmentDTO getStaffByDepartment(@PathVariable("staffId") int staffId);

}
