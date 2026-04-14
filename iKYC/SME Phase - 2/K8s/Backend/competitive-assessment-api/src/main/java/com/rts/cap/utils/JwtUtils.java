package com.rts.cap.utils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.rts.cap.constants.MessageConstants;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

/**
 * @author sundharraj.soundharrajan
 * @since 06-08-2024
 * @version 2.0
 */

@Component
public class JwtUtils {

	private static final long EXPIRATION_TIME = MessageConstants.JWT_EXPIRATION_TIME;
	
	private JwtUtils() {
		
	}

	private static  SecretKey getKey() {
		String secretKey = MessageConstants.JWT_SECRET_KEY;
		byte[] keyBytes = Base64.getDecoder().decode(secretKey.getBytes(StandardCharsets.UTF_8));
		return new SecretKeySpec(keyBytes, MessageConstants.JWT_SECRET_KEY_ALGORITHM);

	}

	public static String generateToken(UserDetails userDetails) {

		return Jwts.builder().subject(userDetails.getUsername()).issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).signWith(getKey()).compact();

	}

	public static String refreshToken(Map<String, Object> claims, UserDetails userDetails) {
		return Jwts.builder().claims(claims).subject(userDetails.getUsername())
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).signWith(getKey()).compact();

	}

	public static String extractUsername(String token) {
		return extractClaims(token, Claims::getSubject);
	}

	private static <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {

		return claimsTFunction.apply(Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload());
	}

	public static boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = extractUsername(token);

		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));

	}

	private static boolean isTokenExpired(String token) {

		return extractClaims(token, Claims::getExpiration).before(new Date());
	}

}
