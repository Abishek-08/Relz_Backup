package com.mono.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mono.modal.Questions;

@Repository
public interface QuestionsDao extends JpaRepository<Questions, Integer> {

}
