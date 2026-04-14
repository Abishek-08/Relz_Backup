package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.Batch;

/**
 * @author surya.boobalan
 * @since 27-06-2024
 * @version 1.0
 */

public interface BatchDao {
	
	/**
	 * 
	 * @param for creating batch 
	 * 
	 */
	public void saveBatch(Batch batch);
	
	/**
	 * for viewing the all batches in the database
	 * 
	 */
	public List<Batch> viewAllBatch();
	
//	/**
//	 * 
//	 * @param batch for updating the existing batch
//	 * @return HTTP message message with status code 200.
//	 */
//	public void updateBatch(Batch batch);
	
	/**
	 * 
	 * @param id for deleting an existing batch.
	 * @return HTTP message message with status code 200.
	 */
	public boolean deleteBatch(Batch batch);
	
	/**
	 * 
	 * @param batchName to find whether the batch name is present in the database.
	 * @return HTTP message message with status code 200 if name is found
	 */
	public boolean findName(String batchName);
	
	/**
	 * Finds a batch in the database by its id.
	 * 
	 * @param batchId The id of the batch to find.
	 * @return The Batch object if found, null otherwise.
	 */
	public Batch findBatchById(int batchId);

	public List<Batch> findUsersInBatch(int batchId);
	
	
	
}
