package com.shipping.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name="inventory-service", url="http://inventory-service")
public interface InventoryAPIClient {
	
	@GetMapping("/inventory/get/product")
	String getProductName();

}
