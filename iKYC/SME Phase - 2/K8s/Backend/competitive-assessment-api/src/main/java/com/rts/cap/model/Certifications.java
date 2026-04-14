package com.rts.cap.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name = "user_certification_tbl")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Certifications {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="certificate_id")
	private long certificateId;
	
	@Column(name ="issue_date")
	private String issueDate;
	
	@Column(name="verification_id")
	private String verificationId;
	
	@Column(name="institution_name")
	private String institutionName;
	
	@Lob
	@Column(name="certificate",columnDefinition = "LONGBLOB")
	private byte[] certificate;
	
	@Column(name="certificate_name")
	private String certificateName;
	
	@ManyToOne
	@JoinColumn(name="userId")
	private User user;
}
