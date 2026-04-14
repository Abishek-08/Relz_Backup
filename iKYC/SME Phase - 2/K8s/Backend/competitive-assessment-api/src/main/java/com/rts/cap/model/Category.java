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
 * @since 28-06-2024
 * @version 1.0
 */

@Entity
@Table(name = "category_tbl", uniqueConstraints = {
		@UniqueConstraint(columnNames = "category_name", name = "uk_skill_category_name") })
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Category {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "category_id")
	private int categoryId;

	@Column(name = "category_name", unique = true)
	private String categoryName;

}
