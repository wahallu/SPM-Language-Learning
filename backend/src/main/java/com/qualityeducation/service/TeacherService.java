package com.qualityeducation.service;

import com.qualityeducation.dto.*;
import com.qualityeducation.model.*;
import com.qualityeducation.model.Module;
import com.qualityeducation.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
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
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

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

    /**
     * Get all students enrolled in teacher's courses
     */
    public ApiResponse<List<StudentEnrollmentResponse>> getTeacherStudents(String teacherId) {
        try {
            log.info("Fetching students for teacher: {}", teacherId);

            // Get all enrollments for this teacher's courses
            List<Enrollment> enrollments = enrollmentRepository.findByTeacherId(teacherId);

            // Group enrollments by student
            Map<String, List<Enrollment>> enrollmentsByStudent = enrollments.stream()
                    .collect(Collectors.groupingBy(Enrollment::getStudentId));

            List<StudentEnrollmentResponse> students = new ArrayList<>();

            for (Map.Entry<String, List<Enrollment>> entry : enrollmentsByStudent.entrySet()) {
                String studentId = entry.getKey();
                List<Enrollment> studentEnrollments = entry.getValue();

                // Get student details
                Optional<User> studentOpt = userRepository.findById(studentId);
                if (studentOpt.isEmpty()) {
                    log.warn("Student not found: {}", studentId);
                    continue;
                }

                User student = studentOpt.get();

                // Build course enrollment list
                List<StudentEnrollmentResponse.CourseEnrollment> courseEnrollments = new ArrayList<>();
                
                for (Enrollment enrollment : studentEnrollments) {
                    Optional<Course> courseOpt = courseRepository.findById(enrollment.getCourseId());
                    if (courseOpt.isEmpty()) continue;
                    
                    Course course = courseOpt.get();
                    
                    courseEnrollments.add(StudentEnrollmentResponse.CourseEnrollment.builder()
                            .id(course.getId())
                            .title(course.getTitle())
                            .category(course.getCategory())
                            .progress(enrollment.getProgress())
                            .grade(enrollment.getGrade())
                            .status(enrollment.getStatus())
                            .completedLessons(enrollment.getCompletedLessons())
                            .totalLessons(enrollment.getTotalLessons())
                            .lastActivity(enrollment.getLastActivity())
                            .build());
                }

                // Get earliest enrollment date
                LocalDateTime enrolledDate = studentEnrollments.stream()
                        .map(Enrollment::getEnrolledDate)
                        .min(LocalDateTime::compareTo)
                        .orElse(LocalDateTime.now());

                students.add(StudentEnrollmentResponse.builder()
                        .id(student.getId())
                        .name(student.getUsername()) // or firstName + lastName if available
                        .email(student.getEmail())
                        .avatar(null) // Add avatar field to User model if needed
                        .enrolledDate(enrolledDate)
                        .courses(courseEnrollments)
                        .build());
            }

            // Sort students by name
            students.sort(Comparator.comparing(StudentEnrollmentResponse::getName));

            log.info("Found {} students for teacher {}", students.size(), teacherId);
            return ApiResponse.success("Students retrieved successfully", students);

        } catch (Exception e) {
            log.error("Error fetching students for teacher {}: {}", teacherId, e.getMessage(), e);
            return ApiResponse.error("Failed to retrieve students", e.getMessage());
        }
    }

    /**
     * Get detailed information about a specific student
     */
    public ApiResponse<StudentDetailsResponse> getStudentDetails(String studentId, String teacherId) {
        try {
            log.info("Fetching details for student {} by teacher {}", studentId, teacherId);

            // Get student
            Optional<User> studentOpt = userRepository.findById(studentId);
            if (studentOpt.isEmpty()) {
                return ApiResponse.error("Student not found");
            }
            User student = studentOpt.get();

            // Get all enrollments for this student in teacher's courses
            List<Enrollment> enrollments = enrollmentRepository.findByTeacherId(teacherId).stream()
                    .filter(e -> e.getStudentId().equals(studentId))
                    .collect(Collectors.toList());

            if (enrollments.isEmpty()) {
                return ApiResponse.error("Student is not enrolled in any of your courses");
            }

            // Calculate overall stats
            int totalCourses = enrollments.size();
            int completedCourses = (int) enrollments.stream()
                    .filter(e -> "completed".equals(e.getStatus()))
                    .count();
            int activeCourses = (int) enrollments.stream()
                    .filter(e -> "active".equals(e.getStatus()))
                    .count();
            
            double averageProgress = enrollments.stream()
                    .mapToInt(Enrollment::getProgress)
                    .average()
                    .orElse(0.0);
            
            double averageScore = enrollments.stream()
                    .filter(e -> e.getQuizStats() != null)
                    .mapToDouble(e -> e.getQuizStats().getAverageScore())
                    .average()
                    .orElse(0.0);
            
            int totalLessonsCompleted = enrollments.stream()
                    .mapToInt(Enrollment::getCompletedLessons)
                    .sum();
            
            int currentStreak = enrollments.stream()
                    .mapToInt(Enrollment::getCurrentStreak)
                    .max()
                    .orElse(0);

            StudentDetailsResponse.StudentStats stats = StudentDetailsResponse.StudentStats.builder()
                    .totalCourses(totalCourses)
                    .completedCourses(completedCourses)
                    .activeCourses(activeCourses)
                    .averageProgress(Math.round(averageProgress * 100.0) / 100.0)
                    .averageScore(Math.round(averageScore * 100.0) / 100.0)
                    .totalLessonsCompleted(totalLessonsCompleted)
                    .currentStreak(currentStreak)
                    .build();

            // Build course progress list
            List<StudentDetailsResponse.CourseProgress> courseProgressList = new ArrayList<>();
            
            for (Enrollment enrollment : enrollments) {
                Optional<Course> courseOpt = courseRepository.findById(enrollment.getCourseId());
                if (courseOpt.isEmpty()) continue;
                
                Course course = courseOpt.get();
                
                // Get lessons for this course
                List<Module> modules = moduleRepository.findByCourseIdOrderByOrderAsc(course.getId());
                List<Lesson> allLessons = new ArrayList<>();
                for (Module module : modules) {
                    allLessons.addAll(lessonRepository.findByModuleIdOrderByOrderAsc(module.getId()));
                }
                
                // Build lesson progress list
                List<StudentDetailsResponse.LessonProgress> lessonProgressList = allLessons.stream()
                        .map(lesson -> {
                            Enrollment.LessonProgress lp = enrollment.getLessonProgress().stream()
                                    .filter(progress -> progress.getLessonId().equals(lesson.getId()))
                                    .findFirst()
                                    .orElse(null);
                            
                            return StudentDetailsResponse.LessonProgress.builder()
                                    .id(lesson.getId())
                                    .title(lesson.getTitle())
                                    .completed(lp != null && lp.isCompleted())
                                    .progress(lp != null ? lp.getProgress() : 0)
                                    .completedAt(lp != null ? lp.getCompletedAt() : null)
                                    .quizScore(lp != null ? lp.getQuizScore() : 0)
                                    .timeSpent(lp != null ? lp.getTimeSpent() : 0)
                                    .build();
                        })
                        .collect(Collectors.toList());
                
                // Build quiz stats
                Enrollment.QuizStats enrollmentQuizStats = enrollment.getQuizStats();
                StudentDetailsResponse.QuizStats quizStats = StudentDetailsResponse.QuizStats.builder()
                        .totalQuizzes(enrollmentQuizStats != null ? enrollmentQuizStats.getTotalQuizzes() : 0)
                        .completedQuizzes(enrollmentQuizStats != null ? enrollmentQuizStats.getCompletedQuizzes() : 0)
                        .averageScore(enrollmentQuizStats != null ? enrollmentQuizStats.getAverageScore() : 0.0)
                        .bestScore(enrollmentQuizStats != null ? enrollmentQuizStats.getBestScore() : 0)
                        .totalAttempts(enrollmentQuizStats != null ? enrollmentQuizStats.getTotalAttempts() : 0)
                        .build();
                
                courseProgressList.add(StudentDetailsResponse.CourseProgress.builder()
                        .id(course.getId())
                        .title(course.getTitle())
                        .category(course.getCategory())
                        .progress(enrollment.getProgress())
                        .grade(enrollment.getGrade())
                        .status(enrollment.getStatus())
                        .completedLessons(enrollment.getCompletedLessons())
                        .totalLessons(enrollment.getTotalLessons())
                        .enrolledDate(enrollment.getEnrolledDate())
                        .lastActivity(enrollment.getLastActivity())
                        .lessons(lessonProgressList)
                        .quizStats(quizStats)
                        .build());
            }

            // Get earliest enrollment date
            LocalDateTime enrolledDate = enrollments.stream()
                    .map(Enrollment::getEnrolledDate)
                    .min(LocalDateTime::compareTo)
                    .orElse(LocalDateTime.now());

            StudentDetailsResponse response = StudentDetailsResponse.builder()
                    .id(student.getId())
                    .name(student.getUsername())
                    .email(student.getEmail())
                    .avatar(null) // Add avatar field if available
                    .enrolledDate(enrolledDate)
                    .stats(stats)
                    .courses(courseProgressList)
                    .build();

            return ApiResponse.success("Student details retrieved successfully", response);

        } catch (Exception e) {
            log.error("Error fetching student details for {} by teacher {}: {}", 
                     studentId, teacherId, e.getMessage(), e);
            return ApiResponse.error("Failed to retrieve student details", e.getMessage());
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