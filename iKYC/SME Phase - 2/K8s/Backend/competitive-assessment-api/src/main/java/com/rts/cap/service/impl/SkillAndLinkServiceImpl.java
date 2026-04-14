package com.rts.cap.service.impl;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.rts.cap.dao.SkillAndLinksDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.SkillAndLinks;
import com.rts.cap.service.SkillAndLinkService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SkillAndLinkServiceImpl implements SkillAndLinkService {

	private final SkillAndLinksDao skillAndLinksDao;

	private static final Logger LOGGER = LogManager.getLogger(SkillAndLinkServiceImpl.class);

	/**
	 * Adds a new skill and link to the database.
	 * 
	 * @param skillAndLinks the skill and link to be added
	 * @return the added skill and link
	 */
	@Override
	public SkillAndLinks addSkillAndLink(SkillAndLinks skillAndLinks) {
		return skillAndLinksDao.addSkillAndLink(skillAndLinks);
	}

	/**
	 * Retrieves a list of skills and links associated with a user.
	 * 
	 * @param userId the ID of the user
	 * @return a list of skills and links
	 * @throws CapBusinessException if an error occurs during the retrieval process
	 */
	@Override
	public List<SkillAndLinks> getSkillAndLinkById(long userId) throws CapBusinessException {
		return skillAndLinksDao.getSkillAndLinkById(userId);
	}

	/**
	 * Deletes a skill and its associated links from the database.
	 * 
	 * @param skillsId the ID of the skill to be deleted
	 * @return true if the deletion is successful, false otherwise
	 */
	@Override
	public boolean deleteSkillAndLinks(long skillsId) {
		return skillAndLinksDao.deleteSkillAndLinks(skillsId);
	}

	/**
	 * Updates a skill and its associated links in the database.
	 * 
	 * @param skillAndLinks the updated skill and links object
	 * @param skillsId      the ID of the skill to be updated
	 * @return the updated skill and links object if the update is successful,
	 *         otherwise the original object
	 */
	@Override
	public SkillAndLinks updateSkillAndLinks(SkillAndLinks skillAndLinks, long skillsId) {
		try {
			SkillAndLinks skill = skillAndLinksDao.getSkillBySkillId(skillsId);
			if (skill != null) {
				skill.setGitHubLink(skillAndLinks.getGitHubLink());
				skill.setLinkedIn(skillAndLinks.getLinkedIn());
				skill.setPortfolio(skillAndLinks.getPortfolio());
				skill.setSkills(skillAndLinks.getSkills());
				return skillAndLinksDao.addSkillAndLink(skill);
			}
		} catch (Exception e) {
			LOGGER.error("Update Skill and Links error", e);
		}
		return skillAndLinks;
	}

}
