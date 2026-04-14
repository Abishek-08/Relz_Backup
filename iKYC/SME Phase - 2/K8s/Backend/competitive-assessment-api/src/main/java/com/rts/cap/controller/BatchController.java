package com.rts.cap.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import com.rts.cap.constants.APIConstants;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.model.Batch;
import com.rts.cap.service.BatchService;

/**
 * Controller for handling requests related to Batch operations.
 * Provides endpoints to manage Batch resources including CRUD operations
 * and user management within batches.
 * 
 * @author surya.boobalan, Abishek.Kumar
 * @since 27-06-2024
 * @version 5.0
 */
@RestController
@CrossOrigin("*") // Allows cross-origin requests from any origin
@RequestMapping(APIConstants.BATCH_BASE_URL) // Base URL for Batch-related endpoints
public class BatchController {

	private final BatchService batchService; // Service for handling Batch operations

	/**
	 * Constructor for BatchController. Initializes the BatchService.
	 * 
	 * @param batchService Service used for Batch operations
	 */
	public BatchController(BatchService batchService) {
		this.batchService = batchService;
	}

	/**
	 * Endpoint to add a new Batch.
	 * 
	 * @param batch Batch object to be added
	 */
	@PostMapping(APIConstants.ADD_BATCH_URL)
	public void addBatch(@RequestBody Batch batch) {
		batchService.addBatch(batch);
	}

	/**
	 * Endpoint to get a list of all Batches.
	 * 
	 * @return List of all Batch objects
	 */
	@GetMapping(APIConstants.GET_ALL_BATCH_URL)
	public List<Batch> getAllBatch() {
		return batchService.viewAllBatch();
	}

	/**
	 * Endpoint to update an existing Batch.
	 * 
	 * @param batch Batch object with updated information
	 */
	@PutMapping(APIConstants.UPDATE_BATCH_URL)
	public void updateBatch(@RequestBody Batch batch) {
		batchService.updateBatch(batch);
	}

	/**
	 * Endpoint to delete a Batch by its ID.
	 * 
	 * @param id ID of the Batch to be deleted
	 * @return Response indicating success or failure
	 */
	@DeleteMapping(APIConstants.DELETE_BATCH_URL + "/{id}")
	public ResponseEntity<Object> deleteBatch(@PathVariable int id) {
		if (batchService.deleteBatch(id)) {
			return ResponseEntity.ok(MessageConstants.SUCCESS);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	/**
	 * Endpoint to verify if a Batch name exists.
	 * 
	 * @param batchName Name of the Batch to be verified
	 * @return Response indicating success or failure
	 */
	@GetMapping(APIConstants.VERIFY_BATCH_NAME_URL + "/{batchName}")
	public ResponseEntity<Object> verifyBatchName(@PathVariable String batchName) {
		if (batchService.findName(batchName)) {
			return ResponseEntity.ok(MessageConstants.SUCCESS);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	/**
	 * Endpoint to get a Batch by its ID.
	 * 
	 * @param id ID of the Batch to be retrieved
	 * @return Batch object with the specified ID
	 */
	@GetMapping(APIConstants.GET_ALL_BATCH_URL + "/{id}")
	public Batch getBatchUsingBatchId(@PathVariable int id) {
		return batchService.findBatchById(id);
	}

	/**
	 * Endpoint to add users to a Batch.
	 * 
	 * @param userList List of user IDs to be added
	 * @param batchId ID of the Batch to which users will be added
	 * @return Response indicating success or failure
	 */
	@PutMapping(APIConstants.ADD_USERS_TO_BATCH_URL + "/{batchId}")
	public ResponseEntity<Object> addUsersToBatch(@RequestBody List<Integer> userList,
			@PathVariable("batchId") int batchId) {
		if (batchService.addUserToBatch(userList, batchId)) {
			return ResponseEntity.ok(MessageConstants.SUCCESS);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(MessageConstants.BATCH_COUNT_FAILURE);
		}
	}

	/**
	 * Endpoint to remove a user from a Batch.
	 * 
	 * @param batchId ID of the Batch from which the user will be removed
	 * @param userId ID of the user to be removed
	 * @return Response indicating success or failure
	 */
	@DeleteMapping(APIConstants.DELETE_USERS_FROM_BATCH_URL + "/{batchId}" + "/{userId}")
	public ResponseEntity<Object> deleteUserFromBatch(@PathVariable int batchId, @PathVariable int userId) {
		if (batchService.deleteUserFromBatch(batchId, userId)) {
			return ResponseEntity.ok(MessageConstants.SUCCESS);
		} else {
			return ResponseEntity.badRequest().build();
		}
	}

	/**
	 * Endpoint to remove multiple users from a Batch.
	 * 
	 * @param batchId ID of the Batch from which users will be removed
	 * @param list List of user IDs to be removed
	 * @return Response indicating success or failure
	 */
	@DeleteMapping(APIConstants.DELETE_USERS_FROM_BATCH_URL + "/{batchId}")
	public ResponseEntity<Object> deleteUserFromBatch(@PathVariable int batchId, @RequestBody List<Integer> list) {
		if (batchService.deleteUserFromBatch(batchId, list)) {
			return ResponseEntity.ok(MessageConstants.SUCCESS);
		} else {
			return ResponseEntity.badRequest().build();
		}
	}

}
