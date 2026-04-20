package com.tms.metrics.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

import com.tms.metrics.config.SequenceGeneratorService;
import com.tms.metrics.exception.ResourceNotFoundException;
import com.tms.metrics.feign.TaskClient;
import com.tms.metrics.model.Ratings;
import com.tms.metrics.repo.RatingsRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RatingService {

	private final RatingsRepo ratingsRepo;
	private final TaskClient taskClient;
	private final SequenceGeneratorService sequenceGenerator;

	@CachePut(value = "ratingCache", key = "#result.id")
	public Ratings createRatings(Ratings Ratings) {
		taskClient.getTaskById(Ratings.getTaskId());
		Ratings.setId(sequenceGenerator.generateSequence("ratings-sequence"));
		return ratingsRepo.save(Ratings);
	}
	
	@CachePut(value = "ratingCache", key = "#p0")
	public Ratings updateRatings(int id, Ratings ratings) {
		Ratings rating = ratingsRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ratings not found"));
		rating.setBehaviour(ratings.getBehaviour());
		rating.setTechnical(ratings.getTechnical());
		rating.setComments(ratings.getComments());
		rating.setOverAll(ratings.getOverAll());
		rating.setTaskId(ratings.getTaskId());
		return ratingsRepo.save(rating);
	}
	@CacheEvict(value = "ratingCache", key = "#p0")
	public String deleteRatingsById(int id) {
		try {
			ratingsRepo.deleteById(id);
			return "success";
		} catch (Exception e) {
			return "failure";
		}
	}
	
	@CachePut(value = "ratingCache", key = "#p0", unless = "#result == null")
	public Ratings getRatingsById(int id) {
		return ratingsRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ratings Not Found"));
	}

	public List<Ratings> getAllRatingss() {
		return ratingsRepo.findAll();
	}

}
