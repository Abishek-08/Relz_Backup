package com.rts.cap.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.model.UserRequests;
import com.rts.cap.service.UserRequestService;
import com.rts.cap.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = APIConstants.USER_REQUEST_BASE_URL)
@RequiredArgsConstructor
@PreAuthorize("permitAll()")
public class UserRequestController {

	private final UserRequestService userRequestService;
	private final UserService userService;

	@GetMapping
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<List<UserRequests>> getAllUserRequest() {
		return userRequestService.getAllRequests();
	}

	@DeleteMapping("/enableUser/{userId}") 
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<Object> enableUser(@PathVariable("userId") int userId) {
		if (userService.requestUserOperation(userId)) {
			return ResponseEntity.ok().build();
		}
          return ResponseEntity.badRequest().build();
	}
	
	@PutMapping(APIConstants.USER_REQUEST_STATUS_CHANGE)
	public ResponseEntity<Object> updateRequestStatus(@PathVariable("requestId") long requestId, @PathVariable("status") String requestStatus,@PathVariable("userId")int userId) {
		try {
			userRequestService.updateRequestStatus(requestId, requestStatus, userId);
			return ResponseEntity.ok().build();
		}catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

}
