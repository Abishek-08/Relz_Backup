package com.rts.cap.service.impl;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.rts.cap.dao.LoginDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Login;

import lombok.RequiredArgsConstructor;

/**
 * @author sundharraj.soundharrajan
 * @since 06-08-2024
 * @version 2.0
 */

@Service
@RequiredArgsConstructor
public class LoginSecurityService implements UserDetailsService {

	// Logger for logging error messages
	private static final Logger LOGGER = LogManager.getLogger(LoginSecurityService.class);

	// Dependency injection of the LoginDao bean
	private final LoginDao dao;

	/**
	 * Loads user-specific data by email address. This method is called by Spring
	 * Security during authentication to retrieve user details.
	 * 
	 * @param email the email address of the user to load
	 * @return UserDetails object containing user information
	 * @throws UsernameNotFoundException if the user is not found or there is an
	 *                                   error
	 */

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

		Login login = new Login();

		try {
			return dao.findByEmail(email);
		} catch (CapBusinessException e) {

			LOGGER.error("Error finding user by email", e);
		}
		return login;
	}

}
