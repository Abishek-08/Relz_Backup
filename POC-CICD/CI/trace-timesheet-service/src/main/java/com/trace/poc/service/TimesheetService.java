package com.trace.poc.service;

import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Service;

import com.trace.poc.client.ProjectFeignClient;
import com.trace.poc.modal.Project;
import com.trace.poc.modal.Timesheet;
import com.trace.poc.repo.TimeSheetRepo;

@Service
public class TimesheetService {
	private final com.trace.poc.repo.TimeSheetRepo timeSheetRepo;
	
	private final ProjectFeignClient client;

	public TimesheetService(TimeSheetRepo timeSheetRepo, ProjectFeignClient client) {
		super();
		this.timeSheetRepo = timeSheetRepo;
		this.client = client;
	}

	public Timesheet create(Timesheet timesheet) {
		return timeSheetRepo.save(timesheet);

	}

	public List<Timesheet> getAll() {
		return timeSheetRepo.findAll();
	}

	public List<Timesheet> createTimeSheets(List<Timesheet> timesheets) {
		return timeSheetRepo.saveAll(timesheets);
	}
	

public List<Project> getAllProjects() {
    try {
        return client.getAllProject();
    } catch (feign.FeignException e) {
        System.err.println("Feign call failed: " + e.getMessage());
        throw e;
    }
}


	

}
