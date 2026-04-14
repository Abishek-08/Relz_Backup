package com.rts.cap.controller;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import com.rts.cap.model.Batch;

@SpringBootTest
class BatchControllerTest {

	@Autowired
	private BatchController batchController;
	
	
	
	@Test
	@Disabled("Build purpose")
	void TestViewAllBatch() {
		List<Batch> batch = batchController.getAllBatch();
		assertNotNull(batch);
	}
	
	@Test
	@Disabled("Build purpose")
	void TestGetBatchUsingId() {
		Batch batch = batchController.getBatchUsingBatchId(1);
		assertNotNull(batch);
	}
	
	@Test
	@Disabled("Build purpose")
	void TestDeleteBatchUsingId() {
		
		ResponseEntity<?> batchDelete = batchController.deleteBatch(1);
		assertEquals(HttpStatusCode.valueOf(200), batchDelete.getStatusCode());
	}
	
	@Test
	@Disabled("Build purpose")
	void TestVerifyBatchName() {
		ResponseEntity<?> nameVerify = batchController.verifyBatchName("Batch 1");
		assertEquals(HttpStatusCode.valueOf(200), nameVerify.getStatusCode());
	}

}
