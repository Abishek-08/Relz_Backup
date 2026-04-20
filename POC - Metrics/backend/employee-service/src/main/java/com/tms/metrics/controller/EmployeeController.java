package com.tms.metrics.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tms.metrics.model.Employee;
import com.tms.metrics.service.EmployeeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EmployeeController {

	
	private final EmployeeService employeeService;
	
	@PostMapping
	public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee){
		return ResponseEntity.status(201).body(employeeService.createEmployee(employee));
	}
	
	@GetMapping
	public List<Employee>getAllEmployees(){
		return employeeService.getAllEmployees();
	}
	
	@GetMapping("/{id}")
	public Employee getEmployeeById(@PathVariable("id") Long id) {
		return employeeService.getEmployee(id);
	}
	
	@PutMapping("/{id}")
	public Employee updateEmployee(@PathVariable("id") Long id, @RequestBody Employee employee) {
		return employeeService.updateEmployee(id, employee);	
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteEmployee(@PathVariable("id") Long id) {
		employeeService.deleteEmployee(id);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/employeeId/{employeeId}")
	public Employee getByEmployeeId(@PathVariable("employeeId") Long employeeId) {
	    return employeeService.getEmployeeByEmployeeId(employeeId);
	}

	

}
