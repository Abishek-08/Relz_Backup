
//package com.rts.cap.controller;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//import org.junit.jupiter.api.Disabled;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.rts.cap.exception.CapBusinessException;
//import com.rts.cap.model.Login;
//
///**
// * @author sathiyan.sivarajan
// * @version v1.0
// * @since 28-06-2024
// */
//
//
//@SpringBootTest
//@Transactional
//class LoginControllerTest {
//
//    @Autowired
//    private LoginController loginController;
//    
//    /**
//     * @author sathiyan.sivarajan
//     * @since 28-06-2024
//     * @throws CapBusinessException
//     * Valid password, Valid email
//     */
//
//    @Test
//	@DisplayName("Valid mail and Password")
//    @Disabled("testing purpose")
//     void testValidLogin() throws CapBusinessException {
//    	
//    	Login login = new Login();
//        String email = "sathyasiva5901@gmail.com";
//        String password = "mK!57pFGgMZKnZ2";
//        
//        login.setEmail(email);
//        login.setPassword(password);
//
//        ResponseEntity<Object> response = loginController.login(login);
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//    }
//    
//    /**
//     * @author sathiyan.sivarajan
//     * @since 28-06-2024
//     * @throws CapBusinessException
//     * Invalid Email
//     */
//    
//    @Test
//    @DisplayName("Invalid Email")
//    @Disabled("testing purpose")
//     void testInvalidLogin() throws CapBusinessException {
//    	
//    	Login login = new Login();
//        String email = "sathyasiva@gmail.com";
//        String password = "9WUPKDSY";
//        
//        login.setEmail(email);
//        login.setPassword(password);
//
//        ResponseEntity<Object> response = loginController.login(login);
//        
//        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
//    	
//    }
//    
//    /**
//     * @author sathiyan.sivarajan
//     * @since 28-06-2024
//     * @throws CapBusinessException
//     * Invalid password, Valid email
//     */ 
//    @Test
//    @DisplayName("Invalid Password")
//    @Disabled("testing purpose")
//    void testInvalidPassword() throws CapBusinessException {
//    	
//    	Login login = new Login();
//        String email = "sathyasiva5901@gmail.com";
//        String password = "WUPKDSY";
//        
//        login.setEmail(email);
//        login.setPassword(password);
//        
//        ResponseEntity<Object> response = loginController.login(login);
//        
//        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
//    }
//    
//    
//    /**
//     * @author sathiyan.sivarajan
//     * @since 28-06-2024
//     * @throws CapBusinessException
//     * Invalid password, Valid email
//     */ 
//    @Test
//    @DisplayName("Invalid Password Locked Account")
//    @Disabled("testing purpose")
//    void testLockedUser() throws CapBusinessException {
//    	
//        String email = "sathyasiva5901@gmail.com";
//        String password = "mK!57pFGgMZKnZ";
//        
//        ResponseEntity<Object> response = null;
//        for (int i = 0; i < 6; i++) {
//        	
//            Login login = new Login();
//            login.setEmail(email);
//            login.setPassword(password);
//
//            response = loginController.login(login);
//        }
//
//        assertEquals(HttpStatus.LOCKED, response.getStatusCode());
//    }
//    
//    /**
//     * @author sundharraj.soundhar
//     * @since 08-07-2024
//     */ 
//    @Test
//    @DisplayName("update password with wrong credentials")
//    @Disabled("testing purpose")
//    void updatePasswordWithWrongCredentials() {
//    	Login login = new Login();
//        login.setEmail("sundharrajs.m.s423@gmail.com");
//        ResponseEntity<Login> response = loginController.changePassword(login, "Sundhar@dev1120");
//        
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
//    }
//    
//    
//    /**
//     * @author sundharraj.soundhar
//     * @since 08-07-2024
//     */ 
//    @Test
//    @DisplayName("update password with correct credentials")
//    @Disabled("testing purpose")
//    void updatePasswordWithCorrectCredentials() {
//    	Login login = new Login();
//        login.setEmail("sundharrajs.m.s422@gmail.com");
//        login.setPassword("Sundharraj@jul07");
//        ResponseEntity<Login> response = loginController.changePassword(login, "Sundhar@dev1120");
//        
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//    }
//    
//    /**
//     * @author sundharraj.soundhar
//     * @since 08-07-2024
//     */
//    @Test
//    @DisplayName("reset password with correct credentials")
//    @Disabled("testing purpose")
//    void resetPasswordWithCorrectCredentials() {
//    	Login login = new Login();
//        login.setEmail("sundharrajs.m.s422@gmail.com");
//        login.setPassword("Sundharraj@jul07");
//        ResponseEntity<Login> response = loginController.forgetPassword(login);
//        
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//    }
//    
//    
//    /**
//     * @author sundharraj.soundhar
//     * @since 08-07-2024
//     */
//    @Test
//    @DisplayName("reset password with wrong credentials")
//    @Disabled("testing purpose")
//    void resetPasswordWithWrongCorrectCredentials() {
//    	Login login = new Login();
//        login.setEmail("sundharrajs.m.s42@gmail.com");
//        login.setPassword("Sundharraj@jul07");
//        ResponseEntity<Login> response = loginController.forgetPassword(login);
//        
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
//    }
//    
//    
//   
//}

