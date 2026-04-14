package com.rts.cap.service;

import java.util.List;

import com.rts.cap.model.Batch;

/**
 * @author surya.boobalan
 * @since 27-06-2024
 * @version 1.0
 */

public interface BatchService {

	public void addBatch(Batch batch);

	public List<Batch> viewAllBatch();

	public void updateBatch(Batch batch);

	public boolean deleteBatch(int id);

	public boolean findName(String batchName);

	public boolean addUserToBatch(List<Integer> userId, int batchId);

	public Batch findBatchById(int batchId);

	public boolean deleteUserFromBatch(int batchId, int userId);

	boolean deleteUserFromBatch(int batchId, List<Integer> list);

}
