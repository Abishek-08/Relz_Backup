package com.trace.poc;

import com.trace.poc.dao.taskDao;
import com.trace.poc.modal.Task;
import com.trace.poc.service.TaskService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {

 @Mock
 private taskDao taskDao;

 @InjectMocks
 private TaskService taskService;

 @BeforeEach
 void setUp() {
     MockitoAnnotations.openMocks(this);
 }

 @Test
 void testCreateTask_SavesSuccessfully() {
     Task task = new Task();
     task.setTaskId("T1");
     task.setTaskName("Demo Task");

     when(taskDao.save(any(Task.class))).thenReturn(task);

     Task result = taskService.create(task);

     assertNotNull(result);
     assertEquals("T1", result.getTaskId());
     assertEquals("Demo Task", result.getTaskName());
     verify(taskDao, times(1)).save(task);
 }

 @Test
 void testGetAll_ReturnsTasks() {
     Task task1 = new Task();
     task1.setTaskId("T1");
     task1.setTaskName("Task One");

     Task task2 = new Task();
     task2.setTaskId("T2");
     task2.setTaskName("Task Two");

     when(taskDao.findAll()).thenReturn(List.of(task1, task2));

     List<Task> result = taskService.getAll();

     assertEquals(2, result.size());
     assertEquals("T1", result.get(0).getTaskId());
     assertEquals("T2", result.get(1).getTaskId());
     verify(taskDao, times(1)).findAll();
 }
}
