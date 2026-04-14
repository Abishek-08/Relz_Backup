package com.department.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.department.model.Department;

@Repository
public interface DepartmentDao extends JpaRepository<Department, Integer> {
	
	public Department findByStaffId(int staffId);

}
