package com.rts.cap.dto;

public class RunCodeResponseDto {
    private boolean successful;
    private String result;
    private String error;

    // Constructor
    public RunCodeResponseDto(boolean successful, String result, String error) {
        this.successful = successful;
        this.result = result;
        this.error = error;
    }

    // Getters and setters
    public boolean isSuccessful() {
        return successful;
    }

    public void setSuccessful(boolean successful) {
        this.successful = successful;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
