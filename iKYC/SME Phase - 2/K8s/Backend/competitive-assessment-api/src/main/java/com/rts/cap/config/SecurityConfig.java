package com.rts.cap.config;
 
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
 
import com.rts.cap.filter.AuthenticationFilter;
import com.rts.cap.service.impl.LoginSecurityService;
 
/**
* @author sundharraj.soundharrajan
* @since 06-08-2024
* @version 2.0
*/
 
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
 
	private final AuthenticationFilter filter;
	private final LoginSecurityService service;
 
	public SecurityConfig(AuthenticationFilter filter, LoginSecurityService service) {
		this.filter = filter;
		this.service = service;
	}
 
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable).cors(Customizer.withDefaults())
				.authorizeHttpRequests(request -> request
						.requestMatchers("/login/**", "/cap/**").permitAll()
						.requestMatchers("resend/**").permitAll()
						.requestMatchers("otp/**").permitAll()
						.requestMatchers("/resend/**").permitAll()
						.requestMatchers("/reset/**").permitAll()
						.requestMatchers("/security/**").permitAll()
						.requestMatchers("/user/request/**").permitAll()
						.requestMatchers("/user/user**").permitAll()
						.requestMatchers("/skill/downloadzipfile").permitAll()
						.requestMatchers("/user/validate/**").permitAll()
						.requestMatchers("/user/**").permitAll()
						.requestMatchers("/report/**").permitAll()
						.anyRequest().authenticated())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(authenticationProvider())
				.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
 
		return http.build();
	}
 
	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(service);
		provider.setPasswordEncoder(passwordEncoder());
		return provider;
	}
 
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
 
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
}