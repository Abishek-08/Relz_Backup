
package com.rts.cap.dao;

import java.util.List;

import com.rts.cap.model.Certifications;

public interface CertificationDao {

	public boolean addCertificates(Certifications certifications);

	public Certifications findCertificateById(long certificateId);

	boolean removeCertificate(Certifications certifications);

	List<Certifications> getAllCertifications(int userId);
}
