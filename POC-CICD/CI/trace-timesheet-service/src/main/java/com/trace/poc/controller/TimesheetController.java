package com.trace.poc.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.trace.poc.modal.Timesheet;
import com.trace.poc.service.TimesheetService;
@RequestMapping("/timesheet")
@RestController
public class TimesheetController {

	private TimesheetService timesheetService;
	
	

	public TimesheetController(TimesheetService timesheetService) {
	super();
	this.timesheetService = timesheetService;
}

	// Create a timesheet
	@PostMapping
	public ResponseEntity<Timesheet> createTimeSheet(@RequestBody Timesheet timesheet) {
		Timesheet created = timesheetService.create(timesheet);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}
	@PostMapping("/all")
	public ResponseEntity<List<Timesheet>> createTimeSheets(@RequestBody List<Timesheet> timesheet) {
		List<Timesheet> createdSheets = timesheetService.createTimeSheets(timesheet);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdSheets);
	}

	// List all timesheets
	@GetMapping
	public List<Timesheet> getAllTimeSheets() {
		return timesheetService.getAll();
	}

}
