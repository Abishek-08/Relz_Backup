package com.rts.cap.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author sanjay.subramani , dharshsun.s
 * @since 27-06-2024
 * @version 1.0
 */

@Entity
@Table(name = "language_tbl",uniqueConstraints = {@UniqueConstraint(columnNames = "language_name",name = "uk_skill_language_name")})
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Language {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "language_id")
	private int languageId;
	
	@Column(name = "language_name",unique = true)
	private String languageName;
	

}
