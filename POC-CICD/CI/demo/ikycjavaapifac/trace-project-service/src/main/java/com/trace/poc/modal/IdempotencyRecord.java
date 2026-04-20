
// src/main/java/com/trace/poc/modal/IdempotencyRecord.java
package com.trace.poc.modal;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "idempotency_keys")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdempotencyRecord {
    @Id
    private String idempotencyKey;  // Header sent by Timesheet
    private String projectId;       // ID of the created project
    private long createdAtEpochMs;  // Optional timestamp
}
