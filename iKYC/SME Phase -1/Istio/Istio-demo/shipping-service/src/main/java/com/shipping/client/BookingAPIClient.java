package com.shipping.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="booking-service", url="http://booking-service")
public interface BookingAPIClient {
	
	@GetMapping("/booking/bookinfo/{bookinfo}")
	String getResponseFromBooking(@PathVariable("bookinfo") String bookInfo);

}
