package com.qualityeducation.service;

import com.qualityeducation.dto.*;
import com.qualityeducation.model.Supervisor;
import com.qualityeducation.repository.SupervisorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupervisorService {
    
    private final SupervisorRepository supervisorRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final EmailService emailService;
    
    public ApiResponse<SupervisorResponse> registerSupervisor(SupervisorRegistrationRequest request) {
        try {
            // Validate password confirmation
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ApiResponse.error("Passwords do not match");
            }
            
            // Check if email already exists
            if (supervisorRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.error("Email already registered");
            }
            
            // Create new supervisor
            Supervisor supervisor = new Supervisor();
            supervisor.setFirstName(request.getFirstName());
            supervisor.setLastName(request.getLastName());
            supervisor.setEmail(request.getEmail());
            supervisor.setPhone(request.getPhone());
            supervisor.setInstitution(request.getInstitution());
            supervisor.setDepartment(request.getDepartment());
            supervisor.setQualifications(request.getQualifications());
            supervisor.setExperience(request.getExperience());
            supervisor.setSpecialization(request.getSpecialization());
            supervisor.setPassword(passwordEncoder.encode(request.getPassword()));
            supervisor.setStatus(Supervisor.SupervisorStatus.PENDING);
            supervisor.setActive(false);
            supervisor.setEmployeeId(generateEmployeeId());
            supervisor.setCreatedAt(LocalDateTime.now());
            supervisor.setUpdatedAt(LocalDateTime.now());
            
            Supervisor savedSupervisor = supervisorRepository.save(supervisor);
            
            // Send email notification to admin about new registration
            emailService.sendSupervisorRegistrationNotification(savedSupervisor);
            
            // Send confirmation email to supervisor
            emailService.sendSupervisorRegistrationConfirmation(savedSupervisor.getEmail(), savedSupervisor.getFirstName());
            
            return ApiResponse.success(
                "Registration request submitted successfully! You will receive an email confirmation once your application is reviewed and approved.",
                SupervisorResponse.fromSupervisor(savedSupervisor)
            );
            
        } catch (Exception e) {
            return ApiResponse.error("Registration failed. Please try again.", e.getMessage());
        }
    }
    
    public ApiResponse<SupervisorLoginResponse> loginSupervisor(SupervisorLoginRequest request) {
        try {
            Optional<Supervisor> supervisorOpt = supervisorRepository.findByEmail(request.getEmail());
            
            if (supervisorOpt.isEmpty()) {
                return ApiResponse.error("Invalid credentials. Please try again.");
            }
            
            Supervisor supervisor = supervisorOpt.get();
            
            // Check if supervisor is approved and active
            if (supervisor.getStatus() != Supervisor.SupervisorStatus.APPROVED) {
                return ApiResponse.error("Your account is not approved yet. Please wait for admin approval.");
            }
            
            if (!supervisor.isActive()) {
                return ApiResponse.error("Your account is inactive. Please contact support.");
            }
            
            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), supervisor.getPassword())) {
                return ApiResponse.error("Invalid credentials. Please try again.");
            }
            
            // Update last login time
            supervisor.setLastLoginAt(LocalDateTime.now());
            supervisorRepository.save(supervisor);
            
            // Generate JWT token
            String token = generateJwtToken(supervisor);
            
            SupervisorLoginResponse loginResponse = new SupervisorLoginResponse();
            loginResponse.setSupervisor(SupervisorResponse.fromSupervisor(supervisor));
            loginResponse.setToken(token);
            loginResponse.setExpiresIn(request.isRememberMe() ? 2592000 : 86400); // 30 days or 1 day
            
            return ApiResponse.success("Login successful! Welcome to Supervisor Dashboard!", loginResponse);
            
        } catch (Exception e) {
            return ApiResponse.error("Login failed. Please try again.", e.getMessage());
        }
    }
    
    public ApiResponse<List<SupervisorResponse>> getAllSupervisors() {
        try {
            List<Supervisor> supervisors = supervisorRepository.findAll();
            List<SupervisorResponse> responses = supervisors.stream()
                .map(SupervisorResponse::fromSupervisor)
                .toList();
            
            return ApiResponse.success("Supervisors retrieved successfully", responses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve supervisors", e.getMessage());
        }
    }
    
    public ApiResponse<List<SupervisorResponse>> getPendingSupervisors() {
        try {
            List<Supervisor> pendingSupervisors = supervisorRepository.findByStatus(Supervisor.SupervisorStatus.PENDING);
            List<SupervisorResponse> responses = pendingSupervisors.stream()
                .map(SupervisorResponse::fromSupervisor)
                .toList();
            
            return ApiResponse.success("Pending supervisors retrieved successfully", responses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve pending supervisors", e.getMessage());
        }
    }
    
    public ApiResponse<SupervisorResponse> approveSupervisor(String supervisorId) {
        try {
            Optional<Supervisor> supervisorOpt = supervisorRepository.findById(supervisorId);
            
            if (supervisorOpt.isEmpty()) {
                return ApiResponse.error("Supervisor not found");
            }
            
            Supervisor supervisor = supervisorOpt.get();
            supervisor.setStatus(Supervisor.SupervisorStatus.APPROVED);
            supervisor.setActive(true);
            supervisor.setUpdatedAt(LocalDateTime.now());
            
            Supervisor updatedSupervisor = supervisorRepository.save(supervisor);
            
            // Send approval email to supervisor
            emailService.sendSupervisorApprovalEmail(supervisor.getEmail(), supervisor.getFirstName());
            
            return ApiResponse.success("Supervisor approved successfully", SupervisorResponse.fromSupervisor(updatedSupervisor));
            
        } catch (Exception e) {
            return ApiResponse.error("Failed to approve supervisor", e.getMessage());
        }
    }
    
    public ApiResponse<SupervisorResponse> rejectSupervisor(String supervisorId, String reason) {
        try {
            Optional<Supervisor> supervisorOpt = supervisorRepository.findById(supervisorId);
            
            if (supervisorOpt.isEmpty()) {
                return ApiResponse.error("Supervisor not found");
            }
            
            Supervisor supervisor = supervisorOpt.get();
            supervisor.setStatus(Supervisor.SupervisorStatus.REJECTED);
            supervisor.setUpdatedAt(LocalDateTime.now());
            
            Supervisor updatedSupervisor = supervisorRepository.save(supervisor);
            
            // Send rejection email to supervisor with reason
            emailService.sendSupervisorRejectionEmail(supervisor.getEmail(), supervisor.getFirstName(), reason);
            
            return ApiResponse.success("Supervisor rejected", SupervisorResponse.fromSupervisor(updatedSupervisor));
            
        } catch (Exception e) {
            return ApiResponse.error("Failed to reject supervisor", e.getMessage());
        }
    }
    
    public ApiResponse<SupervisorResponse> getSupervisorProfile(String supervisorId) {
        try {
            Optional<Supervisor> supervisorOpt = supervisorRepository.findById(supervisorId);
            
            if (supervisorOpt.isEmpty()) {
                return ApiResponse.error("Supervisor not found");
            }
            
            return ApiResponse.success("Profile retrieved successfully", SupervisorResponse.fromSupervisor(supervisorOpt.get()));
            
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve profile", e.getMessage());
        }
    }
    
    public ApiResponse<SupervisorResponse> updateSupervisorProfile(String supervisorId, SupervisorUpdateRequest request) {
        try {
            Optional<Supervisor> supervisorOpt = supervisorRepository.findById(supervisorId);
            
            if (supervisorOpt.isEmpty()) {
                return ApiResponse.error("Supervisor not found");
            }
            
            Supervisor supervisor = supervisorOpt.get();
            
            // Update fields
            if (request.getFirstName() != null) supervisor.setFirstName(request.getFirstName());
            if (request.getLastName() != null) supervisor.setLastName(request.getLastName());
            if (request.getPhone() != null) supervisor.setPhone(request.getPhone());
            if (request.getDepartment() != null) supervisor.setDepartment(request.getDepartment());
            if (request.getQualifications() != null) supervisor.setQualifications(request.getQualifications());
            if (request.getExperience() != null) supervisor.setExperience(request.getExperience());
            if (request.getSpecialization() != null) supervisor.setSpecialization(request.getSpecialization());
            
            supervisor.setUpdatedAt(LocalDateTime.now());
            
            Supervisor updatedSupervisor = supervisorRepository.save(supervisor);
            
            return ApiResponse.success("Profile updated successfully", SupervisorResponse.fromSupervisor(updatedSupervisor));
            
        } catch (Exception e) {
            return ApiResponse.error("Failed to update profile", e.getMessage());
        }
    }
    
    public ApiResponse<String> changePassword(String supervisorId, ChangePasswordRequest request) {
        try {
            Optional<Supervisor> supervisorOpt = supervisorRepository.findById(supervisorId);
            
            if (supervisorOpt.isEmpty()) {
                return ApiResponse.error("Supervisor not found");
            }
            
            Supervisor supervisor = supervisorOpt.get();
            
            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), supervisor.getPassword())) {
                return ApiResponse.error("Current password is incorrect");
            }
            
            // Validate new password confirmation
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ApiResponse.error("New passwords do not match");
            }
            
            // Update password
            supervisor.setPassword(passwordEncoder.encode(request.getNewPassword()));
            supervisor.setUpdatedAt(LocalDateTime.now());
            
            supervisorRepository.save(supervisor);
            
            return ApiResponse.success("Password changed successfully");
            
        } catch (Exception e) {
            return ApiResponse.error("Failed to change password", e.getMessage());
        }
    }
    
    private String generateEmployeeId() {
        return "SUP-" + java.time.Year.now().getValue() + "-" + 
               String.format("%04d", (int) (Math.random() * 10000));
    }
    
    private String generateJwtToken(Supervisor supervisor) {
        // This is a simplified token generation
        // In production, use proper JWT library like jjwt
        return UUID.randomUUID().toString() + "-" + supervisor.getId();
    }
}
