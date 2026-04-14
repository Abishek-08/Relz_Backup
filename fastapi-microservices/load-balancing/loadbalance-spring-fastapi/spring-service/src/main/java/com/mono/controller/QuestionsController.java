package com.mono.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mono.modal.Questions;
import com.mono.service.QuestionsService;

@RestController
@CrossOrigin("*")
@RequestMapping("/question")
public class QuestionsController {

	@Autowired
	private QuestionsService questionsService;

	@GetMapping("/allQuestion")
	public ResponseEntity<List<Questions>> getAllQuestions() {
		return ResponseEntity.ok(questionsService.getAllQuestions());
	}

	@PostMapping("/insertQuestion")
	public ResponseEntity<Questions> insertQuestions(@RequestBody Questions questions) {
		return ResponseEntity.ok(questionsService.insertQuestion(questions));

	}

}
