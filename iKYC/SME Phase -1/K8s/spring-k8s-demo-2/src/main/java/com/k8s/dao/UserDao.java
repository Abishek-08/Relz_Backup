package com.k8s.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.k8s.modal.User;

@Repository
public interface UserDao extends JpaRepository<User, Integer> {

}
