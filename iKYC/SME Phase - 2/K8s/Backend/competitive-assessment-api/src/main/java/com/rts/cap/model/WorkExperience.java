package com.rts.cap.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "user_work_experience_tbl")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class WorkExperience {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="work_experience_id")
	private long workExperienceId;
	
	@Column(name="company_name")
	private String companyName;
	
	@Column(name="role")
	private String role;
	
	@Column(name="location")
	private String location;
	
	@Column(name="from_year")
	private String fromYear;
	
	@Column(name="to_year")
	private String toYear;
	
	@Column(name="description")
	private String description;
	
	@ManyToOne
	@JoinColumn(name="userId")
	private User user;
	

}