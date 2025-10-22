package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class StudentEnrollmentResponse {
    private String id;
    private String name;
    private String email;
    private String avatar;
    private LocalDateTime enrolledDate;
    private List<CourseEnrollment> courses;
    
    @Data
    @Builder
    public static class CourseEnrollment {
        private String id;
        private String title;
        private String category;
        private int progress;
        private String grade;
        private String status;
        private int completedLessons;
        private int totalLessons;
        private LocalDateTime lastActivity;
    }
}