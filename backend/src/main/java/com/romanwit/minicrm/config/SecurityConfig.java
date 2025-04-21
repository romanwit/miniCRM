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

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(SecurityConfig.class);

    // private final UserRepository userRepository;

    private final JwtTokenProvider jwtTokenProvider;

    private final UserDetailsServiceConfig userDetailsServiceConfig;

    // public SecurityConfig(UserRepository userRepository, JwtTokenProvider
    // jwtTokenProvider) {
    public SecurityConfig(UserDetailsServiceConfig userDetailsServiceConfig, JwtTokenProvider jwtTokenProvider) {
        // this.userRepository = userRepository;
        this.userDetailsServiceConfig = userDetailsServiceConfig;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable()
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/", "/login", "/static/**").permitAll()
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/user/**").hasRole("USER")
                        .requestMatchers("/api/customers/**").hasAnyRole("ADMIN", "USER")
                        .anyRequest().authenticated())
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class)

                .formLogin().disable()

                .logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .permitAll());

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http
                .getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .userDetailsService(userDetailsServiceConfig.userDetailsService())
                .passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }
}
