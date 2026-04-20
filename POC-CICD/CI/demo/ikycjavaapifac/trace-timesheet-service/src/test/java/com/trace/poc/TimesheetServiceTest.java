package com.trace.poc;

import com.trace.poc.client.ProjectFeignClient;
import com.trace.poc.modal.Project;
import com.trace.poc.modal.Timesheet;
import com.trace.poc.repo.TimeSheetRepo;
import com.trace.poc.service.TimesheetService;

import feign.FeignException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TimesheetServiceTest {

 @Mock
 private TimeSheetRepo timeSheetRepo;

 @Mock
 private ProjectFeignClient projectFeignClient;

 @InjectMocks
 private TimesheetService timesheetService;

 @BeforeEach
 void setUp() {
     MockitoAnnotations.openMocks(this);
 }

 @Test
 void testGetAll_ReturnsTimesheets() {
     Timesheet ts1 = new Timesheet();
     ts1.setTimesheetId("TS1");
     Timesheet ts2 = new Timesheet();
     ts2.setTimesheetId("TS2");

     when(timeSheetRepo.findAll()).thenReturn(List.of(ts1, ts2));

     List<Timesheet> result = timesheetService.getAll();

     assertEquals(2, result.size());
     assertEquals("TS1", result.get(0).getTimesheetId());
     assertEquals("TS2", result.get(1).getTimesheetId());
     verify(timeSheetRepo, times(1)).findAll();
 }

 // --- createTimeSheets ---
 @Test
 void testCreateTimeSheets_SavesListSuccessfully() {
     Timesheet ts1 = new Timesheet();
     ts1.setTimesheetId("TS1");
     Timesheet ts2 = new Timesheet();
     ts2.setTimesheetId("TS2");

     List<Timesheet> input = List.of(ts1, ts2);

     when(timeSheetRepo.saveAll(input)).thenReturn(input);

     List<Timesheet> result = timesheetService.createTimeSheets(input);

     assertEquals(2, result.size());
     verify(timeSheetRepo, times(1)).saveAll(input);
 }

 @Test
 void testGetAllProjects_ReturnsProjects() {
     Project project = new Project();
     project.setProjectId("P1");
     project.setProjectName("Demo Project");

     when(projectFeignClient.getAllProject()).thenReturn(List.of(project));

     List<Project> result = timesheetService.getAllProjects();

     assertEquals(1, result.size());
     assertEquals("P1", result.get(0).getProjectId());
     verify(projectFeignClient, times(1)).getAllProject();
 }

}
