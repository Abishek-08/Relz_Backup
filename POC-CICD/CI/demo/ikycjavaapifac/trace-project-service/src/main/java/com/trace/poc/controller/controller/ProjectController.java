package com.trace.poc.controller.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.trace.poc.controller.client.TaskFeignClient;
import com.trace.poc.dao.ProjectRepository;
import com.trace.poc.modal.Project;
import com.trace.poc.service.impl.ProjectService;

@RestController
@RequestMapping("/projects")
public class ProjectController {

	private final ProjectRepository projectRepository;

	private final ProjectService projectService;

	private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);

	public ProjectController(ProjectRepository projectRepository, ProjectService projectService) {
		this.projectRepository = projectRepository;
		this.projectService = projectService;

	}

	@PostMapping
	public Project createProject(@RequestBody Project project) {
		long start = System.currentTimeMillis();
		Project saved = projectRepository.save(project);
		long timeTaken = System.currentTimeMillis() - start;
		LOGGER.info("Controller= createProject","Time taken = {}", timeTaken);
		return (saved);
	}

	@GetMapping()
	public List<com.trace.poc.modal.Project> getall() {
		long start = System.currentTimeMillis();
		List<Project> projects = projectService.listAll();
		long timeTaken = System.currentTimeMillis() - start;
		LOGGER.info("Controller= getall","Time taken = {}", timeTaken);
		return(projects);
	}

	@GetMapping("/getProjects")
	public List<Project> getAllProjects() {
		long start = System.currentTimeMillis();
		List<Project> projects = projectService.listAllProjects();
		long timeTaken = System.currentTimeMillis() - start;
		LOGGER.info("Controller= ProjectController","Time taken = {}", timeTaken);
		return(projects);
	}
}
