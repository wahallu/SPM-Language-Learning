package com.qualityeducation.service;

import com.qualityeducation.dto.*;
import com.qualityeducation.model.User;
import com.qualityeducation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.time.Instant;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private EmailService emailService;
    
    public AuthResponse register(RegistrationRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse("Email already registered");
        }
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse("Username already taken");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLanguageToLearn(request.getLanguageToLearn());
        user.setLanguageKnown(request.getLanguageKnown());
        user.setRole("STUDENT"); // Set default role as STUDENT
        
        user = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtService.generateToken(user);
        
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole().toString(), "Registration successful");
    }
    
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return new AuthResponse("Invalid email or password");
        }
        
        User user = userOpt.get();
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse("Invalid email or password");
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(user);
        
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole().toString(), "Login successful");
    }
    
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            // Don't reveal that email doesn't exist for security reasons
            return new AuthResponse("If your email is registered, you will receive a password reset link");
        }
        
        User user = userOpt.get();
        
        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(Instant.now().plusSeconds(3600).getEpochSecond()); // Token valid for 1 hour
        
        userRepository.save(user);
        
        // Send email with reset link
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
        
        // Check if token has expired
        if (user.getResetTokenExpiry() < Instant.now().getEpochSecond()) {
            return new AuthResponse("Token has expired");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        
        userRepository.save(user);
        
        return new AuthResponse("Password has been reset successfully");
    }
}