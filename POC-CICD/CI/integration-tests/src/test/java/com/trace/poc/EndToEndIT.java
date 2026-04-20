
package com.trace.poc;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EndToEndIT {

	// Allow overriding via system properties or env for flexibility
	private static final String projectsBase = System.getProperty("projects.service.url",
			System.getenv().getOrDefault("PROJECTS_URL", "http://localhost:8081"));
	private static final String tasksBase = System.getProperty("tasks.service.url",
			System.getenv().getOrDefault("TASKS_URL", "http://localhost:8082"));
	private static final String timesheetBase = System.getProperty("timesheet.service.url",
			System.getenv().getOrDefault("TIMESHEET_URL", "http://localhost:8083"));

	@BeforeAll
	static void setup() {
		// Default; we will pass absolute URLs per request,
		// but this keeps RestAssured configured (timeouts, etc.)
		RestAssured.useRelaxedHTTPSValidation();
		RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
	}

	@Test
	void projectTaskTimesheetFlow() {
		// 1) Health checks (if your services expose /health or /actuator/health)
		Response projectsHealth = RestAssured.get(projectsBase + "/health");
		assertTrue(isOk(projectsHealth.statusCode()), "Projects service should be healthy");

		Response tasksHealth = RestAssured.get(tasksBase + "/health");
		assertTrue(isOk(tasksHealth.statusCode()), "Tasks service should be healthy");

		Response timesheetHealth = RestAssured.get(timesheetBase + "/health");
		assertTrue(isOk(timesheetHealth.statusCode()), "Timesheet service should be healthy");

		// 2) Create a Project

String newProjectBody = """
{
  "projectId": "BS-001",
  "projectName": "E2E Book Store",
  "projectCode": "BS-001",
  "accountName": "losini",
  "projectLocation": "Coimbatore, IN",
   "projectStartDate": "2025-12-01",
  "projectEndDate": "2026-06-30",
  "projectStatus": "ACTIVE",
  "createdAt": "2025-12-01T09:00:00",
  "modifiedAt": "2025-12-18T09:00:00"
}

				""";

		Response createProject = RestAssured.given().contentType(ContentType.JSON).body(newProjectBody)
				.post(projectsBase + "/projects");
		assertEquals(201, createProject.statusCode(), "Project creation should return 201");
		JsonPath projectJson = createProject.jsonPath();
		String projectId = projectJson.getString("id");
		assertNotNull(projectId, "Project id must be present");

		// 3) Create a Task under that Project

String newTaskBody = """
{
  "taskId": "TASK-0001",
  "taskType": "BACKLOG",          // or "FEATURE", "BUG", "CHORE" as per your domain
  "taskName": "Catalog import",
  "description": "Import initial catalog data from CSV",
  "createdAt": "2025-12-15T09:00:00",
  "modifiedAt": "2025-12-  "modifiedAt": "2025-12-15T09:00:00"
}

				""".formatted(projectId);

		Response createTask = RestAssured.given().contentType(ContentType.JSON).body(newTaskBody)
				.post(tasksBase + "/tasks");
		assertEquals(201, createTask.statusCode(), "Task creation should return 201");
		JsonPath taskJson = createTask.jsonPath();
		String taskId = taskJson.getString("id");
		assertNotNull(taskId, "Task id must be present");
		assertEquals(projectId, taskJson.getString("projectId"), "Task must reference the project");

		// 4) Create a Timesheet entry referencing the Task

String newTimesheetBody = """
{
  "timesheetId": "TS-0001",
  "timesheetDate": "2025-12-15",
  "timeEntry": 3.5,
  "notes": "E2E test run",
  "projectId": "%s",
  "taskId": "%s"
}
""".formatted(projectId, taskId);


		Response createTimesheet = RestAssured.given().contentType(ContentType.JSON).body(newTimesheetBody)
				.post(timesheetBase + "/timesheet");
		assertEquals(201, createTimesheet.statusCode(), "Timesheet creation should return 201");
		String timesheetId = createTimesheet.jsonPath().getString("id");
		assertNotNull(timesheetId, "Timesheet id must be present");

		// 5) Verify via GETs
		Response getProject = RestAssured.get(projectsBase + "/projects/" + projectId);
		assertEquals(200, getProject.statusCode(), "Should fetch created project");
		assertEquals("E2E Book Store", getProject.jsonPath().getString("name"));

		Response getTask = RestAssured.get(tasksBase + "/tasks/" + taskId);
		assertEquals(200, getTask.statusCode(), "Should fetch created task");
		assertEquals(projectId, getTask.jsonPath().getString("projectId"));

		Response getTimesheet = RestAssured.get(timesheetBase + "/timesheet/" + timesheetId);
		assertEquals(200, getTimesheet.statusCode(), "Should fetch created timesheet");
		assertEquals(taskId, getTimesheet.jsonPath().getString("taskId"));

		// Optional: List endpoints sanity check
		assertTrue(RestAssured.get(projectsBase + "/projects").statusCode() == 200, "Projects list should be 200");
		assertTrue(RestAssured.get(tasksBase + "/tasks").statusCode() == 200, "Tasks list should be 200");
		assertTrue(RestAssured.get(timesheetBase + "/timesheet").statusCode() == 200, "Timesheet list should be 200");
	}

	private boolean isOk(int status) {
		return status == 200 || status == 204; // some health endpoints return 204
	}

}