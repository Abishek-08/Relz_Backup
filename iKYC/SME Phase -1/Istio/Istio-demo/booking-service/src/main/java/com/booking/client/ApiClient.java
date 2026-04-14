package com.booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.booking.model.ResponseModel;

@FeignClient(name="shipping-service", url = "http://shipping-service")
public interface ApiClient {
	
	@GetMapping("/shipping/get/response")
	ResponseModel getResponseFromShip(@RequestParam("input") String input); 
	

}
