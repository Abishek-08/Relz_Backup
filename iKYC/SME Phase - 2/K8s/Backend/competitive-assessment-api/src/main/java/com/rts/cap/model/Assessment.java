package com.rts.cap.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@Table(name = "assessment")
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Assessment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int assessmentId;

	@Column(name = "assessment_name")
	private String assessmentName;

	@Column(length = 999999999, name = "instruction")
	private String instruction;

}
