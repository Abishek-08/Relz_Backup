package com.rts.cap.dao.impl;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.SecretKeyDao;
import com.rts.cap.model.SecretKey;

import jakarta.persistence.EntityManager;

/**
 * @author ranjitha.rajaram
 * @since 04-07-2024
 * @version 2.0
 */

@Repository
public class SecretKeyDaoImpl implements SecretKeyDao {

	private EntityManager entityManager;

	/**
	 * This is an Dependency injection for the EntityManager using constructor
	 * @param entityManager
	 */
	public SecretKeyDaoImpl(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}

	/**
	 * Generates a secret key and persists it to the database.
	 * This method takes a SecretKey object as input, persists it to the database using the entity manager, and returns the persisted SecretKey object.
	 * @param secretKey the SecretKey object to be persisted
	 * @return the persisted SecretKey object
	 */
	@Override
	public SecretKey secretKeyGeneration(SecretKey secretKey) {
		entityManager.persist(secretKey);
		return secretKey;
	}

	/**
	 * Deletes a secret key from the database.
	 * This method takes a SecretKey object as input, finds the corresponding secret key in the database using the entity manager, 
	 * and removes it from the database. If the operation is successful, it returns true. If an exception occurs during the operation, 
	 * it returns false.
	 * @param secretKey the SecretKey object to be deleted
	 * @return true if the secret key is deleted successfully, false otherwise
	 */
	@Override
	public boolean deleteSecretKey(SecretKey secretKey) {
		try {
			SecretKey secretKeys = entityManager.find(SecretKey.class, secretKey);
			entityManager.remove(secretKeys);
			return true;
		} catch (Exception e) {
			return false;
		}

	}

	/**
	 * Finds a SecretKey object from the database by its ID.
	 * @param secretKeyId the ID of the SecretKey to find
	 * @return the SecretKey with the given ID, or null if not found
	 */
	@Override
	public SecretKey findSecretKeyById(int secretKeyId) {
		return entityManager.find(SecretKey.class, secretKeyId);
	}

	/**
	 * Deletes a SecretKey object from the database by its user's ID.
	 * This method will also delete all SecretKey objects associated with the user.
	 * @param userId the ID of the user associated with the SecretKey objects to delete
	 * @return true if the deletion was successful, false otherwise
	 */
	@Override
	public boolean deleteUserById(int userId) {
		String hql = "DELETE FROM SecretKey sk WHERE sk.user.userId = :userId";
		entityManager.createQuery(hql).setParameter("userId", userId).executeUpdate();
		return true;
	}
}
