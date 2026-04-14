package com.rts.cap.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.Assert;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.WorkExperience;

import jakarta.transaction.Transactional;

/**
 * @author sherin.david
 * @version v1.0
 * @since 09-07-2024
 */

@SpringBootTest
@Transactional
class WorkExperienceControllerTest {

@Autowired
private UserProfileController workExperienceController;

/**
 * @author sherin.david
 * @version v1.0
 * @since 09-07-2024
 */

@Test
@DisplayName("should update work experience using workExperienceId")
@Disabled("update work experience by id")
void testUpdateWorkExperience() throws CapBusinessException{
	WorkExperience work = new WorkExperience();
	work.setCompanyName("Relevantz");
	work.setRole("Software Developer");
	work.setLocation("Chennai");
	work.setFromYear("2017");
	work.setToYear("2021");
	work.setDescription(" Have Java knowledge");
	workExperienceController.updateWorkExperience(work, 1);
	Assert.assertNotNull(work);
}

/**
 * @author sherin.david
 * @version v1.0
 * @since 09-07-2024
 */

@Test
@DisplayName("delete the work experience details using workExperienceId")
@Disabled("delete academics details")
void testDeleteWorkExperience() {	
	long workExperienceId =1;
	assertEquals(true, workExperienceController.deleteInformation("workexperience",workExperienceId));
}

}