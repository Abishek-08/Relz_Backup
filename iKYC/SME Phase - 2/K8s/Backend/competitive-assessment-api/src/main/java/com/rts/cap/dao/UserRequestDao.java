package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.UserRequests;

/**
 * @author sundharraj.soundhar
 * @since 07-08-2024
 * @version 6.0
 * 
 */
public interface UserRequestDao {

//	public UserRequests saveRequest(UserRequests requests);

	public List<UserRequests> getAllRequests();

	public boolean deleteRequestByUserId(int userId);

	public List<UserRequests> findUserRequest(String userEmail);

	public void updateRequestStatus(long requestId, String status);

}
