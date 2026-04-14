package com.rts.cap.controller;

import java.util.Objects;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dto.LoginDto;
import com.rts.cap.dto.UserRequestDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Login;
import com.rts.cap.model.UserRequests;
import com.rts.cap.service.LoginService;

import lombok.RequiredArgsConstructor;

/**
 * Controller for managing user login operations.
 * 
 * This controller provides endpoints for user login, OTP validation, OTP resending, and password management.
 * 
 * @author sathiyan.sivarajan
 * @since 01-07-2024
 * @version 1.0
 */
@RestController
@RequiredArgsConstructor
public class LoginController {

	/**
     * Service interface for handling login operations.
     */
	private final LoginService loginService;

	
	@PostMapping(path = APIConstants.USER_REQUEST_BASE_URL)
	public ResponseEntity<UserRequests> saveRequest(@RequestBody UserRequestDto request) {

		return loginService.saveRequest(request);
	}

	/**
     * 
     * @param login the Login object containing email and password
     * @return a ResponseEntity containing the result of the login attempt
     * @throws CapBusinessException if there is an issue with the login attempt
     */
	@PostMapping(path = APIConstants.LOGIN_URL)
	public ResponseEntity<LoginDto> login(@RequestBody Login login) throws CapBusinessException {
		
		return loginService.login(login.getEmail(), login.getPassword());
	}

	/**
     * @param email the email address associated with the OTP
     * @param otp the OTP entered by the user
     * @return a boolean indicating whether the OTP is valid
     * @throws CapBusinessException if there is an issue with OTP validation
     */
	@PostMapping(path = APIConstants.LOGIN_OTP_VALIDATION_URL)
	public ResponseEntity<Boolean> otpValidation(@RequestParam String email, @RequestParam String otp) throws CapBusinessException {
		
		return loginService.verifyOtp(email, otp)?ResponseEntity.ok(MessageConstants.TRUE_VARIABLE):ResponseEntity.ok(MessageConstants.FALSE_VARIABLE);
	}

	/**
     * @param email the email address to which the OTP will be resent
     * @return a ResponseEntity indicating the result of the OTP resent request
     * @throws CapBusinessException if there is an issue with resending the OTP
     */
	@PostMapping(path = APIConstants.RESEND_OTP_URL)
	public ResponseEntity<Login> resendOtp(@RequestParam String email) throws CapBusinessException {
		
		Login login = loginService.resendOtp(email);
		
		return Objects.isNull(login)?ResponseEntity.badRequest().body(login):ResponseEntity.ok(login);
	}

	/**
     * @param login the Login object containing the user's credentials
     * @param newPassword the new password to set
     * @return a ResponseEntity containing the result of the password update attempt
     */
	@PutMapping(path = APIConstants.LOGIN_PASSWORD_UPDATE)
	public ResponseEntity<Login> changePassword(@RequestBody Login login, @RequestParam String newPassword) {
		
		login = loginService.updatePassword(login, newPassword);
		
		return Objects.isNull(login)?ResponseEntity.badRequest().body(login):ResponseEntity.ok(login);
	}
	
	/**
     * @param login the Login object containing the user's credentials for password reset
     * @return a ResponseEntity containing the result of the password reset attempt
     */
	@PutMapping(path = APIConstants.LOGIN_RESET_PASSWORD)
	public ResponseEntity<Login> forgetPassword(@RequestBody Login login) {
		
		 login = loginService.resetPassword(login);
		
		return Objects.isNull(login)?ResponseEntity.badRequest().body(login):ResponseEntity.ok(login);
	}

}
