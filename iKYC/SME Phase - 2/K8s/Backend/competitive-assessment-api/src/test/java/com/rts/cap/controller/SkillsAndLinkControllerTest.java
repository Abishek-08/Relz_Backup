package com.rts.cap.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.Assert;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.SkillAndLinks;

import jakarta.transaction.Transactional;

/**
 * @author sherin.david
 * @version v1.0
 * @since 09-07-2024
 */

@SpringBootTest
@Transactional
class SkillsAndLinkControllerTest {

@Autowired
private UserProfileController skillAndLinksController;

/**
 * @author sherin.david
 * @version v1.0
 * @since 09-07-2024
 */

@Test
@DisplayName("should update skill and links details using skillId")
@Disabled("update skill and link details by id")
void testUpdateSkillandLink () throws CapBusinessException{
	SkillAndLinks skillsAndLink = new SkillAndLinks();
	skillsAndLink.setSkills("Java");
	skillsAndLink.setGitHubLink("github.com");
	skillsAndLink.setLinkedIn("linkedIn.com");
	skillsAndLink.setPortfolio("portfolio.pdf");
	skillAndLinksController.updateSkillAndLink(skillsAndLink, 1);
	Assert.assertNotNull(skillsAndLink);
}

/**
 * @author sherin.david
 * @version v1.0
 * @since 09-07-2024
 */

@Test
@DisplayName("delete the skill and link details using skillId")
@Disabled("delete skill and link details")
void testDeleteSkillandLinks() {
	long skillId = 1;
	assertEquals(true, skillAndLinksController.deleteInformation("certifications",skillId));
}
}