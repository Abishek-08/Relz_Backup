package com.rts.cap.model;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name="user_tbl")
public class User {
	
	/**
	 * @author abishek.kumar
	 * @since 28-06-2024
	 * @version 1.0
	 */
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private int userId;
	private String userName;
	private String userFirstName;
	private String userLastName;
	private String userEmail;
	private String userPassword;
	private String userDOB;	
	private String userMobile;
	private String userStatus;
	private String userGender;
	private boolean freshUser;
	@Lob
	@Column(columnDefinition = "LONGBLOB")
	private byte[] userImageData;
	private String userCreationDate;
	private String  userUpdationDate;
	
	@PrePersist
	protected void onCreate() {
		
		this.userCreationDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
		this.userUpdationDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
 
	}
	
}
