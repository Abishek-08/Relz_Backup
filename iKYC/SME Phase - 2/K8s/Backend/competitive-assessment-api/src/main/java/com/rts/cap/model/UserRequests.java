package com.rts.cap.model;

import com.rts.cap.constants.MessageConstants;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "user_request_tbl")
@ToString
public class UserRequests {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_request_id")
	private long userRequestId;

	@Column(name = "description")
	private String description;

	@Column(name = "request_status")
	private String requestStatus;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	@PrePersist
	protected void onCreate() {
		this.requestStatus = MessageConstants.USER_REQUEST_STATUS_PENDING;
	}

}
