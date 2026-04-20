package com.trace.poc.controller.controller;

import java.util.List;

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

	public ProjectController(ProjectRepository projectRepository,ProjectService projectService) {
		this.projectRepository = projectRepository;
		this.projectService = projectService;
		
	}

	@PostMapping
	public Project createProject(@RequestBody Project project) {
		return projectRepository.save(project);
	}

	@GetMapping()
	public List<com.trace.poc.modal.Project> getall() {
		return projectService.listAll();
	}
	
	@GetMapping("/getProjects")
	public List<Project> getAllProjects() {
		return projectService.listAllProjects();
	}
}
