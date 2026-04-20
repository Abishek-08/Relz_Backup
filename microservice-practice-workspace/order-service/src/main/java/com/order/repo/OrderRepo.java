package com.order.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.order.modal.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {

}
