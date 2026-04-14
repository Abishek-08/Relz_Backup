package com.rts.cap.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author surya.boobalan
 * @since 27-06-2024
 * @version 1.0
 */

@Entity
@Getter
@Setter
@Table(name = "Batch")
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Batch {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int batchId;

	@Column(name = "batch_name")
	private String batchName;

	@Column(name = "batch_size")
	private int batchSize;
	
	@Column(name = "batch_description")
	private String batchDescription;

	@Column(name = "batch_creation_date", updatable = false)
	private String batchCreationDate;

	@Column(name = "batch_updation_date")
	private String batchUpdationDate;
	
	@Column(name = "batch_present_count")
	private int presentCount;

	@OneToMany(targetEntity = User.class, cascade = CascadeType.MERGE)
	@Column(name = "user_id")
	private List<User> user;

	@PrePersist
	protected void onCreate() {

		this.batchCreationDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
		this.batchUpdationDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

	}

}
