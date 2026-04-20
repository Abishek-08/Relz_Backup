package com.tms.metrics.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.tms.metrics.model.Employee;

@FeignClient(name = "employee-service", url = "http://192.168.49.2:30413")
public interface EmployeeClient {

    @GetMapping("/api/employees/employeeId/{id}")
    Employee getEmployeeById(@PathVariable("id") Long id);
}
