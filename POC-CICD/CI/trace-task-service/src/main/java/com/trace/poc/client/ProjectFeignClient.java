package com.trace.poc.client;
import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.trace.poc.modal.Project;

@FeignClient(name = "trace-project-service", url="http://project-service")
public interface ProjectFeignClient {


	@PostMapping(value = "/projects", consumes = "application/json", produces = "application/json")
	Project create(@RequestBody Project project);
	
	@GetMapping(value = "/projects")
	public List<Project> getall();
}



