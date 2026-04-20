package com.tms.metrics.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tms.metrics.model.Ratings;
import com.tms.metrics.service.RatingService;

import lombok.AllArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/ratings")
@AllArgsConstructor
public class RatingController {

	private final RatingService ratingService;

	@PostMapping
	public ResponseEntity<Ratings> insertRating(@RequestBody Ratings ratings) {
		return ResponseEntity.ok(ratingService.createRatings(ratings));

	}

	@PutMapping("/{ratingId}")
	public ResponseEntity<Ratings> updateRating(@PathVariable("ratingId") int ratingId, @RequestBody Ratings ratings) {
		return ResponseEntity.ok(ratingService.updateRatings(ratingId, ratings));

	}

	@GetMapping("/{ratingId}")
	public ResponseEntity<Ratings> getRating(@PathVariable("ratingId") int ratingId) {
		return ResponseEntity.ok(ratingService.getRatingsById(ratingId));

	}

	@DeleteMapping("/{ratingId}")
	public ResponseEntity<String> deleteRating(@PathVariable("ratingId") int ratingId) {
		return ResponseEntity.ok(ratingService.deleteRatingsById(ratingId));

	}

	@GetMapping
	public ResponseEntity<List<Ratings>> getAllRating() {
		return ResponseEntity.ok(ratingService.getAllRatingss());

	}

}
