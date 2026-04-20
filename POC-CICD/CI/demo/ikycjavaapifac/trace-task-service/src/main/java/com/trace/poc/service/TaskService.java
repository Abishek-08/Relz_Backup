package com.trace.poc.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.trace.poc.dao.taskDao;
import com.trace.poc.modal.Task;

@Service
public class TaskService {

	private taskDao taskDao;

	public TaskService(com.trace.poc.dao.taskDao taskDao) {
		super();
		this.taskDao = taskDao;
	}

	public Task create(Task task) {
		return taskDao.save(task);
	}

	public List<Task> getAll() {
		return taskDao.findAll();

	}
}
