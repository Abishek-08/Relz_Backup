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
@Table(name = "user_education_tbl")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AcademicDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="academic_id")
	private long academicId;
	
	@Column(name="degree")
	private String degree;
	
	@Column(name="stream")
	private String stream;
	
	@Column(name="cgpa")
	private float cgpa;
	
	@Column(name="institute_name")
	private String instituteName;
	
	@Column(name="from_duration")
	private String fromDuration;
	
	@Column(name="to_duration")
	private String toDuration;
	
	@ManyToOne
	@JoinColumn(name="userId")
	private User user;
	
}