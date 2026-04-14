package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.BatchDao;
import com.rts.cap.model.Batch;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

/**
 * @author surya.boobalan
 * @since 27-06-2024
 * @version 1.0
 */

@Repository
public class BatchDaoImpl implements BatchDao {

	EntityManager entityManager;

	public BatchDaoImpl(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}

	@Override
	public void saveBatch(Batch batch) {

		entityManager.persist(batch);
	}

	@Override
	public List<Batch> viewAllBatch() {
		return entityManager.createQuery("from Batch", Batch.class).getResultList();

	}

	@Override
	public boolean deleteBatch(Batch batch) {
		

			try {
				entityManager.remove(batch);
				return true;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return false;
		
	}

	@Override
	public boolean findName(String batchName) {
	    TypedQuery<Batch> query = entityManager.createQuery("SELECT b FROM Batch b WHERE b.batchName = :batchName", Batch.class);
	    query.setParameter("batchName", batchName);
	    List<Batch> batches = query.getResultList();

	    return !batches.isEmpty();
	}


	@Override
	public Batch findBatchById(int batchId) {
		// Find the existing batch by id
		return entityManager.find(Batch.class, batchId);
	}

	@Override
	public List<Batch> findUsersInBatch(int batchId) {
	    TypedQuery<Batch> query = entityManager.createQuery(
	        "SELECT u FROM Batch u WHERE u.batch.batchId = :batchId", Batch.class
	    );
	    query.setParameter("batchId", batchId);
	    return query.getResultList();
	}

}
