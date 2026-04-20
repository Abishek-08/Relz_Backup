
// src/main/java/com/trace/poc/dao/ProjectRepository.java
package com.trace.poc.dao;

import com.trace.poc.modal.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> { }
