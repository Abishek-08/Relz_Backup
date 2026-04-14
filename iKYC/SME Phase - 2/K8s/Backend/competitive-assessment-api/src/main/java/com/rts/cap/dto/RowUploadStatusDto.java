package com.rts.cap.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author prasanth.baskaran 
 * @since 28-06-2024
 * @version 1.0
 */


@Getter
@Setter
@ToString
public class RowUploadStatusDto {
	 private boolean success;
     private String reason;

     public RowUploadStatusDto(boolean success, String reason) {
         this.success = success;
         this.reason = reason;
     }

     public boolean isSuccess() {
         return success;
     }

     public String getReason() {
         return reason;
     }

}