package com.rts.cap.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import com.rts.cap.dto.LoginDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Login;

/**
 * @author sathiyan.sivarajan
 * @version v1.0
 * @since 28-06-2024
 */


@SpringBootTest
@Transactional
class LoginControllerTest {

    @Autowired
    private LoginController loginController;
    
    /**
     * @author sathiyan.sivarajan
     * @since 28-06-2024
     * @throws CapBusinessException
     * Valid password, Valid email
     */

    @Test
	@DisplayName("Valid mail and Password")
    @Disabled("testing purpose")
     void testValidLogin() throws CapBusinessException {
    	
    	Login login = new Login();
        String email = "sathyasiva5901@gmail.com";
        String password = "mK!57pFGgMZKnZ2";
        
        login.setEmail(email);
        login.setPassword(password);

        ResponseEntity<LoginDto> response = loginController.login(login);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
    
    /**
     * @author sathiyan.sivarajan
     * @since 28-06-2024
     * @throws CapBusinessException
     * Invalid Email
     */
    
    @Test
    @DisplayName("Invalid Email")
    @Disabled("testing purpose")
     void testInvalidLogin() throws CapBusinessException {
    	
    	Login login = new Login();
        String email = "sathyasiva@gmail.com";
        String password = "9WUPKDSY";
        
        login.setEmail(email);
        login.setPassword(password);

        ResponseEntity<LoginDto> response = loginController.login(login);
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    	
    }
    
    /**
     * @author sathiyan.sivarajan
     * @since 28-06-2024
     * @throws CapBusinessException
     * Invalid password, Valid email
     */ 
    @Test
    @DisplayName("Invalid Password")
    @Disabled("testing purpose")
    void testInvalidPassword() throws CapBusinessException {
    	
    	Login login = new Login();
        String email = "sathyasiva5901@gmail.com";
        String password = "WUPKDSY";
        
        login.setEmail(email);
        login.setPassword(password);
        
        ResponseEntity<LoginDto> response = loginController.login(login);
        
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
    
    
    /**
     * @author sathiyan.sivarajan
     * @since 28-06-2024
     * @throws CapBusinessException
     * Invalid password, Valid email
     */ 
    @Test
    @DisplayName("Invalid Password Locked Account")
    @Disabled("testing purpose")
    void testLockedUser() throws CapBusinessException {
    	
        String email = "sathyasiva5901@gmail.com";
        String password = "mK!57pFGgMZKnZ";
        
        ResponseEntity<LoginDto> response = null;
        for (int i = 0; i < 6; i++) {
        	
            Login login = new Login();
            login.setEmail(email);
            login.setPassword(password);

            response = loginController.login(login);
        }

        assertEquals(HttpStatus.LOCKED, response.getStatusCode());
    }
    
    /**
     * @author sundharraj.soundhar
     * @since 08-07-2024
     */ 
    @Test
    @DisplayName("update password with wrong credentials")
    @Disabled("testing purpose")
    void updatePasswordWithWrongCredentials() {
    	Login login = new Login();
        login.setEmail("sundharrajs.m.s423@gmail.com");
        ResponseEntity<Login> response = loginController.changePassword(login, "Sundhar@dev1120");
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
    
    
    /**
     * @author sundharraj.soundhar
     * @since 08-07-2024
     */ 
    @Test
    @DisplayName("update password with correct credentials")
    @Disabled("testing purpose")
    void updatePasswordWithCorrectCredentials() {
    	Login login = new Login();
        login.setEmail("sundharrajs.m.s422@gmail.com");
        login.setPassword("Sundharraj@jul07");
        ResponseEntity<Login> response = loginController.changePassword(login, "Sundhar@dev1120");
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
    
    /**
     * @author sundharraj.soundhar
     * @since 08-07-2024
     */
    @Test
    @DisplayName("reset password with correct credentials")
    @Disabled("testing purpose")
    void resetPasswordWithCorrectCredentials() {
    	Login login = new Login();
        login.setEmail("sundharrajs.m.s422@gmail.com");
        login.setPassword("Sundharraj@jul07");
        ResponseEntity<Login> response = loginController.forgetPassword(login);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
    
    
    /**
     * @author sundharraj.soundhar
     * @since 08-07-2024
     */
    @Test
    @DisplayName("reset password with wrong credentials")
    @Disabled("testing purpose")
    void resetPasswordWithWrongCorrectCredentials() {
    	Login login = new Login();
        login.setEmail("sundharrajs.m.s42@gmail.com");
        login.setPassword("Sundharraj@jul07");
        ResponseEntity<Login> response = loginController.forgetPassword(login);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
    
    
   
}

