package com.trace.poc.dao;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.trace.poc.modal.Task;

public interface taskDao extends MongoRepository<Task, String> {

}
