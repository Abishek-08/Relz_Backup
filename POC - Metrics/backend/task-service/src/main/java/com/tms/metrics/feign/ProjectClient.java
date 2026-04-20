package com.tms.metrics.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.tms.metrics.model.Project;

@FeignClient(name = "project-service", url = "http://192.168.49.2:30130")
public interface ProjectClient {

    @GetMapping("/api/projects/{id}")
    Project getProjectById(@PathVariable("id") Long id);
}
