package com.rts.cap.service;

import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.SkillAndLinks;

public interface SkillAndLinkService {

	public SkillAndLinks addSkillAndLink(SkillAndLinks skillAndLinks);
	
	List<SkillAndLinks> getSkillAndLinkById(long userId) throws CapBusinessException;
	
	public boolean deleteSkillAndLinks(long skillsId);

	SkillAndLinks updateSkillAndLinks(SkillAndLinks skillAndLinks, long skillsId);
}
