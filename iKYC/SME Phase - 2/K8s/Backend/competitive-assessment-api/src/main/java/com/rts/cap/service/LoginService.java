package com.rts.cap.service;

import org.springframework.http.ResponseEntity;

import com.rts.cap.dto.LoginDto;
import com.rts.cap.dto.UserRequestDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Login;
import com.rts.cap.model.UserRequests;

/**
 * @author sathiyan.sivarajan
 * @since 01-07-2024
 * @version 1.0
 */
public interface LoginService {
	
	
	public ResponseEntity<UserRequests> saveRequest(UserRequestDto requests);
	
	public ResponseEntity<LoginDto> login(String email,String password)throws CapBusinessException;
	
	public boolean verifyOtp(String email, String otp) throws CapBusinessException ;
	
	public Login resendOtp(String email) throws CapBusinessException;

	public Login updatePassword(Login login,String newPassword);

	public Login resetPassword(Login login);

}
