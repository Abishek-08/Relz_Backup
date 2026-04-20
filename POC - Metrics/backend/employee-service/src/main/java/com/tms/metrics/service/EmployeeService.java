package com.tms.metrics.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tms.metrics.config.SequenceGeneratorService;
import com.tms.metrics.exception.ResourceNotFoundException;
import com.tms.metrics.model.Employee;
import com.tms.metrics.repo.EmployeeRepo;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService {
	
	private final EmployeeRepo employeeRepo;
	private final SequenceGeneratorService sequenceGenerator;
	
	@CachePut(value = "employeeCache", key = "#result.id")
	public Employee createEmployee(Employee employee) {
		employee.setId(sequenceGenerator.generateSequence("employee_sequence"));
		return employeeRepo.save(employee);
	}
	
	 @CachePut(value = "employeeCache", key = "#p0")
	public Employee updateEmployee(Long id, Employee employeeDetails) {
		
		Employee employee = employeeRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Employee not found"));
		
		employee.setEmployeeId(employeeDetails.getEmployeeId());
		employee.setEmployeeEmail(employeeDetails.getEmployeeEmail());
		employee.setEmployeeName(employeeDetails.getEmployeeName());
		employee.setRole(employeeDetails.getRole());
		return employeeRepo.save(employee);
	}
	 @CacheEvict(value = "employeeCache", key = "#p0")
	public void deleteEmployee(Long id) {
		if(employeeRepo.existsById(id)) { employeeRepo.deleteById(id); }
		
        else {throw new ResourceNotFoundException("Employee Not Found");}
		
	}
	
	 @Cacheable(value = "employeeCache",key = "#p0", unless = "#result == null")
	public Employee getEmployee(Long id) {
		return employeeRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Employee Not Found"));
	}
	
	public Employee getEmployeeByEmployeeId(Long employeeId) {
	    return employeeRepo.findByEmployeeId(employeeId);
	}

    public List<Employee>getAllEmployees(){
    	return employeeRepo.findAll();
    }

	
	

}
