package com.rts.cap.dto;

import com.rts.cap.model.Login;
import com.rts.cap.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {
	
	private User user;
	private Login login;
	private String token;
	private String refreshToken;
	private String expirationTime;
	private int count;

}
