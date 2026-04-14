package com.rts.cap.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.LoginDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.dao.UserRequestDao;
import com.rts.cap.dto.UserDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.LearningAssessmentScoreCard;
import com.rts.cap.model.Login;
import com.rts.cap.model.SkillAttempt;
import com.rts.cap.model.User;
import com.rts.cap.model.UserRequests;
import com.rts.cap.service.MailService;
import com.rts.cap.service.UserService;
import com.rts.cap.utils.CommonUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * @author abishek.kumar
 * @since 28-06-2024
 * @version 1.0
 */

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private static final Logger LOGGER = LogManager.getLogger(UserServiceImpl.class);

	private final UserDao userDao;
	private final LoginDao loginDao;
	private final UserRequestDao userRequestDao;
	private final MailService mailService;

	/**
	 * This "saveUser" method is used to save the user object, by calling the
	 * userDao method. By calling "saveUser" method it will call two methods
	 * "randomTemporaryPassword" in CommonUtils to generate random password, Another
	 * method is "sendMail" method to send mail to respective user.
	 *
	 * @param user
	 */
	private int addUser(User user) {
		int length = MessageConstants.PASSWORD_MAXIMUM_LENGTH;
		BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();
		String password = CommonUtils.randomTemporaryPassword(length);
		user.setUserPassword(bCrypt.encode(password));
		User tempUser = userDao.addUser(user);
		saveUser(tempUser);
		mailService.userRegistermail(tempUser.getUserName(), tempUser.getUserEmail(), password);
		return tempUser.getUserId();
	}

	@Override
	public void deleteUserById(int userId) throws CapBusinessException {
		User user = userDao.findUserById(userId);
		userDao.deleteUserById(userId);
		loginDao.deleteUserDetails(user.getUserEmail());
		mailService.deleteUserMail(user.getUserName(), user.getUserEmail());
	}

	/**
	 * This "findUserById" method is used to find the user object, by userId.
	 *
	 * @param userId
	 */
	@Override
	public User findUserById(int userId) {
		return userDao.findUserById(userId);
	}

	/**
	 * This "findAllUser" method is used to find List of all users.
	 */
	@Override
	public List<User> findAllUser() {
		return userDao.findAllByUser();
	}

	/**
	 * @author sherin.david , sundhar.soundhar
	 * @purpose This "updateUser" method is used to update the user object by
	 *          calling the userDao method.
	 *
	 * @version 5.0 removed the base64 encode
	 */
	@Override
	public ResponseEntity<Object> updateUser(User user) {
		User existingUser = userDao.findUserById(user.getUserId());
		if (existingUser == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(MessageConstants.USER_NOT_FOUND);
		}
		existingUser.setUserFirstName(user.getUserFirstName());
		existingUser.setUserLastName(user.getUserLastName());
		existingUser.setUserMobile(user.getUserMobile());
		existingUser.setUserDOB(user.getUserDOB());
		existingUser
				.setUserUpdationDate(LocalDate.now().format(DateTimeFormatter.ofPattern(MessageConstants.DATE_FORMAT)));
		userDao.updateUser(user);
		mailService.sendMail(existingUser.getUserEmail(), MessageConstants.USER_UPDATE_SUBJECT,
				MessageConstants.USER_UPDATE_BODY);
		return ResponseEntity.ok(existingUser);
	}

	/**
	 * update profile
	 *
	 * @author sherin.david ,sundhar.soundhar
	 * @since 29-06-2024
	 * @version 1.0 This "updateProfile" method is used to update the image using
	 *          MultipartFile.
	 */
	@Override
	public ResponseEntity<Object> updateProfile(MultipartFile file, int userId) throws IOException {
		User existingUser = userDao.findUserById(userId);
		existingUser.setUserImageData(file.getBytes());
		existingUser
				.setUserUpdationDate(LocalDate.now().format(DateTimeFormatter.ofPattern(MessageConstants.DATE_FORMAT)));
		userDao.updateUser(existingUser);
		userDao.updateProfile(existingUser);
		return ResponseEntity.ok(existingUser);

	}

	/**
	 * This "settingUserDetails" method is used to getting the user details via
	 * request param in the controller. Then setting the user object and call the
	 * "addUser" method.
	 *
	 * @param userName
	 * @param userEmail
	 * @param userMobile
	 * @param file
	 * @throws IOException
	 */
	@Override
	public int registerUser(UserDto userDto) {
		User user = new User();
		user.setUserName(userDto.getUserName());
		user.setUserEmail(userDto.getUserEmail());
		user.setUserMobile(userDto.getUserMobile());
		user.setUserGender(userDto.getUserGender());
		user.setFreshUser(MessageConstants.TRUE_VARIABLE);
		user.setUserStatus(MessageConstants.USER_STATUS_ACTIVE);
		user.setUserDOB(MessageConstants.NOT_AVAILABLE);
		user.setUserFirstName(MessageConstants.NOT_AVAILABLE);
		user.setUserLastName(MessageConstants.NOT_AVAILABLE);
		return addUser(user);
	}

	/**
	 * This "saveUser" method is used to insert user details into the login Table.
	 * when the user is successfully registered this method will called.
	 *
	 * @param user
	 */
	@Override
	public void saveUser(User user) {
		Login login = new Login();
		login.setName(user.getUserName());
		login.setEmail(user.getUserEmail());
		login.setPassword(user.getUserPassword());
		login.setRole(MessageConstants.USER_REGISTRATION_ROLE);
		login.setCount(MessageConstants.USER_REGISTRATION_COUNT);
		login.setFreshUser(MessageConstants.TRUE_VARIABLE);
		loginDao.save(login);
	}

	/**
	 * This "findUnMappedUsers" method is used to get the users whose are not in the
	 * batch.
	 */
	@Override
	public List<User> findUnBatchedUsers() {
		List<Object[]> tempList = userDao.findUnBatchedUsers();
		List<User> userList = new ArrayList<>();
		tempList.forEach(result -> {
			User user = new User((Integer) result[0], (String) result[1], (String) result[2], (String) result[3],
					(String) result[4], (String) result[5], (String) result[6], (String) result[7], (String) result[8],
					(String) result[9], (Boolean) result[10], (byte[]) result[11], (String) result[12],
					(String) result[13]);
			userList.add(user);
		});
		return userList;

	}

	/**
	 * This "validateUserRegister" used to validate the user is already registered
	 * or not.
	 *
	 * @param userEmail
	 */
	@Override
	public boolean validateUserRegister(String userEmail) {
		return userDao.validateUserByUserEmail(userEmail);
	}

	/**
	 * This "bulkUploadUser" method is used to add the multiple users. This method
	 * will return the duplicate users list in the database.
	 *
	 * @return duplicateUserList
	 */
	@Override
	public HashMap<Integer, String> bulkUploadUser(MultipartFile file) throws CapBusinessException {
		HashMap<Integer, String> duplicateUserList = new HashMap<>();
		List<User> userList = new ArrayList<>();

		try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
			Sheet sheet = workbook.getSheetAt(0);

			for (Row row : sheet) {
				int cellIndex = 0;
				User user = new User();

				if (row.getRowNum() == 0) {
					continue;
				}

				for (Cell cell : row) {
					if (cell.getCellType() != CellType.BLANK) {
						switch (cellIndex) {
						case 0:
							user.setUserName(cell.getStringCellValue());
							break;
						case 1:
							user.setUserEmail(cell.getStringCellValue());
							if (userDao.validateUserByUserEmail(cell.getStringCellValue())) {
								duplicateUserList.put(cell.getRowIndex() + 1, cell.getStringCellValue());
							}
							break;
						case 2:
							String mobileNumber = BigDecimal.valueOf(cell.getNumericCellValue()).toPlainString();
							user.setUserMobile(mobileNumber);
							break;
						case 3:
							user.setUserGender(cell.getStringCellValue());
							break;
						default:
							break;
						}
						cellIndex++;
					}
				}
				if (user.getUserEmail() != null) {
					userList.add(user);
				}
			}
		} catch (IOException e) {
			LOGGER.error("Error reading the file", e);
			throw new CapBusinessException("Error reading the file");
		}

		userList.stream().filter(user -> !duplicateUserList.containsValue(user.getUserEmail())).forEach(user -> {
			try {
				UserDto userDto = new UserDto(user.getUserName(), user.getUserEmail(), user.getUserMobile(),
						user.getUserGender());
				registerUser(userDto);
			} catch (Exception e) {
				LOGGER.error("Error registering user with email:{} ", user.getUserEmail(), e);

			}
		});

		return duplicateUserList;
	}

	/**
	 * This " updateStatus" method is used to update the users status active or
	 * inactive using user id
	 */
	@Override
	public boolean updateStatus(int userId, String status) {

		try {
			User user = userDao.findUserById(userId);
			Login login = loginDao.findByEmail(user.getUserEmail());
			if (MessageConstants.USER_STATUS_ACTIVE.equalsIgnoreCase(status)) {
				login.setCount(5);
				loginDao.save(login);
				userDao.updateStatus(userId, status);
				mailService.sendStatusEnableMail(user.getUserName(), user.getUserEmail());
				return MessageConstants.TRUE_VARIABLE;
			} else if (MessageConstants.USER_STATUS_INACTIVE.equalsIgnoreCase(status)) {
				login.setCount(0);
				loginDao.save(login);
				userDao.updateStatus(userId, status);
				mailService.sendStatusDisableMail(user.getUserName(), user.getUserEmail());
				return MessageConstants.TRUE_VARIABLE;
			}
		} catch (CapBusinessException e) {
			LOGGER.error("Error updating status for user ID: ", e);
		}

		return MessageConstants.FALSE_VARIABLE;

	}

	/**
	 * This " getSkillAttemptsForUser" method is used to get the users skill attempt
	 * report using user id
	 */

	@Override
	public List<SkillAttempt> getSkillAttemptsForUser(int userId) {
		return userDao.findSkillAttemptsByUserId(userId);
	}

	/**
	 * This " getLearningScoreCardsByUserId" method is used to get the users
	 * learning assessment report using user id
	 */

	@Override
	public List<LearningAssessmentScoreCard> getLearningScoreCardsByUserId(int userId) {
		return userDao.findLearningScoreCardsByUserId(userId);
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 06-08-2024 Retrieves the total count of user requests. This method
	 *        delegates to the UserRequestDao to fetch all user requests from the
	 *        database.
	 * @return the count of user requests, or 0 if no requests are found
	 */
	@Override
	public int getUserRequestCount() {
		List<UserRequests> userRequest = userRequestDao.getAllRequests();
		return userRequest != null ? userRequest.size() : 0;
	}

	@Override
	public boolean requestUserOperation(int userId) {
		if (updateStatus(userId, MessageConstants.USER_STATUS_ACTIVE)) {
			userRequestDao.deleteRequestByUserId(userId);
			return MessageConstants.TRUE_VARIABLE;
		}
		return MessageConstants.FALSE_VARIABLE;

	}

}