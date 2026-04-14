package com.mono.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mono.dao.QuestionsDao;
import com.mono.modal.Questions;

@Service
public class QuestionsService {
	
	@Autowired
	private QuestionsDao questionsDao; 
	
	public List<Questions> getAllQuestions() {
		return questionsDao.findAll();
	}
	
	public Questions insertQuestion(Questions question) {
		return questionsDao.save(question);
	}

}
