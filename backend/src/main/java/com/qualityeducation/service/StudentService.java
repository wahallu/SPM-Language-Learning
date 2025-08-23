package com.qualityeducation.service;

import com.qualityeducation.model.User;
import com.qualityeducation.repository.UserRepository;
import com.qualityeducation.dto.ApiResponse;
import com.qualityeducation.dto.StudentProfileResponse;
import com.qualityeducation.dto.StudentStatsResponse;
import com.qualityeducation.dto.StudentActivityResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class StudentService {
    
    private final UserRepository userRepository;
    
    public ApiResponse<StudentProfileResponse> getStudentProfile(String studentId) {
        try {
            Optional<User> userOpt = userRepository.findById(studentId);
            
            if (userOpt.isEmpty()) {
                return ApiResponse.error("Student not found");
            }
            
            User student = userOpt.get();
            StudentProfileResponse response = mapToProfileResponse(student);
            
            return ApiResponse.success("Profile retrieved successfully", response);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve profile", e.getMessage());
        }
    }
    
    public ApiResponse<StudentProfileResponse> updateStudentProfile(String studentId, User updateData) {
        try {
            Optional<User> userOpt = userRepository.findById(studentId);
            
            if (userOpt.isEmpty()) {
                return ApiResponse.error("Student not found");
            }
            
            User student = userOpt.get();
            
            // Update allowed fields
            if (updateData.getUsername() != null) {
                student.setUsername(updateData.getUsername());
            }
            if (updateData.getEmail() != null) {
                student.setEmail(updateData.getEmail());
            }
            if (updateData.getLanguageToLearn() != null) {
                student.setLanguageToLearn(updateData.getLanguageToLearn());
            }
            if (updateData.getLanguageKnown() != null) {
                student.setLanguageKnown(updateData.getLanguageKnown());
            }
            
            User savedStudent = userRepository.save(student);
            StudentProfileResponse response = mapToProfileResponse(savedStudent);
            
            return ApiResponse.success("Profile updated successfully", response);
        } catch (Exception e) {
            return ApiResponse.error("Failed to update profile", e.getMessage());
        }
    }
    
    public ApiResponse<StudentStatsResponse> getStudentStats(String studentId) {
        try {
            // In a real implementation, you would fetch actual stats from various collections
            StudentStatsResponse stats = StudentStatsResponse.builder()
                .coursesEnrolled(3)
                .coursesCompleted(1)
                .totalXP(2450)
                .currentLevel(5)
                .currentStreak(7)
                .totalLessons(45)
                .completedLessons(34)
                .averageScore(87)
                .timeSpent("24h 30m")
                .achievementsUnlocked(8)
                .build();
            
            return ApiResponse.success("Stats retrieved successfully", stats);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve stats", e.getMessage());
        }
    }
    
    public ApiResponse<List<StudentActivityResponse>> getStudentActivities(String studentId) {
        try {
            // In a real implementation, you would fetch actual activities from the database
            List<StudentActivityResponse> activities = new ArrayList<>();
            
            activities.add(StudentActivityResponse.builder()
                .id("1")
                .type("lesson_completed")
                .title("Completed lesson: Daily Conversations")
                .description("Advanced Conversation Course")
                .timestamp(LocalDateTime.now().minusHours(2).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .xpGained(50)
                .status("completed")
                .build());
                
            activities.add(StudentActivityResponse.builder()
                .id("2")
                .type("quiz_completed")
                .title("Quiz: Grammar Fundamentals")
                .description("Scored 95% on quiz")
                .timestamp(LocalDateTime.now().minusHours(5).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .xpGained(25)
                .score(95)
                .status("completed")
                .build());
            
            return ApiResponse.success("Activities retrieved successfully", activities);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve activities", e.getMessage());
        }
    }
    
    private StudentProfileResponse mapToProfileResponse(User student) {
        return StudentProfileResponse.builder()
            .id(student.getId())
            .username(student.getUsername())
            .email(student.getEmail())
            .languageToLearn(student.getLanguageToLearn())
            .languageKnown(student.getLanguageKnown())
            .role(student.getRole())
            .createdAt(student.getCreatedAt())
            .build();
    }
}