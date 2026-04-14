package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.CertificationDao;
import com.rts.cap.model.Certifications;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Repository
public class CertificationDaoImpl implements CertificationDao {

	private EntityManager entityManager;
	
	public CertificationDaoImpl(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}
	
	@Override
	public Certifications findCertificateById(long certificateId) {
		
		return entityManager.find(Certifications.class, certificateId);
	}
	
	@Override
	public boolean addCertificates(Certifications certifications) {
		try {
			entityManager.persist(certifications);
			return MessageConstants.TRUE_VARIABLE;
		} catch (Exception e) {
			return MessageConstants.FALSE_VARIABLE;
		}
	}
	
	@Override
	public List<Certifications> getAllCertifications(int userId){
		
		return entityManager.createQuery("select c from Certifications c WHERE c.user.userId = :userId", Certifications.class).setParameter("userId", userId).getResultList();
		
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
}
