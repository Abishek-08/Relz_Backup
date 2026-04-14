package com.rts.cap.dto;

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
public class UserDto {
	
	private String userName;
	private String userEmail;
	private String userMobile;
	private String userGender;

}
