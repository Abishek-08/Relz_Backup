package com.inventory.service;

import org.springframework.stereotype.Service;

import com.inventory.model.Product;

@Service
public class InventoryService {

	public String getProductName() {
		Product product = new Product("Samsung Mobile");
		return product.getProductName();
	}

}
