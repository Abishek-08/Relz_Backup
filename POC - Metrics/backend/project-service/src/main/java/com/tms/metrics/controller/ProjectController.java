package com.tms.metrics.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tms.metrics.model.Project;
import com.tms.metrics.service.ProjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProjectController {

private final ProjectService projectService;
	
	@PostMapping
	public ResponseEntity<Project> createProject(@RequestBody Project project){
		return ResponseEntity.status(201).body(projectService.createProject(project));
	}
	
	@PutMapping("/{id}")
	public Project updateProject(@PathVariable("id") Long id, @RequestBody Project project) {
		return projectService.updateProject(id, project);	
	}
	

	@GetMapping("/{id}")
	public Project getProjectById(@PathVariable("id") Long id) {
		return projectService.getProjectById(id);
	}
	
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProjects(@PathVariable("id") Long id) {
		projectService.deleteProjectById(id);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping
	public List<Project>getAllProjects(){
		return projectService.getAllProjects();
	}
	
}
