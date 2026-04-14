package com.department.client;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name="staff-service", url="http://localhost:8022")
public interface StaffClient {

}
