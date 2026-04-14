package com.rts.cap.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.dto.UserDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.User;
import com.rts.cap.service.UserService;

@RestController
@CrossOrigin("*")
@RequestMapping(path = APIConstants.USER_BASE_URL)
public class UserController {

	private UserService userService;

	/**
	 * This is an Dependency injection for the userService using constructor
	 * 
	 * @param entityManager
	 */
	public UserController(UserService userService) {
		super();
		this.userService = userService;

	}

	/**
	 * This "registerUser" method is used to save the userData comes from the client
	 * side.
	 * 
	 * @param userName
	 * @param userEmail
	 * @param userMobile
	 * @param file
	 * @return
	 * @throws IOException
	 */
	@PostMapping(path = APIConstants.ADD_USER_URL)
	public ResponseEntity<Object> registerUser(@RequestBody UserDto userDto) {
		try {
			int userId = userService.registerUser(userDto);
			return ResponseEntity.ok().body(userId);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}

	}

	/**
	 * @author sherin.david
	 * @since 28-06-2024
	 * @version 1.0 Update This "updateUser" is used to update the user by userId
	 *          from the client request.
	 * @param userUpdate
	 * @return
	 */
	@PutMapping(path = APIConstants.UPDATE_USER_URL)
	public ResponseEntity<Object> updateUser(@RequestBody User user) {
		return userService.updateUser(user);
	}

	/**
	 * @author sherin.david
	 * @since 29-06-2024
	 * @version 1.0 Update profile This "updateProfile" is used to update the image
	 *          of the user by userId from the client request.
	 * @param file
	 * @param userId
	 * @return
	 * @throws IOException
	 */
	@PutMapping(path = APIConstants.PROFILEUSER_URL + "/{userId}")
	public ResponseEntity<Object> updateProfile(@RequestParam MultipartFile file, @PathVariable int userId)
			throws IOException {
		return userService.updateProfile(file, userId);
	}

	/**
	 * This "deleteUser" is used to delete the user by given userId from the client
	 * request.
	 * 
	 * @param userId
	 * @return
	 * @throws CapBusinessException
	 */
	@DeleteMapping(path = APIConstants.DELETE_USER_URL + "/{userId}")
	public ResponseEntity<Object> deleteUser(@PathVariable("userId") int userId) throws CapBusinessException {
		try {
			userService.deleteUserById(userId);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	/**
	 * This "getUserById" is used to find the user by given userId from the client
	 * request.
	 * 
	 * @param userId
	 * @return
	 */
	@GetMapping(path = APIConstants.GET_USER_URL + "/{userId}")
	public ResponseEntity<Object> getUserById(@PathVariable("userId") int userId) {
		try {
			return ResponseEntity.ok(userService.findUserById(userId));
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	/**
	 * This "getAllUser" is used to find List of users from the client request.
	 * 
	 * @return
	 */
	@GetMapping(path = APIConstants.GET_ALL_USER_URL)
	public ResponseEntity<Object> getAllUser() {
		try {
			return ResponseEntity.ok(userService.findAllUser());
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	/**
	 * This "getUnMappedUsers" is used to show unMappedUser List.
	 * 
	 * @return
	 */
	@GetMapping(path = APIConstants.GET_UNMAPPED_USER_URL)
	public ResponseEntity<List<User>> getUnMappedUsers() {
		try {
			return ResponseEntity.ok(userService.findUnBatchedUsers());
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	/**
	 * This "validateUserRegister" method is used to validate the user email.
	 * 
	 * @param userEmail
	 * @return
	 */
	@PostMapping(path = APIConstants.VALIDATE_USER_REGISTER_URL + "/{userEmail}")
	public ResponseEntity<Object> validateUserRegister(@PathVariable("userEmail") String userEmail) {
		if (userService.validateUserRegister(userEmail)) {
			return ResponseEntity.badRequest().build();
		} else {
			return ResponseEntity.ok().build();
		}
	}

	/**
	 * This "bulkRegisterUser" is used to add multiple users.
	 * 
	 * @param file
	 * @return
	 * @throws IOException
	 * @throws CapBusinessException
	 */
	@PostMapping(path = APIConstants.ADD_BULK_USERS)
	public ResponseEntity<HashMap<Integer, String>> bulkRegisterUser(@RequestParam("file") MultipartFile file)
			throws IOException, CapBusinessException {
		return ResponseEntity.ok(userService.bulkUploadUser(file));
	}

	/**
	 * @author sowmiya.ramu
	 * @since 26-07-2024
	 * @version 5.0 "updateStatus" is used to update the status of the user by using
	 *          userId
	 * @param userId
	 * @return
	 */
	@PutMapping(path = APIConstants.UPDATE_USER_URL + "/{userId}/{status}")
	public ResponseEntity<Object> updateStatus(@PathVariable int userId, @PathVariable String status) {
		try {
			userService.updateStatus(userId, status);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

}
