package com.rts.cap.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.LoginDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.dao.UserRequestDao;
import com.rts.cap.dto.LoginDto;
import com.rts.cap.dto.UserRequestDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Login;
import com.rts.cap.model.User;
import com.rts.cap.model.UserRequests;
import com.rts.cap.service.LoginService;
import com.rts.cap.service.MailService;
import com.rts.cap.utils.JwtUtils;
import lombok.RequiredArgsConstructor;

/**
 * @author sathiyan.sivarajan
 * @since 01-07-2024
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

	private static final Logger LOGGER = LogManager.getLogger(LoginServiceImpl.class);

	private final LoginDao loginDao;
	public final UserRequestDao userRequestDao; 
	private final UserDao userDao;

	private final MailService mailService;

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0
	 * @param email, password
	 * @throws CapBusinessException
	 */
	@Override
	public ResponseEntity<LoginDto> login(String email, String password) throws CapBusinessException {
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

		try {
			Login verifyLogin = loginDao.findByEmail(email);
			if (passwordEncoder.matches(password, verifyLogin.getPassword())) {
				if (verifyLogin.getRole().equalsIgnoreCase(MessageConstants.ADMIN_VARIABLE)) {
					return processAdminLogin(verifyLogin);
				} else if (verifyLogin.getRole().equalsIgnoreCase(MessageConstants.USER_VARIABLE)
						&& verifyLogin.getCount() > 0) {
					return processUserLogin(verifyLogin);
				}
			}

			return handleFailedLoginAttempt(verifyLogin);
		} catch (CapBusinessException e) {
			LOGGER.error("login exception {}", e.getMessage());
		}

		return ResponseEntity.notFound().build();
	}

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0 This method process the admin login details
	 */
	private ResponseEntity<LoginDto> processAdminLogin(Login verifyLogin) {
		String otp = generateOtp();
		LocalDateTime otpExpiryTime = LocalDateTime.now().plus(2, ChronoUnit.MINUTES);
		LoginDto logindto = new LoginDto();

		verifyLogin.setOtp(otp);
		verifyLogin.setExpiryTime(otpExpiryTime);
		loginDao.save(verifyLogin);

		mailService.sendMail(verifyLogin.getEmail(), MessageConstants.LOGIN_VERIFICATION_OTP,
				MessageConstants.LOGIN_OTP_BODY_LINE_ONE + MessageConstants.LOGIN_OTP_BODY_LINE_TWO + otp
						+ MessageConstants.LOGIN_OTP_BODY_LINE_THREE);

		User userObject = userDao.findUserByEmail(verifyLogin.getEmail());
		String token = JwtUtils.generateToken(verifyLogin);
		String refreshToken = JwtUtils.refreshToken(new HashMap<>(), verifyLogin);

		verifyLogin.setPassword(null);
		logindto.setToken(token);
		logindto.setRefreshToken(refreshToken);
		logindto.setExpirationTime(MessageConstants.ACCOUNT_EXPIRATION_TIME);
		logindto.setUser(userObject);
		logindto.setLogin(verifyLogin);

		return new ResponseEntity<>(logindto, HttpStatus.OK);
	}

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0 This method process the User login details
	 */
	private ResponseEntity<LoginDto> processUserLogin(Login login) {

		LoginDto logindto = new LoginDto();

		login.setCount(MessageConstants.USER_REGISTRATION_COUNT);
		loginDao.save(login);

		User userObject = userDao.findUserByEmail(login.getEmail());
		String token = JwtUtils.generateToken(login);
		String refreshToken = JwtUtils.refreshToken(new HashMap<>(), login);
		login.setPassword(null);
		logindto.setToken(token);
		logindto.setRefreshToken(refreshToken);
		logindto.setExpirationTime(MessageConstants.ACCOUNT_EXPIRATION_TIME);
		logindto.setUser(userObject);
		logindto.setLogin(login);

		return new ResponseEntity<>(logindto, HttpStatus.OK);

	}

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0 This method process the admin login details
	 * @throws CapBusinessException
	 */
	private ResponseEntity<LoginDto> handleFailedLoginAttempt(Login verifyLogin) throws CapBusinessException {

		User user = userDao.findUserByEmail(verifyLogin.getEmail());
		LoginDto logindto = new LoginDto();
		
		logindto.setUser(user);

		if (verifyLogin.getCount() == 0
				|| MessageConstants.USER_STATUS_INACTIVE.equalsIgnoreCase(user.getUserStatus())) {
			userDao.updateStatus(userDao.findUserByEmail(verifyLogin.getEmail()).getUserId(),
					MessageConstants.USER_STATUS_INACTIVE);
			
			return new ResponseEntity<>(logindto, HttpStatus.LOCKED);
		}

		updateLoginDetails(verifyLogin.getEmail());

		logindto.setCount(verifyLogin.getCount());

		return new ResponseEntity<>(logindto, HttpStatus.UNAUTHORIZED);
	}

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0
	 * @param email This method Update the login information details in the login
	 *              table.
	 * @throws CapBusinessException
	 */
	private void updateLoginDetails(String email) throws CapBusinessException {
		Login login = loginDao.findByEmail(email);

		if (login != null && login.getCount() > 0) {
			login.setCount(login.getCount() - 1);
			loginDao.save(login);
		}
	}

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0
	 * @param email, password This method process the OTP validation
	 * @throws CapBusinessException
	 */
	@Override
	public boolean verifyOtp(String email, String otp) throws CapBusinessException {
		Login details = loginDao.findByEmail(email);
		return details != null && details.getOtp().equals(otp) && LocalDateTime.now().isBefore(details.getExpiryTime());
	}

	/**
	 * @author sathiyan.sivarajan
	 * @since 01-07-2024
	 * @version 1.0
	 * @param email, password This method generate the OTP
	 */
	private String generateOtp() {
		int otp = ThreadLocalRandom.current().nextInt(100000, 1000000);
		return Integer.toString(otp);
	}

	/**
	 * @throws CapBusinessException
	 * @return login
	 */

	@Override
	public Login resendOtp(String email) throws CapBusinessException {

		Login verifyLogin = null;

		try {

			verifyLogin = loginDao.findByEmail(email);

			if (!verifyLogin.isFreshUser()) {
				String otp = generateOtp();
				LocalDateTime otpExpiryTime = LocalDateTime.now().plus(2, ChronoUnit.MINUTES);
				verifyLogin.setOtp(otp);
				verifyLogin.setExpiryTime(otpExpiryTime);
				loginDao.save(verifyLogin);

				mailService.sendMail(verifyLogin.getEmail(), MessageConstants.LOGIN_VERIFICATION_OTP,
						MessageConstants.LOGIN_OTP_BODY_LINE_ONE + MessageConstants.LOGIN_OTP_BODY_LINE_TWO + "<b>"
								+ otp + "</b>" + MessageConstants.LOGIN_OTP_BODY_LINE_THREE);

				return verifyLogin;

			}

		} catch (Exception e) {
			LOGGER.error("resend OTP error ");
		}
		return verifyLogin;
	}

	/**
	 * @author sundharraj.soundharrajan
	 * @since 04-07-2024
	 * @version 2.0
	 * @param login object, newPassword
	 * @return Login
	 *
	 */

	@Override
	public Login updatePassword(Login login, String newPassword) {

		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

		Login verifyLogin = null;

		try {
			verifyLogin = loginDao.findByEmail(login.getEmail());

			if (passwordEncoder.matches(login.getPassword(), verifyLogin.getPassword())) {
				User user = userDao.findUserByEmail(login.getEmail());
				verifyLogin.setPassword(passwordEncoder.encode(newPassword));
				user.setUserPassword(passwordEncoder.encode(newPassword));
				verifyLogin.setFreshUser(MessageConstants.FALSE_VARIABLE);
				verifyLogin.setCount(MessageConstants.USER_REGISTRATION_COUNT);
				loginDao.save(verifyLogin);
				userDao.updateProfile(user);
				String salutation = verifyLogin.getName();
				if (verifyLogin.getRole().equalsIgnoreCase(MessageConstants.ADMIN_VARIABLE)) {
					salutation = MessageConstants.ADMIN_VARIABLE;
				}
				mailService.sendChangePasswordMail(login.getEmail(), MessageConstants.PASSWORD_CHANGE_MAIL_SUBJECT,
						MessageConstants.PASSWORD_CHANGE_MAIL_SALUTATION + salutation
								+ MessageConstants.PASSWORD_CHANGE_MAIL_BODY
								+ MessageConstants.BEST_REGARDS_MAIL_CONTENT);
				return verifyLogin;
			}

		} catch (CapBusinessException e) {
			LOGGER.error("Failed to Update Password", e);
		}
		return verifyLogin;

	}

	/**
	 * @author sundharraj.soundharrajan
	 * @since 04-07-2024
	 * @version 2.0
	 * @param login object
	 */

	@Override
	public Login resetPassword(Login login) {

		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

		Login verifyLogin = null;

		try {
			verifyLogin = loginDao.findByEmail(login.getEmail());
			verifyLogin.setPassword(passwordEncoder.encode(login.getPassword()));
			// we have to add the updated password in the admin table also
			verifyLogin.setFreshUser(MessageConstants.FALSE_VARIABLE);
			// updating the user password
			User user = userDao.findUserByEmail(login.getEmail());
			user.setUserPassword(passwordEncoder.encode(login.getPassword()));
			loginDao.save(verifyLogin);
			userDao.updateProfile(user);

			String salutation = verifyLogin.getName();

			if (verifyLogin.getRole().equalsIgnoreCase(MessageConstants.ADMIN_VARIABLE)) {
				salutation = MessageConstants.ADMIN_VARIABLE;
			}
			mailService.sendChangePasswordMail(login.getEmail(), MessageConstants.PASSWORD_CHANGE_MAIL_SUBJECT,
					MessageConstants.PASSWORD_CHANGE_MAIL_SALUTATION + salutation
							+ MessageConstants.PASSWORD_RESET_MAIL_BODY + MessageConstants.BEST_REGARDS_MAIL_CONTENT);

			return verifyLogin;

		} catch (CapBusinessException e) {
			LOGGER.error("Failed to Reset Password", e);
		}
		return verifyLogin;

	}
	
	@Override
	public ResponseEntity<UserRequests> saveRequest(UserRequestDto requests) {
		try {
			// Retrieve the user by email
			User user = userDao.findUserByEmail(requests.getEmail());
			if (user == null) {
				LOGGER.warn("User with email {} not found", requests.getEmail());
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}

			// Retrieve existing user requests
			List<UserRequests> existingRequests = userRequestDao.findUserRequest(user.getUserEmail());

			// Check if user status is inactive and if there are any pending or rejected
			// requests
			boolean hasPendingOrRejectedRequest = existingRequests.stream().anyMatch(
					req -> MessageConstants.USER_REQUEST_STATUS_PENDING.equalsIgnoreCase(req.getRequestStatus())
							|| MessageConstants.USER_REQUEST_STATUS_REJECTED.equalsIgnoreCase(req.getRequestStatus()));

			if (MessageConstants.USER_STATUS_INACTIVE.equals(user.getUserStatus())) {
				if (hasPendingOrRejectedRequest) {
					LOGGER.info("User {} already has a pending or rejected request", user.getUserEmail());
					return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).build();
				}

				// Create and save the new user request
				UserRequests newRequest = new UserRequests();
				newRequest.setDescription(requests.getDescription());
				newRequest.setUser(user);
				loginDao.saveRequest(newRequest);

				// Get the most recent user request
				UserRequests savedRequest = existingRequests.stream().reduce((first, last) -> last).orElse(null);

				if (savedRequest != null) {
					// Send password change email
					mailService.sendChangePasswordMail(user.getUserEmail(),
							MessageConstants.PASSWORD_CHANGE_MAIL_SUBJECT,
							MessageConstants.PASSWORD_CHANGE_MAIL_SALUTATION + user.getUserName()
									+ MessageConstants.USER_REQUEST_MAIL_BODY + savedRequest.getUserRequestId()
									+ MessageConstants.BEST_REGARDS_MAIL_CONTENT);
					return ResponseEntity.ok(savedRequest);
				}
			}
		} catch (Exception e) {
			LOGGER.error("Error while processing user request", e);
		}
		
		return ResponseEntity.badRequest().build();
	}

}