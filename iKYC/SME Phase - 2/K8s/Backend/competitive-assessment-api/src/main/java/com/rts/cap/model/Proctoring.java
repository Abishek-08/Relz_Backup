package com.rts.cap.model;

/**
 * @author jothilingam.a
 * @since 19-07-2024
 * @version 1.0
 */
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "proctoring_tbl")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Proctoring {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int proctoringId;
	
	@Column(name = "copy_paste_warning")
	private boolean copyPasteWarning;

	@Column(name = "tab_switching_warning")
	private boolean tabSwitchingWarning;
	
	@Column(name = "camera_proctoring")
	private boolean cameraProctoring;
	
	@Column(name = "audio_proctoring")
	private boolean audioProctoring;
	
	@Column(name = "violation_count")
	private int violationCount;

	@OneToOne
	@JoinColumn(name = "assessment_id")
	private Assessment assessment;

}
