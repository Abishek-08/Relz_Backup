package com.rts.cap.controller;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.Assert;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.User;

@SpringBootTest
class UserControllerTest {
	
	@Autowired
	private UserController userController;
	

	@Test
	@Disabled("Build Purpose")
	void test_UserFindById() {
		ResponseEntity<?> user = userController.getUserById(1);
		assertNotNull(user);
	}
	
	@Test
	@Disabled("Build Purpose")
	 void test_FindAllUser() {
		ResponseEntity<?> userList =userController.getAllUser();
		assertNotNull(userList);
	}

	
	@Test
	@Disabled("Build Purpose")
	void test_FindUnMappedUser() {
		ResponseEntity<?> unMappedUsers = userController.getUnMappedUsers();
		assertNotNull(unMappedUsers);
	}
	
	@Test
	@Disabled("Build Purpose")
	void test_DeleteUser() throws CapBusinessException {
		ResponseEntity<?> response = userController.deleteUser(3);
		assertEquals(HttpStatusCode.valueOf(400), response.getStatusCode());
	}
	
	@Test
	@Disabled("Build Purpose")
    void performUserUpdateTest() {
        User userUpdate =new User();
        userUpdate.setUserId(1);
        userUpdate.setUserName("Sowmi");
        userUpdate.setUserMobile("8561230174");
         ResponseEntity<?> Result = userController.updateUser(userUpdate);
		Assert.assertNotNull(Result);
    }	


}
