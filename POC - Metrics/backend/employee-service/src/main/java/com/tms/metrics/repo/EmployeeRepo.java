package com.tms.metrics.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tms.metrics.model.Employee;

@Repository
public interface EmployeeRepo  extends MongoRepository<Employee, Long>{
	
//	@Query("{ 'employeeEmail' : ?0 }")
	Employee findByEmployeeEmail(String email);
	
	Employee findByEmployeeId(Long employeeId);


	
	

}
