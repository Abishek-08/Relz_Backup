
// src/main/java/com/trace/poc/dao/IdempotencyRepository.java
package com.trace.poc.dao;

import com.trace.poc.modal.IdempotencyRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IdempotencyRepository extends MongoRepository<IdempotencyRecord, String> { }
