package com.tms.metrics.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tms.metrics.model.Ratings;

public interface RatingsRepo extends MongoRepository<Ratings, Integer> {

}
