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
import com.tms.metrics.model.Task;
import com.tms.metrics.service.TaskService;
import lombok.RequiredArgsConstructor;

/**
 * @author karpagam.boothanathan
 * @since 08-12-2025
 * @version 1.0
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TaskController {

private final TaskService taskService;
	
	@PostMapping
	public ResponseEntity<Task> createTask(@RequestBody Task task){
		return ResponseEntity.status(201).body(taskService.createTask(task));
	}
	
	@PutMapping("/{taskId}")
	public Task updateTask(@PathVariable("taskId") Long taskId, @RequestBody Task task) {
		return taskService.updateTask(taskId, task);
	}
	

	@GetMapping("/{taskId}")
	public Task getTaskById(@PathVariable("taskId") Long taskId) {
		return taskService.getTaskById(taskId);
	}
	
	
	@DeleteMapping("/{taskId}")
	public ResponseEntity<Void> deleteTask(@PathVariable("taskId") Long taskId) {
		taskService.deleteTaskById(taskId);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping
	public List<Task>getAllTasks(){
		return taskService.getAllTasks();
	}
	
}
