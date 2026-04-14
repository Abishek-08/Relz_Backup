package com.salary.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salary.model.Salary;

@Repository
public interface SalaryDao extends JpaRepository<Salary, Integer> {

	public Salary findByStaffId(int staffId);

}
