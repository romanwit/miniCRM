package com.romanwit.minicrm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.SecurityFilterChain;

import com.romanwit.minicrm.controller.AuthController;
import com.romanwit.minicrm.model.User;
import com.romanwit.minicrm.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.romanwit.minicrm.util.JwtAuthenticationFilter;
import com.romanwit.minicrm.util.JwtTokenProvider;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthController.class); 
	
	//private final UserRepository userRepository;
	
	private final JwtTokenProvider jwtTokenProvider;
	
	private final UserDetailsServiceConfig userDetailsServiceConfig;

	//public SecurityConfig(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
    public SecurityConfig(UserDetailsServiceConfig userDetailsServiceConfig, JwtTokenProvider jwtTokenProvider) {
	    //this.userRepository = userRepository;
    	this.userDetailsServiceConfig = userDetailsServiceConfig;
	    this.jwtTokenProvider = jwtTokenProvider;
	}

	/*@Bean
	public UserDetailsService userDetailsService() {
	    return username -> {
	        User user = userRepository.findByUsername(username)
	                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
	        
	        logger.info("User found " + username);

	        return org.springframework.security.core.userdetails.User.builder()
	                .username(user.getUsername())
	                .password(user.getPassword())
	                .roles(user.getRole().getName()) 
	                .build();
	    };
	}*/


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //  HttpSecurity
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() 
            .authorizeHttpRequests(authz -> authz
            	.requestMatchers("/actuator/health").permitAll()
            	.requestMatchers("/", "/login", "/static/**").permitAll()
            	.requestMatchers("/api/login").permitAll() 
            	.requestMatchers("/api/auth/login").permitAll() 
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/user/**").hasRole("USER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), 
                    UsernamePasswordAuthenticationFilter.class)
            /*.formLogin(login -> login
                    .loginPage("/login") 
                    .permitAll()
                )*/
            .formLogin().disable()
            /*.formLogin(login -> login
                    .loginProcessingUrl("/api/login") 
                    .permitAll()
                )*/
            .logout(logout -> logout
                    .logoutUrl("/api/logout")
                    .permitAll()
                );


        return http.build();
    }

    //  AuthenticationManager
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = 
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
            .userDetailsService(userDetailsServiceConfig.userDetailsService())
            .passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }
}
