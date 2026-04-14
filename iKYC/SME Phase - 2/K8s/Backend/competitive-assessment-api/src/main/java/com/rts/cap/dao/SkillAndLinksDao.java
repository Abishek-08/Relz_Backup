package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.SkillAndLinks;

public interface SkillAndLinksDao {

	
	public SkillAndLinks addSkillAndLink(SkillAndLinks skillAndLinks);
	
	List<SkillAndLinks> getSkillAndLinkById(long userId) throws CapBusinessException;
	
	SkillAndLinks getSkillBySkillId(long skillId);
	
	public boolean deleteSkillAndLinks(long skillsId);
}
