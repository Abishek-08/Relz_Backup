package com.trace.poc.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trace.poc.modal.Task;

import com.trace.poc.service.TaskService;
@RestController
@RequestMapping("/tasks")
public class TaskController {

	private TaskService taskService;

	public TaskController(TaskService taskService) {
		super();
		this.taskService = taskService;
	}

	@PostMapping
	public Task createTask(@RequestBody Task task) {
		return taskService.create(task);
	}

	// Get all tasks
	@GetMapping
	public List<Task> getAllTask() {
		return taskService.getAll();
	}

}
