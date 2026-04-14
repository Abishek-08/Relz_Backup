package com.staff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.staff.dto.SalaryDTO;

@FeignClient(name="salary-service", url="http://salary-service")
public interface SalaryClient {
	
	@GetMapping("/salary/get/staff/{staffId}")
	SalaryDTO findStaffBySalary(@PathVariable("staffId") int staffId);

}
