package com.rts.cap.service.impl;

import java.util.Collections;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.UserDao;
import com.rts.cap.dao.UserRequestDao;
import com.rts.cap.model.User;
import com.rts.cap.model.UserRequests;
import com.rts.cap.service.MailService;
import com.rts.cap.service.UserRequestService;
import com.rts.cap.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserRequestServiceImpl implements UserRequestService {

	public final UserRequestDao userRequestDao;
	public final UserDao userDao;
	private final UserService userService;
	private final MailService mailService;

	private static final Logger LOGGER = LogManager.getLogger(UserRequestServiceImpl.class);

	/**
	 * Retrieves all user requests.
	 *
	 * - Fetches a list of all user requests from the database. - Returns the list
	 * if successful. - Returns an empty list with a bad request response if an
	 * error occurs.
	 *
	 * @return a {@code ResponseEntity} containing a list of {@code UserRequests} or
	 *         an empty list if there was an error.
	 */

	@Override
	public ResponseEntity<List<UserRequests>> getAllRequests() {

		try {
			return ResponseEntity.ok(userRequestDao.getAllRequests());
		} catch (Exception e) {
			LOGGER.error("Error while occuring Get All User Request", e);
		}

		return ResponseEntity.badRequest().body(Collections.emptyList());
	}

	@Override
	public void updateRequestStatus(long userRequestId, String status, int userId) {
		if (MessageConstants.USER_REQUEST_STATUS_RESOLVED.equalsIgnoreCase(status)) {
            userRequestDao.updateRequestStatus(userRequestId, status);
            userService.updateStatus(userId, MessageConstants.USER_STATUS_ACTIVE);
		} else {
			User user = userService.findUserById(userId);
			userRequestDao.updateRequestStatus(userRequestId, status);
			mailService.sendUserRequestRejectionMail(user.getUserName(), user.getUserEmail());
		}

	}

}