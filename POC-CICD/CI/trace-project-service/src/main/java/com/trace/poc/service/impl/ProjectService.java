
// src/main/java/com/trace/poc/service/impl/ProjectService.java
package com.trace.poc.service.impl;

import org.springframework.stereotype.Service;

import com.trace.poc.dao.ProjectRepository;
import com.trace.poc.controller.client.TaskFeignClient;
import com.trace.poc.dao.IdempotencyRepository;
import com.trace.poc.modal.Project;
import com.trace.poc.modal.IdempotencyRecord;

import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.util.StringUtils;

// ★ Resilience4j annotation
import io.github.resilience4j.retry.annotation.Retry;
// Optional logging (slf4j)
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ProjectService {

    // Toggle-based failure to simulate transient errors for GET
    private static boolean state = false;

    // DEMO: per-projectCode attempt counter to simulate transient failures for POST
    private static final ConcurrentHashMap<String, Integer> postAttempts = new ConcurrentHashMap<>();

    private final ProjectRepository repo;
    private final IdempotencyRepository idemRepo;
    private static final Tracer tracer = GlobalOpenTelemetry.getTracer("com.trace.poc");
    private final TaskFeignClient taskFeignClient;
    public ProjectService(ProjectRepository repo, IdempotencyRepository idemRepo,TaskFeignClient taskFeignClient) {
        this.repo = repo;
        this.idemRepo = idemRepo;
		this.taskFeignClient = taskFeignClient;
    }

    /** ✅ Idempotent create using Idempotency-Key so caller retries don't duplicate
     *  Resilience4j retry is applied here; see application.properties/yaml instance: createProjectRetry
     */
    @Retry(name = "createProjectRetry") // <-- binds to resilience4j.retry.instances.createProjectRetry
    public Project createIdempotent(String idemKey, Project project) {

        // ---------- DEMO transient failure (fail twice per projectCode) ----------
        // Remove this block after you confirm retries work; replace with real transient error handling.
        String codeKey = (project != null && project.getProjectCode() != null)
                ? project.getProjectCode()
                : "UNKNOWN_CODE";

        int attempt = postAttempts.merge(codeKey, 1, Integer::sum);
        if (attempt <= 2) {
            log.warn("Simulated transient failure on POST create for projectCode={} attempt={}", codeKey, attempt);
            // Throw a retryable exception type as per your config (RuntimeException covered if you included it)
            throw new RuntimeException("Simulated transient error");
        }
        // ------------------------------------------------------------------------

        // Idempotency read: if we already processed this Idempotency-Key, return the same saved project
        if (StringUtils.hasText(idemKey)) {
            var existing = idemRepo.findById(idemKey);
            if (existing.isPresent()) {
                return repo.findById(existing.get().getProjectId())
                        .orElseThrow(() -> new IllegalStateException("Idempotency record points to missing project"));
            }
        }

//        Span span = tracer.spanBuilder("Saving Project").startSpan();
//        try {
//            span.setAttribute("project.code", project.getProjectCode());
//            span.setAttribute("operation", "save");

            if (project.getCreatedAt() == null) {
                project.setCreatedAt(LocalDateTime.now());
            }
            project.setModifiedAt(LocalDateTime.now());
//        } catch (Exception e) {
//            span.recordException(e);
//            span.setStatus(io.opentelemetry.api.trace.StatusCode.ERROR);
//            throw e;
//        } finally {
//            span.end();
//        }

        Project saved = repo.save(project);

        if (StringUtils.hasText(idemKey)) {
            idemRepo.save(IdempotencyRecord.builder()
                    .idempotencyKey(idemKey)
                    .projectId(saved.getProjectId())
                    .createdAtEpochMs(Instant.now().toEpochMilli())
                    .build());
        }

        log.info("createProject succeeded for projectCode={} on attempt={}", codeKey, attempt);
        return saved;
    }

    public Optional<Project> getById(String id) {
        return repo.findById(id);
    }
    public List<Project> listAll() {
        Span span = tracer.spanBuilder("Listing Projects").startSpan();
        try {
            span.setAttribute("operation", "get");
            span.setAttribute("service", "project");
        } catch (Exception e) {
            span.recordException(e);
            span.setStatus(io.opentelemetry.api.trace.StatusCode.ERROR);
            throw e;
        } finally {
            span.end();
        }
        return repo.findAll();
    }

    /** POC: flip-flop failure to trigger Timesheet retries on GET /projects/getProjects */
    @Retry(name = "createProjectRetry") 
    public List<Project> listAllProjects() {
    	taskFeignClient.getall();
        Span span = tracer.spanBuilder("Listing Projects (POC)").startSpan();
        try {
            if (state) {
                state = false; // next call will succeed
                throw new RuntimeException("Simulated failure");
            } else {
                state = true; // next call will fail
            }
            span.setAttribute("operation", "get");
            span.setAttribute("service", "project");
        } catch (Exception e) {
            span.recordException(e);
            span.setStatus(io.opentelemetry.api.trace.StatusCode.ERROR);
            throw e;
        } finally {
            span.end();
        }
        return repo.findAll();
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
