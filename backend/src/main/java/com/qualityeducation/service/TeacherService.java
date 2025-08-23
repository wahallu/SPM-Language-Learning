package com.qualityeducation.service;

import com.qualityeducation.dto.*;
import com.qualityeducation.model.Teacher;
import com.qualityeducation.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public ApiResponse<TeacherResponse> registerTeacher(TeacherRegistrationRequest request) {
        try {
            log.info("Attempting to register teacher with email: {}", request.getEmail());

            // Validate password confirmation
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ApiResponse.error("Password confirmation does not match", null);
            }

            // Check if teacher already exists
            if (teacherRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.error("Teacher with this email already exists", null);
            }

            // Create teacher entity
            Teacher teacher = Teacher.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phone(request.getPhone())
                    .institution(request.getInstitution())
                    .department(request.getDepartment())
                    .qualifications(request.getQualifications())
                    .experience(request.getExperience())
                    .specialization(request.getSpecialization())
                    .status(Teacher.TeacherStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            // Save teacher
            Teacher savedTeacher = teacherRepository.save(teacher);
            log.info("Teacher registered successfully with ID: {}", savedTeacher.getId());

            // Send confirmation email
            try {
                emailService.sendTeacherRegistrationConfirmation(savedTeacher);
            } catch (Exception e) {
                log.warn("Failed to send registration confirmation email: {}", e.getMessage());
            }

            // Send admin notification email
            try {
                emailService.sendTeacherRegistrationNotification(savedTeacher);
            } catch (Exception e) {
                log.warn("Failed to send admin notification email: {}", e.getMessage());
            }

            // Convert to response DTO
            TeacherResponse response = convertToResponse(savedTeacher);

            return ApiResponse.success("Teacher registration successful. Your application is under review.", response);

        } catch (Exception e) {
            log.error("Teacher registration failed for email: {}", request.getEmail(), e);
            return ApiResponse.error("Registration failed: " + e.getMessage(), null);
        }
    }

    public ApiResponse<TeacherLoginResponse> loginTeacher(TeacherLoginRequest request) {
        try {
            log.info("Attempting teacher login for email: {}", request.getEmail());

            // Find teacher by email
            Optional<Teacher> teacherOptional = teacherRepository.findByEmail(request.getEmail());
            if (teacherOptional.isEmpty()) {
                return ApiResponse.error("Invalid email or password", null);
            }

            Teacher teacher = teacherOptional.get();

            // Check if teacher is approved
            if (teacher.getStatus() != Teacher.TeacherStatus.APPROVED &&
                    teacher.getStatus() != Teacher.TeacherStatus.ACTIVE) {
                String message = switch (teacher.getStatus()) {
                    case PENDING -> "Your application is still under review. Please wait for approval.";
                    case REJECTED -> "Your application has been rejected. Please contact support.";
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
                teacher.setLastLoginAt(LocalDateTime.now());
                teacher.setStatus(Teacher.TeacherStatus.ACTIVE);
                teacherRepository.save(teacher);

                // Generate JWT token
                String token = jwtService.generateToken(teacher);

                // Create response
                TeacherResponse teacherResponse = convertToResponse(teacher);
                TeacherLoginResponse loginResponse = TeacherLoginResponse.builder()
                        .token(token)
                        .teacher(teacherResponse)
                        .build();

                log.info("Teacher login successful for email: {}", request.getEmail());
                return ApiResponse.success("Login successful", loginResponse);

            } catch (AuthenticationException e) {
                log.warn("Authentication failed for teacher email: {}", request.getEmail());
                return ApiResponse.error("Invalid email or password", null);
            }

        } catch (Exception e) {
            log.error("Teacher login failed for email: {}", request.getEmail(), e);
            return ApiResponse.error("Login failed: " + e.getMessage(), null);
        }
    }

    public ApiResponse<TeacherResponse> getTeacherProfile(String teacherId) {
        try {
            Optional<Teacher> teacherOptional = teacherRepository.findById(teacherId);
            if (teacherOptional.isEmpty()) {
                return ApiResponse.error("Teacher not found", null);
            }

            TeacherResponse response = convertToResponse(teacherOptional.get());
            return ApiResponse.success("Teacher profile retrieved successfully", response);

        } catch (Exception e) {
            log.error("Failed to get teacher profile for ID: {}", teacherId, e);
            return ApiResponse.error("Failed to retrieve teacher profile", null);
        }
    }

    public ApiResponse<List<TeacherResponse>> getAllTeachers() {
        try {
            List<Teacher> teachers = teacherRepository.findAll();
            List<TeacherResponse> responses = teachers.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Teachers retrieved successfully", responses);

        } catch (Exception e) {
            log.error("Failed to get all teachers", e);
            return ApiResponse.error("Failed to retrieve teachers", null);
        }
    }

    public ApiResponse<List<TeacherResponse>> getTeachersByStatus(Teacher.TeacherStatus status) {
        try {
            List<Teacher> teachers = teacherRepository.findByStatus(status);
            List<TeacherResponse> responses = teachers.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Teachers retrieved successfully", responses);

        } catch (Exception e) {
            log.error("Failed to get teachers by status: {}", status, e);
            return ApiResponse.error("Failed to retrieve teachers", null);
        }
    }

    public ApiResponse<TeacherResponse> approveTeacher(String teacherId) {
        try {
            Optional<Teacher> teacherOptional = teacherRepository.findById(teacherId);
            if (teacherOptional.isEmpty()) {
                return ApiResponse.error("Teacher not found", null);
            }

            Teacher teacher = teacherOptional.get();
            teacher.setStatus(Teacher.TeacherStatus.APPROVED);
            teacher.setUpdatedAt(LocalDateTime.now());

            Teacher savedTeacher = teacherRepository.save(teacher);

            // Send approval email
            try {
                emailService.sendTeacherApprovalEmail(savedTeacher);
            } catch (Exception e) {
                log.warn("Failed to send approval email: {}", e.getMessage());
            }

            TeacherResponse response = convertToResponse(savedTeacher);
            return ApiResponse.success("Teacher approved successfully", response);

        } catch (Exception e) {
            log.error("Failed to approve teacher with ID: {}", teacherId, e);
            return ApiResponse.error("Failed to approve teacher", null);
        }
    }

    public ApiResponse<TeacherResponse> rejectTeacher(String teacherId, String reason) {
        try {
            Optional<Teacher> teacherOptional = teacherRepository.findById(teacherId);
            if (teacherOptional.isEmpty()) {
                return ApiResponse.error("Teacher not found", null);
            }

            Teacher teacher = teacherOptional.get();
            teacher.setStatus(Teacher.TeacherStatus.REJECTED);
            teacher.setUpdatedAt(LocalDateTime.now());

            Teacher savedTeacher = teacherRepository.save(teacher);

            // Send rejection email
            try {
                emailService.sendTeacherRejectionEmail(savedTeacher, reason);
            } catch (Exception e) {
                log.warn("Failed to send rejection email: {}", e.getMessage());
            }

            TeacherResponse response = convertToResponse(savedTeacher);
            return ApiResponse.success("Teacher rejected", response);

        } catch (Exception e) {
            log.error("Failed to reject teacher with ID: {}", teacherId, e);
            return ApiResponse.error("Failed to reject teacher", null);
        }
    }

    public ApiResponse<String> forgotPassword(String email) {
        try {
            Optional<Teacher> teacherOptional = teacherRepository.findByEmail(email);
            if (teacherOptional.isEmpty()) {
                // Don't reveal if email exists or not for security
                return ApiResponse.success(
                        "If a teacher account with this email exists, password reset instructions have been sent.",
                        null);
            }

            Teacher teacher = teacherOptional.get();

            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            teacher.setResetPasswordToken(resetToken);
            teacher.setResetPasswordExpiry(LocalDateTime.now().plusHours(1)); // 1 hour expiry

            teacherRepository.save(teacher);

            // Send reset email
            try {
                emailService.sendTeacherPasswordResetEmail(teacher, resetToken);
            } catch (Exception e) {
                log.error("Failed to send password reset email: {}", e.getMessage());
                return ApiResponse.error("Failed to send password reset email", null);
            }

            return ApiResponse.success("Password reset instructions have been sent to your email.", null);

        } catch (Exception e) {
            log.error("Failed to process forgot password for email: {}", email, e);
            return ApiResponse.error("Failed to process password reset request", null);
        }
    }

    private TeacherResponse convertToResponse(Teacher teacher) {
        return TeacherResponse.builder()
                .id(teacher.getId())
                .firstName(teacher.getFirstName())
                .lastName(teacher.getLastName())
                .email(teacher.getEmail())
                .phone(teacher.getPhone())
                .institution(teacher.getInstitution())
                .department(teacher.getDepartment())
                .qualifications(teacher.getQualifications())
                .experience(teacher.getExperience())
                .specialization(teacher.getSpecialization())
                .status(TeacherResponse.TeacherStatus.valueOf(teacher.getStatus().name()))
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .profileImage(teacher.getProfileImage())
                .bio(teacher.getBio())
                .rating(teacher.getRating())
                .totalStudents(teacher.getTotalStudents())
                .totalCourses(teacher.getTotalCourses())
                .build();
    }
}