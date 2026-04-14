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
//
//import com.rts.cap.model.Genuinity;
//
//@SpringBootTest
//class GeniunityControllerTest {
//
//	@Autowired 
//	private GenuinityController genuinityController;
//	
//	
//	/**
//	 * @author sherin.david
//	 * @version v1.0
//	 * @since 05-08-2024
//	 */
//	
//	@Test
//	@DisplayName("Test Add Genunity with valid data")
//	@Disabled("Disabled due to test purpose")
//	void testAddGenunity() {
//		Genuinity genunity = new Genuinity();
//		genunity.setGenuinity(20.8);
//		genunity.setCopyPaste(3);
//		genunity.setTabSwitch(2);
//		
//		int proctoringId = 1;
//
//		   ResponseEntity<Genuinity> response = genuinityController.saveGenuinity(genunity);
//	        assertEquals(HttpStatus.OK, response.getStatusCode());
//	}
//	
//	
//	/**
//	 * @author sherin.david
//	 * @version v1.0
//	 * @since 05-08-2024
//	 */
//
//	@Test
//	@DisplayName("Get Genunity score by scheduling id and user id")
//	@Disabled("disabled due to testing purpose")
//	void testGetGenuinityScore() {
//		ResponseEntity<Genuinity> response = genuinityController.getGenuinityScore(1, 1);
//		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
//	}
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//}
