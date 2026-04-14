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
public class SkippedRowDto {
	 private int rowNumber;
     private String reason;

     public SkippedRowDto(int rowNumber, String reason) {
         this.rowNumber = rowNumber;
         this.reason = reason;
     }

}

