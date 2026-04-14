package com.rts.cap.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.Assert;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.AcademicDetails;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
class AcademicControllerTest {

	
	@Autowired
	private UserProfileController academicDetailsController;

	
	
	/**
	 * @author sherin.david
	 * @version v1.0
	 * @since 09-07-2024
	 */
	
	@Test
	@DisplayName("should update academic details using academic Id")
	@Disabled("update academics details by id")
	void testUpdateAllAcademics () throws CapBusinessException {
		AcademicDetails academicUpdate = new AcademicDetails();
		academicUpdate.setDegree("Bsc");
		academicUpdate.setStream("computer");
		academicUpdate.setCgpa(8.74f);
		academicUpdate.setInstituteName("SRM");
		academicUpdate.setFromDuration("14 june");
		academicUpdate.setToDuration("7 may");
	academicDetailsController.updateAcademicDetails(academicUpdate,2);
	Assert.assertNotNull(academicUpdate);
	}
	
	/**
	 * @author sherin.david
	 * @version v1.0
	 * @since 09-07-2024
	 */
	
	@Test
	@DisplayName("delete the academics details using academicsId")
	@Disabled("delete academics details")
	void testDeleteAcademics() {	
		long academicId =1;
		assertEquals(true, academicDetailsController.deleteInformation("academic",academicId));
	}
	
	

}