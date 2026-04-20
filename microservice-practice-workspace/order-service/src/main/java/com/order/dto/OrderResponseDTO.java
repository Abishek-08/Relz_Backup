package com.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {

	private int orderId;
	private int productId;
	private int quantity;
	private double totalPrice;

	// Product-Details

	private String productName;
	private double productPrice;

}
