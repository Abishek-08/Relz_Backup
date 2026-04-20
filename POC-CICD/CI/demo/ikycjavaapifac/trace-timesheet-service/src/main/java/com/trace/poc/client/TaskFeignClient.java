package com.trace.poc.client;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.trace.poc.modal.Task;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "trace-task-service", url="http://task-service")
public interface TaskFeignClient {

	@PostMapping(value = "/tasks", consumes = "application/json", produces = "application/json")
	Task createTask(@RequestBody Task task);
	
	@GetMapping(value = "/tasks")
	public List<Task> getall();
}
