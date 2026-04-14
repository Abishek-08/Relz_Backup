package com.rts.cap.dao;

import com.rts.cap.model.SecretKey;

/**
 * @author ranjitha.rajaram
 * @since 04-07-2024
 * @version 2.0
 */

public interface SecretKeyDao {

	public SecretKey secretKeyGeneration(SecretKey secretKey);

	public SecretKey findSecretKeyById(int secretKeyId);

	public boolean deleteSecretKey(SecretKey secretKey);

	public boolean deleteUserById(int userId);
}
