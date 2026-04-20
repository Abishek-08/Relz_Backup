package com.tms.metrics.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tms.metrics.model.Task;

@Repository
public interface TaskRepo extends MongoRepository<Task, Long> {
	
	Task findByTaskName(String taskName);


	

}
