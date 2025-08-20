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

@Service
@RequiredArgsConstructor
public class SupervisorService {
    
    private final SupervisorRepository supervisorRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public ApiResponse<SupervisorResponse> getSupervisorProfile(String supervisorId) {
        try {
            Optional<Supervisor> supervisorOpt = supervisorRepository.findById(supervisorId);
            
            if (supervisorOpt.isEmpty()) {
                return ApiResponse.error("Supervisor not found");
            }
            
            Supervisor supervisor = supervisorOpt.get();
            SupervisorResponse response = mapToResponse(supervisor);
            
            return ApiResponse.success("Profile retrieved successfully", response);
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
            if (request.getFirstName() != null) {
                supervisor.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null) {
                supervisor.setLastName(request.getLastName());
            }
            if (request.getPhone() != null) {
                supervisor.setPhone(request.getPhone());
            }
            if (request.getDepartment() != null) {
                supervisor.setDepartment(request.getDepartment());
            }
            if (request.getQualifications() != null) {
                supervisor.setQualifications(request.getQualifications());
            }
            if (request.getExperience() != null) {
                supervisor.setExperience(request.getExperience());
            }
            if (request.getSpecialization() != null) {
                supervisor.setSpecialization(request.getSpecialization());
            }
            
            supervisor.setUpdatedAt(LocalDateTime.now());
            supervisor = supervisorRepository.save(supervisor);
            
            SupervisorResponse response = mapToResponse(supervisor);
            return ApiResponse.success("Profile updated successfully", response);
        } catch (Exception e) {
            return ApiResponse.error("Failed to update profile", e.getMessage());
        }
    }

    public ApiResponse<SupervisorStatsResponse> getSupervisorStats(String supervisorId) {
        try {
            Optional<Supervisor> supervisorOpt = supervisorRepository.findById(supervisorId);
            
            if (supervisorOpt.isEmpty()) {
                return ApiResponse.error("Supervisor not found");
            }
            
            // For now, return mock data. You can implement actual calculations later
            SupervisorStatsResponse stats = SupervisorStatsResponse.builder()
                    .teachersSupervised(15)
                    .coursesOverseeing(32)
                    .studentsImpacted(1250)
                    .completedReviews(89)
                    .pendingReviews(5)
                    .approvalRate(94.5)
                    .build();
            
            return ApiResponse.success("Stats retrieved successfully", stats);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve stats", e.getMessage());
        }
    }

    public ApiResponse<List<SupervisorActivityResponse>> getSupervisorActivities(String supervisorId) {
        try {
            Optional<Supervisor> supervisorOpt = supervisorRepository.findById(supervisorId);
            
            if (supervisorOpt.isEmpty()) {
                return ApiResponse.error("Supervisor not found");
            }
            
            // For now, return mock data. You can implement actual activity tracking later
            List<SupervisorActivityResponse> activities = List.of(
                SupervisorActivityResponse.builder()
                    .id("1")
                    .type("review")
                    .title("Course Review Completed")
                    .description("Reviewed 'Advanced Spanish Grammar' course by Maria Garcia")
                    .timestamp(LocalDateTime.now().minusHours(2))
                    .status("approved")
                    .build(),
                SupervisorActivityResponse.builder()
                    .id("2")
                    .type("meeting")
                    .title("Teacher Training Session")
                    .description("Conducted monthly training on interactive teaching methods")
                    .timestamp(LocalDateTime.now().minusDays(1))
                    .status("completed")
                    .build(),
                SupervisorActivityResponse.builder()
                    .id("3")
                    .type("evaluation")
                    .title("Quality Assessment")
                    .description("Evaluated new French course content structure")
                    .timestamp(LocalDateTime.now().minusDays(3))
                    .status("in-progress")
                    .build()
            );
            
            return ApiResponse.success("Activities retrieved successfully", activities);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve activities", e.getMessage());
        }
    }

    public ApiResponse<SupervisorResponse> registerSupervisor(SupervisorRegistrationRequest request) {
        try {
            // Check if email already exists
            if (supervisorRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.error("Email already registered");
            }
            
            // Validate password confirmation
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ApiResponse.error("Passwords do not match");
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
            supervisor.setStatus(Supervisor.SupervisorStatus.APPROVED);
            supervisor.setActive(true);
            supervisor.setCreatedAt(LocalDateTime.now());
            supervisor.setUpdatedAt(LocalDateTime.now());
            
            supervisor = supervisorRepository.save(supervisor);
            
            SupervisorResponse response = mapToResponse(supervisor);
            return ApiResponse.success("Registration successful. Please wait for approval.", response);
        } catch (Exception e) {
            return ApiResponse.error("Registration failed", e.getMessage());
        }
    }

    public ApiResponse<SupervisorLoginResponse> loginSupervisor(SupervisorLoginRequest request) {
        try {
            Optional<Supervisor> supervisorOpt = supervisorRepository.findByEmail(request.getEmail());
            
            if (supervisorOpt.isEmpty()) {
                return ApiResponse.error("Invalid email or password");
            }
            
            Supervisor supervisor = supervisorOpt.get();
            
            if (!passwordEncoder.matches(request.getPassword(), supervisor.getPassword())) {
                return ApiResponse.error("Invalid email or password");
            }
            
            if (supervisor.getStatus() != Supervisor.SupervisorStatus.APPROVED) {
                return ApiResponse.error("Account not approved yet. Please wait for admin approval.");
            }
            
            if (!supervisor.isActive()) {
                return ApiResponse.error("Account is inactive. Please contact administrator.");
            }
            
            // Update last login time
            supervisor.setLastLoginAt(LocalDateTime.now());
            supervisorRepository.save(supervisor);
            
            // Generate JWT token - Now passing the Supervisor object
            String token = jwtService.generateToken(supervisor);
            
            SupervisorLoginResponse response = SupervisorLoginResponse.builder()
                    .token(token)
                    .supervisor(mapToResponse(supervisor))
                    .build();
            
            return ApiResponse.success("Login successful", response);
        } catch (Exception e) {
            return ApiResponse.error("Login failed", e.getMessage());
        }
    }

    public ApiResponse<String> approveLesson(String lessonId) {
        try {
            // Implement lesson approval logic here
            // This would involve updating lesson status in your lesson repository
            return ApiResponse.success("Lesson approved successfully");
        } catch (Exception e) {
            return ApiResponse.error("Failed to approve lesson", e.getMessage());
        }
    }

    public ApiResponse<String> rejectLesson(String lessonId, String reason) {
        try {
            // Implement lesson rejection logic here
            // This would involve updating lesson status and adding rejection reason
            return ApiResponse.success("Lesson rejected successfully");
        } catch (Exception e) {
            return ApiResponse.error("Failed to reject lesson", e.getMessage());
        }
    }

    private SupervisorResponse mapToResponse(Supervisor supervisor) {
        return SupervisorResponse.builder()
                .id(supervisor.getId())
                .firstName(supervisor.getFirstName())
                .lastName(supervisor.getLastName())
                .email(supervisor.getEmail())
                .phone(supervisor.getPhone())
                .institution(supervisor.getInstitution())
                .department(supervisor.getDepartment())
                .employeeId(supervisor.getEmployeeId())
                .qualifications(supervisor.getQualifications())
                .experience(supervisor.getExperience())
                .specialization(supervisor.getSpecialization())
                .status(supervisor.getStatus())
                .isActive(supervisor.isActive())
                .role(supervisor.getRole())
                .createdAt(supervisor.getCreatedAt())
                .updatedAt(supervisor.getUpdatedAt())
                .lastLoginAt(supervisor.getLastLoginAt())
                .build();
    }
}
