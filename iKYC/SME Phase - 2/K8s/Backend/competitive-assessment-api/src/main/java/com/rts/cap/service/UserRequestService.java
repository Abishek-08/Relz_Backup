package com.rts.cap.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.rts.cap.model.UserRequests;

public interface UserRequestService {

	public ResponseEntity<List<UserRequests>> getAllRequests();	
	
	public void updateRequestStatus(long userRequestId, String status, int userId);
	

}
