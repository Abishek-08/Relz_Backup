package com.staff.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "staff_tbl")
public class Staff {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int staffId;
	private String staffName;
	private String staffGender;

}
