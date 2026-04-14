package com.shipping.service;

import org.springframework.stereotype.Service;

import com.shipping.client.BookingAPIClient;
import com.shipping.client.InventoryAPIClient;
import com.shipping.model.ResponseModel;

@Service
public class ShippingService {

	private final BookingAPIClient bookingAPIClient;
	private final InventoryAPIClient inventoryAPIClient;

	public ShippingService(BookingAPIClient bookingAPIClient, InventoryAPIClient inventoryAPIClient) {
		super();
		this.bookingAPIClient = bookingAPIClient;
		this.inventoryAPIClient = inventoryAPIClient;
	}

	public ResponseModel getResponse(String input) {
		ResponseModel responseModel = new ResponseModel(
				"Message from Shipping-service, accessed through the booking service: " + input);

		return responseModel;
	}

	public String getBookingInfo(String info) {
		return bookingAPIClient.getResponseFromBooking(info);
	}

	public String getProductName() {
		return inventoryAPIClient.getProductName();
	}

}
