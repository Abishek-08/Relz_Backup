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
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "user_skill_links_tbl")
public class SkillAndLinks {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="skills_id")
	private long skillsId;
	
	@Column(name="skills")
	private String skills;
	
	@Column(name="gitHub_link")
	private String gitHubLink;
	
	@Column(name="linked_in")
	private String linkedIn;
	
	@Column(name="portfolio")
	private String portfolio;
	
	@ManyToOne
	@JoinColumn(name="userId")
	private User user;
	
	
}