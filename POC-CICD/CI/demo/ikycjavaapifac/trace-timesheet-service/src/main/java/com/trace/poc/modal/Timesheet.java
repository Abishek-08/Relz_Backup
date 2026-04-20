package com.trace.poc.modal;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "timesheets")
public class Timesheet {

	@Id
	private String timesheetId;

	private Date timesheetDate;
	private Float timeEntry;
	private String notes;

	@Indexed
	private String projectId;

	@Indexed
	private String taskId;
}
