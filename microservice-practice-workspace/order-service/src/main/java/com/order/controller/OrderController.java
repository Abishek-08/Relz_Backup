package com.order.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.order.dto.OrderResponseDTO;
import com.order.dto.ProductDTO;
import com.order.modal.Order;
import com.order.repo.OrderRepo;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/orders")
public class OrderController {

	@Autowired
	private OrderRepo orderRepo;

	@Autowired
	private WebClient.Builder webClientBuilder;

	// Method to place an order
	@PostMapping("/placeorder")
	public Mono<ResponseEntity<OrderResponseDTO>> placeOrder(@RequestBody Order order) {

		// Fetch product details from product service

		return webClientBuilder.build().get().uri("http://localhost:8081/products/" + order.getProductId()).retrieve()
				.bodyToMono(ProductDTO.class).map(productDTO -> {
					OrderResponseDTO orderResponseDTO = new OrderResponseDTO();
					orderResponseDTO.setOrderId(order.getOrderId());
					orderResponseDTO.setProductId(order.getProductId());
					orderResponseDTO.setQuantity(order.getQunatity());

					// set product details
					orderResponseDTO.setProductName(productDTO.getProductName());
					orderResponseDTO.setProductPrice(productDTO.getProductPrice());
					orderResponseDTO.setTotalPrice(productDTO.getProductPrice() * order.getQunatity());

					// save order to DB
					orderRepo.save(order);
					return ResponseEntity.ok(orderResponseDTO);

				});
	}

	@GetMapping("/allorders")
	public List<Order> getAllOrder() {
		return orderRepo.findAll();
	}

}
