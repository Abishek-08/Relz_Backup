package com.trace.poc.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.trace.poc.modal.Timesheet;

public interface TimeSheetRepo extends MongoRepository<Timesheet, String> {
	
}
