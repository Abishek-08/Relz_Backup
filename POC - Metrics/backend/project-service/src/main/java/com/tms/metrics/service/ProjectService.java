package com.tms.metrics.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tms.metrics.config.SequenceGeneratorService;
import com.tms.metrics.exception.ResourceNotFoundException;
import com.tms.metrics.model.Project;
import com.tms.metrics.repo.ProjectRepo;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectService {

	private final ProjectRepo projectRepo;
	private final SequenceGeneratorService  sequenceGenerator;
	
	@CachePut(value = "ProjectCache", key = "#result.id")
	public Project createProject(Project project) {
		project.setId(sequenceGenerator.generateSequence("project-sequence"));
		return projectRepo.save(project);
	}
	@CachePut(value = "ProjectCache", key = "#p0")
	public Project updateProject(Long id,Project project) {
		Project projects = projectRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Project not found"));
		projects.setProjectName(project.getProjectName());
		projects.setCreatedAt(project.getCreatedAt());
		projects.setClosedAt(project.getClosedAt());
		projects.setActive(project.isActive());
		return projectRepo.save(projects);
	}
	@CacheEvict(value = "ProjectCache", key = "#p0")
	public void deleteProjectById(Long id) {
		projectRepo.deleteById(id);
	}
	
	
	public Project getProjectById(Long id) {
		return projectRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Project Not Found"));
	}
	
	
    public List<Project>getAllProjects(){
    	return projectRepo.findAll();
    }

	
}
