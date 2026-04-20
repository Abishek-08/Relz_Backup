package com.tms.metrics.feign;

import org.springframework.cloud.openfeign.FeignClient;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.tms.metrics.model.Task;

@FeignClient(name = "task-service", url = "http://192.168.49.2:30571")
public interface TaskClient {

    @GetMapping("/api/tasks/{id}")
    Task getTaskById(@PathVariable("id") Long id);
}
