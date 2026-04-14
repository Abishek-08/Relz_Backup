package com.k8s.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.k8s.dao.UserDao;
import com.k8s.modal.User;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserDao userDao;

	@PostMapping
	public User insertUser(@RequestBody User user) {
		return userDao.save(user);

	}

	@DeleteMapping("/{userId}")
	public boolean deleteUser(@PathVariable int userId) {
		try {
			userDao.deleteById(userId);
			return true;
		} catch (Exception e) {
			System.out.println(e);
			return false;
		}
	}

	@GetMapping("/{userId}")
	public Optional<User> getUser(@PathVariable int userId) {
		return userDao.findById(userId);
	}

	@GetMapping
	public List<User> getAllUser() {
		return userDao.findAll();
	}

	@PutMapping
	public User updateUser(@RequestBody User user) {
		return userDao.save(user);

	}

}
