package com.trace.poc.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

	private static final Logger LOGGER = LoggerFactory.getLogger(TimesheetController.class);

	public TimesheetController(TimesheetService timesheetService) {
		super();
		this.timesheetService = timesheetService;
	}

	// Create a timesheet
	@PostMapping
	public ResponseEntity<Timesheet> createTimeSheet(@RequestBody Timesheet timesheet) {
		long start = System.currentTimeMillis();
		Timesheet created = timesheetService.create(timesheet);
		long timeTaken = System.currentTimeMillis() - start;
		LOGGER.info("Controller= TimesheetController", "Time taken = {}", timeTaken);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@PostMapping("/all")
	public ResponseEntity<List<Timesheet>> createTimeSheets(@RequestBody List<Timesheet> timesheet) {
		long start = System.currentTimeMillis();
		List<Timesheet> createdSheets = timesheetService.createTimeSheets(timesheet);
		long timeTaken = System.currentTimeMillis() - start;
		LOGGER.info("Controller= TimesheetController", "Time taken = {}", timeTaken);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdSheets);
	}

	// List all timesheets
	@GetMapping
	public List<Timesheet> getAllTimeSheets() {
		long start = System.currentTimeMillis();
		List<Timesheet> timesheets = timesheetService.getAll();
		long timeTaken = System.currentTimeMillis() - start;
		LOGGER.info("Controller= TimesheetController", "Time taken = {}", timeTaken);
		return timesheets;
	}

}
