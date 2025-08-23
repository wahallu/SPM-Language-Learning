package com.qualityeducation.service;

import com.qualityeducation.dto.*;
import com.qualityeducation.model.User;
import com.qualityeducation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    
    public ApiResponse<UserLoginResponse> register(RegistrationRequest request) {
        try {
            log.info("Attempting to register user with email: {}", request.getEmail());
            
            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.error("Email already registered", null);
            }
            
            // Check if username already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                return ApiResponse.error("Username already taken", null);
            }
            
            // Create new user
            User user = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .languageToLearn(request.getLanguageToLearn())
                    .languageKnown(request.getLanguageKnown())
                    .role("STUDENT")
                    .currentLevel(1)
                    .totalXP(0)
                    .currentStreak(0)
                    .build();
            
            User savedUser = userRepository.save(user);
            log.info("User registered successfully with ID: {}", savedUser.getId());
            
            // Generate JWT token
            String token = jwtService.generateToken(savedUser);
            
            // Create response
            UserResponse userResponse = convertToResponse(savedUser);
            UserLoginResponse loginResponse = UserLoginResponse.builder()
                    .token(token)
                    .user(userResponse)
                    .build();
            
            return ApiResponse.success("Registration successful", loginResponse);
            
        } catch (Exception e) {
            log.error("User registration failed for email: {}", request.getEmail(), e);
            return ApiResponse.error("Registration failed: " + e.getMessage(), null);
        }
    }
    
    public ApiResponse<UserLoginResponse> login(LoginRequest request) {
        try {
            log.info("Attempting user login for email: {}", request.getEmail());
            
            // Find user by email
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
            if (userOptional.isEmpty()) {
                return ApiResponse.error("Invalid email or password", null);
            }
            
            User user = userOptional.get();
            
            // Check if user is active
            if (user.getStatus() != User.UserStatus.ACTIVE) {
                String message = switch (user.getStatus()) {
                    case INACTIVE -> "Your account is inactive. Please contact support.";
                    case SUSPENDED -> "Your account has been suspended. Please contact support.";
                    default -> "Your account is not active. Please contact support.";
                };
                return ApiResponse.error(message, null);
            }
            
            // Authenticate user
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
                
                // Update last login time
                user.setLastLoginAt(LocalDateTime.now());
                userRepository.save(user);
                
                // Generate JWT token
                String token = jwtService.generateToken(user);
                
                // Create response
                UserResponse userResponse = convertToResponse(user);
                UserLoginResponse loginResponse = UserLoginResponse.builder()
                        .token(token)
                        .user(userResponse)
                        .build();
                
                log.info("User login successful for email: {}", request.getEmail());
                return ApiResponse.success("Login successful", loginResponse);
                
            } catch (AuthenticationException e) {
                log.warn("Authentication failed for user email: {}", request.getEmail());
                return ApiResponse.error("Invalid email or password", null);
            }
            
        } catch (Exception e) {
            log.error("User login failed for email: {}", request.getEmail(), e);
            return ApiResponse.error("Login failed: " + e.getMessage(), null);
        }
    }
    
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return new AuthResponse("If your email is registered, you will receive a password reset link");
        }
        
        User user = userOpt.get();
        
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(Instant.now().plusSeconds(3600).getEpochSecond());
        
        userRepository.save(user);
        
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        
        return new AuthResponse("If your email is registered, you will receive a password reset link");
    }
    
    public AuthResponse resetPassword(ResetPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByResetToken(request.getToken());
        
        if (userOpt.isEmpty()) {
            return new AuthResponse("Invalid or expired token");
        }
        
        User user = userOpt.get();
        
        if (user.getResetTokenExpiry() < Instant.now().getEpochSecond()) {
            return new AuthResponse("Token has expired");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        
        userRepository.save(user);
        
        return new AuthResponse("Password has been reset successfully");
    }
    
    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .email(user.getEmail())
                .languageToLearn(user.getLanguageToLearn())
                .languageKnown(user.getLanguageKnown())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .profileImage(user.getProfileImage())
                .bio(user.getBio())
                .currentLevel(user.getCurrentLevel())
                .totalXP(user.getTotalXP())
                .currentStreak(user.getCurrentStreak())
                .status(UserResponse.UserStatus.valueOf(user.getStatus().name()))
                .build();
    }
}