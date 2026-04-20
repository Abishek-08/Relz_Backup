package com.product.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.product.modal.Product;
import com.product.repo.ProductRepo;

@Service
public class ProductService {

	@Autowired
	private ProductRepo productRepo;

	public Product addProduct(Product product) {
		return productRepo.save(product);
	}

	public List<Product> getAllProduct() {
		return productRepo.findAll();
	}

	public Product getProductById(int productId) {
		Product product = productRepo.findById(productId)
				.orElseThrow(() -> new RuntimeException("There is no product with ID: " + productId));
		return product;
	}

}
