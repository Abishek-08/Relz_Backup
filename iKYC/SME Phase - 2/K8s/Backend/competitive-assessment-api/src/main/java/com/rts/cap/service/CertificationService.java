package com.rts.cap.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.model.Certifications;

public interface CertificationService {

	public Certifications addCertificates(int userId, String issueDate, String verificationId, String institutionName,
			String certificateName, MultipartFile file);

	public boolean removeCertificate(long certificateId);

	public List<Certifications> getAllCertificateByUserId(int userId);
}
