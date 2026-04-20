package com.tms.metrics.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tms.metrics.config.SequenceGeneratorService;
import com.tms.metrics.exception.ResourceNotFoundException;
import com.tms.metrics.feign.EmployeeClient;
import com.tms.metrics.feign.ProjectClient;
import com.tms.metrics.model.Employee;
import com.tms.metrics.model.Project;
import com.tms.metrics.model.Task;
import com.tms.metrics.repo.TaskRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TaskService {
	

	private final TaskRepo taskRepo;
	private final EmployeeClient employeeClient;
    private final ProjectClient projectClient;
	private final SequenceGeneratorService  sequenceGenerator;
	
	
	
	@CachePut(value = "taskCache", key = "#result.taskId")
	public Task createTask(Task task) {
		task.setTaskId(sequenceGenerator.generateSequence("task-sequence"));
		Employee emp = employeeClient.getEmployeeById(task.getEmployeeId());
		log.info("Assigning task to employee: {}", emp.getEmployeeName());
		Project proj = projectClient.getProjectById(task.getProjectId());
        log.info("Task belongs to project: {}", proj.getProjectName());
		return taskRepo.save(task);
	}
	
	@CachePut(value = "taskCache", key = "#p0")
	public Task updateTask(Long taskId,Task task) {
		Task existingtasks = taskRepo.findById(taskId).orElseThrow(()-> new ResourceNotFoundException("Task not found"));
		existingtasks.setTaskName(task.getTaskName());
		existingtasks.setEmployeeId(task.getEmployeeId());
		existingtasks.setProjectId(task.getProjectId());
		return taskRepo.save(existingtasks);
	}
	@CacheEvict(value = "taskCache", key = "#p0")
	public void deleteTaskById(Long taskId) {
		
		taskRepo.deleteById(taskId);
	}
	
	@CachePut(value = "taskCache",key = "#p0", unless = "#result == null")
	public Task getTaskById(Long taskId) {
		return taskRepo.findById(taskId).orElseThrow(()-> new ResourceNotFoundException("Task Not Found"));
	}
	
	
    public List<Task>getAllTasks(){
    	return taskRepo.findAll();
    }

}
