package com.staff.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff.model.Staff;

@Repository
public interface StaffDao extends JpaRepository<Staff, Integer> {

}
