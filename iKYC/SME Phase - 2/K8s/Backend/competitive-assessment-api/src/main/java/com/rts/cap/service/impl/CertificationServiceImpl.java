package com.rts.cap.service.impl;

import java.io.IOException;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.CertificationDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.model.Certifications;
import com.rts.cap.model.User;
import com.rts.cap.service.CertificationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CertificationServiceImpl implements CertificationService {

	private final CertificationDao certificationDao;

	private final UserDao userDao;

	private static final Logger LOGGER = LogManager.getLogger(CertificationServiceImpl.class);

	/**
	 * This is Method for adding a Certifications record into database
	 * 
	 * @param userId
	 * @param issueDate
	 * @param verificationId
	 * @param institutionName
	 * @param certificateName
	 * @param file
	 * @return Certifications
	 */
	@Override
	public Certifications addCertificates(int userId, String issueDate, String verificationId, String institutionName,
			String certificateName, MultipartFile file) {

		Certifications certifications = null;
		try {
			User user = userDao.findUserById(userId);
			certifications = new Certifications();
			certifications.setCertificate(file.getBytes());
			certifications.setUser(user);
			certifications.setInstitutionName(institutionName);
			certifications.setIssueDate(issueDate);
			certifications.setVerificationId(verificationId);
			certifications.setCertificateName(certificateName);
			certificationDao.addCertificates(certifications);
	
		} catch (IOException e) {
			LOGGER.error("Failed to Add Certifiates", e);
		}
		return certifications;

	}

	/**
	 * This is method for removing certifications record
	 * 
	 * @param certificateId find record by id then removed
	 * @return boolean
	 */
	@Override
	public boolean removeCertificate(long certificateId) {
		boolean flag = MessageConstants.FALSE_VARIABLE;
		try {
			Certifications certifications = certificationDao.findCertificateById(certificateId);
			
			flag = certificationDao.removeCertificate(certifications);

		} catch (Exception e) {
			LOGGER.error("Failed to Delete Certifiates", e); // Consider logging the exception instead of printing the
																// stack trace
		}
		return flag;
	}

	/**
	 * This is method for get all certificates by user id
	 * 
	 * @param userId
	 */
	@Override
	public List<Certifications> getAllCertificateByUserId(int userId) {
		return certificationDao.getAllCertifications(userId);
	}

}
