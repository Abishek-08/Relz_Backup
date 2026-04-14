package com.rts.cap.dto;

import java.util.ArrayList;
import java.util.List;

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
public class UploadReportDto {
	 private int totalRows;
     private int successfulUploads;
     private List<SkippedRowDto> skippedRows;

     public UploadReportDto(int totalRows) {
         this.totalRows = totalRows;
         this.successfulUploads = 0;
         this.skippedRows = new ArrayList<>();
     }

     public void incrementSuccessfulUploads() {
         this.successfulUploads++;
     }

     public void addSkippedRow(int rowNumber, String reason) {
         this.skippedRows.add(new SkippedRowDto(rowNumber, reason));
     }
}
