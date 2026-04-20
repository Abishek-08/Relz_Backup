
// src/main/java/com/trace/poc/controller/controller/ProjectController.java
package com.trace.poc.controller.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import com.trace.poc.dao.ProjectRepository;
import com.trace.poc.modal.Project;
import com.trace.poc.service.impl.ProjectService;

@RestController
@RequestMapping("/projects")
public class ProjectControllerPoc {

    private final ProjectRepository projectRepository;
    private final ProjectService projectService;

    public ProjectControllerPoc(ProjectRepository projectRepository, ProjectService projectService) {
        this.projectRepository = projectRepository;
        this.projectService = projectService;
    }

    /** ✅ Idempotent create—reads Idempotency-Key sent by Timesheet producer */
    @PostMapping("/createProject")
    public Project createProject(
        @RequestHeader(value = "Idempotency-Key", required = false) String idemKey,
        @RequestBody Project project
    ) {
        return projectService.createIdempotent(idemKey, project);
    }
}
