package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.SkillAndLinksDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.SkillAndLinks;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

@Repository
public class SkillAndLinkDaoImpl implements SkillAndLinksDao {

	EntityManager entityManager;

	public SkillAndLinkDaoImpl(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}

	@Override
	public SkillAndLinks addSkillAndLink(SkillAndLinks skillAndLinks) {
		entityManager.persist(skillAndLinks);
		return skillAndLinks;
	}

	@Override
	public List<SkillAndLinks> getSkillAndLinkById(long userId) throws CapBusinessException {
		try {
			TypedQuery<SkillAndLinks> query = entityManager.createQuery(
					"Select ad From SkillAndLinks ad where ad.user.userId = :userId ", SkillAndLinks.class);
			query.setParameter("userId", userId);
			return query.getResultList();
		} catch (Exception e) {
			throw new CapBusinessException("Details Not Found");
		}
	}

	@Override
	public SkillAndLinks getSkillBySkillId(long skillId) {
		return null;
	}

	public boolean deleteSkillAndLinks(long skillsId) {
	
		SkillAndLinks skill = entityManager.find(SkillAndLinks.class, skillsId);
		if (skill != null) {
			entityManager.remove(skill);
			return true;
		} else {
			return false;
		}
	}



}
