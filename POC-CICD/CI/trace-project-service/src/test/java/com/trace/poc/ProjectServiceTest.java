package com.trace.poc;

import com.trace.poc.dao.ProjectRepository;
import com.trace.poc.controller.client.TaskFeignClient;
import com.trace.poc.dao.IdempotencyRepository;
import com.trace.poc.modal.Project;
import com.trace.poc.service.impl.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectServiceTest {

 @Mock
 private ProjectRepository projectRepository;

 @Mock
 private IdempotencyRepository idemRepo;

 @Mock
 private TaskFeignClient taskFeignClient;

 @InjectMocks
 private ProjectService projectService;

 @BeforeEach
 void setUp() {
     MockitoAnnotations.openMocks(this);
 }

 @Test
 void testGetById_ReturnsProject() {
     Project project = new Project();
     project.setProjectId("ID3");

     when(projectRepository.findById("ID3")).thenReturn(Optional.of(project));

     Optional<Project> result = projectService.getById("ID3");

     assertTrue(result.isPresent());
     assertEquals("ID3", result.get().getProjectId());
 }

 @Test
 void testListAll_ReturnsProjects() {
     Project project = new Project();
     project.setProjectId("ID4");

     when(projectRepository.findAll()).thenReturn(List.of(project));

     List<Project> result = projectService.listAll();

     assertEquals(1, result.size());
     assertEquals("ID4", result.get(0).getProjectId());
 }

 @Test
 void testDelete_CallsRepositoryDelete() {
     projectService.delete("ID6");
     verify(projectRepository, times(1)).deleteById("ID6");
 }
}

