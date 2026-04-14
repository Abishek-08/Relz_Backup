package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.UserProfileDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.AcademicDetails;
import com.rts.cap.model.Certifications;
import com.rts.cap.model.SkillAndLinks;
import com.rts.cap.model.User;
import com.rts.cap.model.WorkExperience;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

@Repository
public class UserProfileDaoImpl implements UserProfileDao {

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public User findUserById(long userId) {
		return entityManager.find(User.class, userId);
	}

	@Override
	public WorkExperience addWorkExperience(WorkExperience workExperience) {
		entityManager.persist(workExperience);
		return workExperience;
	}

	@Override
	public WorkExperience findById(long workexperienceId) {
		return entityManager.find(WorkExperience.class, workexperienceId);
	}

	@Override
	public boolean deleteWorkExperience(long workExperienceId) {
		WorkExperience experience = entityManager.find(WorkExperience.class, workExperienceId);
		if (experience != null) {
			entityManager.remove(experience);
			return true;
		} else {
			return false;
		}
	}

	// Academics Details

	@Override
	public AcademicDetails addAcademicDetails(AcademicDetails academicDetails) {
		entityManager.persist(academicDetails);
		return academicDetails;
	}

	@Override
	public boolean addCertificates(Certifications certifications) {
		try {
			System.err.println(certifications.getUser().getUserFirstName());
			entityManager.persist(certifications);
			return MessageConstants.TRUE_VARIABLE;
		} catch (Exception e) {
			return MessageConstants.FALSE_VARIABLE;
		}
	}

	@Override
	public boolean deleteDetails(String label, long infoId) {

		Object details = switch (label) {
		case "academic" -> entityManager.find(AcademicDetails.class, infoId);
		case "workexperience" -> entityManager.find(WorkExperience.class, infoId);
		case "certifications" -> entityManager.find(Certifications.class, infoId);
		case "skill" -> entityManager.find(SkillAndLinks.class, infoId);
		default -> "Not Found";
		};

		if (details != null) {
			entityManager.remove(details);
			return true;
		} else {
			return false;
		}

	}

	@Override
	public List<Certifications> getAllCertifications(int userId) {

		return entityManager
				.createQuery("select c from Certifications c WHERE c.user.userId = :userId", Certifications.class)
				.setParameter("userId", userId).getResultList();
	}

	@Override
	public Certifications findCertificateById(long certificateId) {

		return entityManager.find(Certifications.class, certificateId);
	}

	@Transactional
	@Override
	public boolean removeCertificate(Certifications certifications) {
		try {
			entityManager.remove(certifications);
			return MessageConstants.TRUE_VARIABLE;
		} catch (Exception e) {
			return MessageConstants.FALSE_VARIABLE;
		}
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
		SkillAndLinks skills = entityManager.find(SkillAndLinks.class, skillId);
		return skills;
	}

	@Override
	public boolean deleteSkillAndLinks(long skillsId) {
		SkillAndLinks skill = entityManager.find(SkillAndLinks.class, skillsId);
		if (skill != null) {
			entityManager.remove(skill);
			return true;
		} else {
			return false;
		}
	}

	@Override
	public AcademicDetails findAcademyDetailById(long academicId) throws CapBusinessException {

		try {
			return entityManager.find(AcademicDetails.class, academicId);
		} catch (Exception e) {
			throw new CapBusinessException(MessageConstants.RECORD_NOT_FOUND);
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object> getUserInformation(String label, long userId) throws CapBusinessException {
	    TypedQuery<?> query = null;
	    
	    try {
	        switch (label) {
	            case "work":
	                query = entityManager.createQuery("Select ad From WorkExperience ad where ad.user.userId = :userId", WorkExperience.class);
	                break;
	            case "skill":
	                query = entityManager.createQuery("Select ad From SkillAndLinks ad where ad.user.userId = :userId", SkillAndLinks.class);
	                break;
	            case "academics":
	                query = entityManager.createQuery("Select ad From AcademicDetails ad where ad.user.userId = :userId", AcademicDetails.class);
	                break;
	            case "certificates":
	                query = entityManager.createQuery("select c from Certifications c WHERE c.user.userId = :userId", Certifications.class);
	                break;
	            default:
	                throw new CapBusinessException("Unknown label: " + label);
	        }

	        query.setParameter("userId", userId);
	        return (List<Object>) query.getResultList();

	    } catch (Exception e) {
	        throw new CapBusinessException("No Details Found For That User");
	    }
	}

}
