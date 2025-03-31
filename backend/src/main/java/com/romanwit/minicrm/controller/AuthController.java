package com.romanwit.minicrm.controller;

import com.romanwit.minicrm.dto.LoginRequest;
import com.romanwit.minicrm.dto.AuthResponse;
import com.romanwit.minicrm.service.UserService;
import com.romanwit.minicrm.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.GrantedAuthority;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {

            logger.info("Attempting to authenticate user: " + loginRequest.getUsername());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("No role");

            logger.info("User role {}: {}", loginRequest.getUsername(), role);

            String token = jwtTokenProvider.generateToken(userDetails);
            return ResponseEntity.ok(new AuthResponse(token, role));

        } catch (BadCredentialsException e) {
            logger.info("Bad credentials");

            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (DisabledException e) {
            return ResponseEntity.status(403).body("User account is disabled");
        } catch (Exception e) {
            logger.error("Authentication failed due to an exception", e);
            return ResponseEntity.status(500).body("Authentication failed");
        }
    }
}
