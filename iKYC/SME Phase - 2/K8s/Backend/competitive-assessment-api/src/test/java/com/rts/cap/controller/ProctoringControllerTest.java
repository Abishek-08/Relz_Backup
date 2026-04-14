//package com.rts.cap.controller;
//
//import static org.junit.Assert.assertNotNull;
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
//import com.rts.cap.model.Proctoring;
//
//@SpringBootTest
//class ProctoringControllerTest {
//
//	@Autowired
//	private ProctoringController proctoringController;
//
//	@Test
//	@Disabled("build purpose")
//	@DisplayName("Add Proctoring")
//	void test_addProctoring() {
//		Proctoring proctor = new Proctoring();
//		proctor.setCopyPasteWarning(true);
//		proctor.setTabSwitchingWarning(false);
//		proctor.setCopyPasteWarning(false);
//		proctor.setAudioProctoring(false);
//		proctor.setViolationCount(5);
//		Proctoring proctoring = proctoringController.addProctoring(proctor);
//		assertNotNull(proctoring);
//	}
//
//	@Test
//	@Disabled("build purpose")
//	@DisplayName("Get Proctoring By Assessment Id")
//	void test_getProctoringByAssessmentId() {
//		Proctoring proctoring = proctoringController.getProctoringByAssessmentId(2);
//		assertNotNull(proctoring);
//	}
//
//	@Test
//	@Disabled("build purpose")
//	@DisplayName("Get Proctoring By Assessment Id")
//	void test_getProctoringByProctoringId() {
//		Proctoring proctoring = proctoringController.getProctoringByProctoringId(1);
//		assertNotNull(proctoring);
//	}
//
//	@Test
//	@Disabled("build purpose")
//	@DisplayName("delete Proctoring")
//	void test_deleteProctoringById() {
//		boolean flag = proctoringController.deleteProctoringById(7);
//		assertEquals(true, flag);
//
//	}
//
//	@Test
//	@Disabled("build purpose")
//	@DisplayName("Update Proctoring")
//	void test_updateProctoring() {
//		Proctoring proctoring = new Proctoring();
//		proctoring.setProctoringId(1);
//		proctoring.setCopyPasteWarning(false);
//		proctoring.setTabSwitchingWarning(false);
//		proctoring.setCopyPasteWarning(false);
//		proctoring.setAudioProctoring(false);
//		proctoring.setViolationCount(100);
//		ResponseEntity<?> status = proctoringController.updateProctoringById(proctoring);
//		assertEquals(HttpStatus.OK, status.getStatusCode());
//
//	}
//
//}
